// app/api/cron/sync-deals/route.ts
// Runs daily via Vercel Cron (vercel.json schedule: "0 18 * * *" = 2am AEST)
// 1. Fetches your Commission Factory XML datafeed
// 2. Parses deals and upserts them into Supabase
// 3. Marks expired deals as inactive
// 4. Triggers a revalidation of the homepage cache

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { parseCFDatafeed, PROVIDER_MAP } from '@/lib/cf-datafeed'
import { revalidatePath } from 'next/cache'

// ─── Supabase admin client ─────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Main handler ─────────────────────────────────────────────────────────
export async function GET(request: Request) {
  // Security: Vercel signs cron requests with CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  const timestamp = new Date().toISOString()

  try {
    // ── Step 1: Fetch Commission Factory datafeed ──────────────────────────
    // Find your datafeed URL in: CF Dashboard → Publishers → Datafeeds
    const cfFeedUrl = process.env.CF_DATAFEED_URL
    if (!cfFeedUrl) {
      return NextResponse.json({ error: 'CF_DATAFEED_URL not set in env vars' }, { status: 500 })
    }

    log.push(`[${timestamp}] Fetching CF datafeed...`)
    const feedRes = await fetch(cfFeedUrl, {
      headers: { 'User-Agent': 'Negoshi/1.0 deal-sync' },
      next: { revalidate: 0 }, // Always fresh, never cached
    })

    if (!feedRes.ok) {
      throw new Error(`CF datafeed fetch failed: ${feedRes.status} ${feedRes.statusText}`)
    }

    const xmlString = await feedRes.text()
    log.push(`Datafeed fetched — ${xmlString.length} bytes`)

    // ── Step 2: Parse deals ────────────────────────────────────────────────
    const parsedDeals = parseCFDatafeed(xmlString)
    log.push(`Parsed ${parsedDeals.length} deals from datafeed`)

    if (parsedDeals.length === 0) {
      log.push('Warning: 0 deals parsed — check datafeed URL and merchant approvals')
    }

    // ── Step 3: Resolve provider IDs from Supabase ────────────────────────
    const { data: providers } = await supabase
      .from('providers')
      .select('id, name')

    const providerIdMap: Record<string, string> = {}
    for (const p of providers ?? []) {
      providerIdMap[p.name] = p.id
    }

    // Upsert any new providers we see in the datafeed
    const uniqueProviders = [...new Set(parsedDeals.map(d => d.provider_name))]
    for (const provName of uniqueProviders) {
      if (!providerIdMap[provName]) {
        const meta = PROVIDER_MAP[provName]
        const { data: newProv } = await supabase
          .from('providers')
          .upsert({ name: provName, logo_color: meta?.logo_color ?? '#888', logo_text: meta?.logo_text ?? '?' }, { onConflict: 'name' })
          .select('id')
          .single()
        if (newProv) providerIdMap[provName] = newProv.id
      }
    }

    // ── Step 4: Resolve category IDs ──────────────────────────────────────
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug')

    const categoryIdMap: Record<string, string> = {}
    for (const c of categories ?? []) {
      categoryIdMap[c.slug] = c.id
    }

    // ── Step 5: Upsert deals into Supabase ─────────────────────────────────
    let upserted = 0
    let skipped  = 0

    for (const deal of parsedDeals) {
      const providerId = providerIdMap[deal.provider_name]
      const categoryId = categoryIdMap[deal.category_slug]

      if (!providerId || !categoryId) {
        skipped++
        continue
      }

      const { error } = await supabase
        .from('deals')
        .upsert(
          {
            cf_product_id:       deal.cf_product_id,
            plan_name:           deal.plan_name,
            description:         deal.description,
            price:               deal.price,
            retail_price:        deal.retail_price,
            affiliate_url:       deal.affiliate_url,
            provider_id:         providerId,
            category_id:         categoryId,
            data_gb:             deal.data_gb,
            expires_at:          deal.expires_at,
            is_active:           true,
            is_member_exclusive: false, // CF deals are public; exclusives are set manually
            updated_at:          new Date().toISOString(),
          },
          {
            onConflict: 'cf_product_id', // Update if we've seen this deal before
            ignoreDuplicates: false,
          }
        )

      if (error) {
        log.push(`Upsert error for "${deal.plan_name}": ${error.message}`)
        skipped++
      } else {
        upserted++
      }
    }

    log.push(`Upserted: ${upserted}, Skipped: ${skipped}`)

    // ── Step 6: Auto-expire deals past their expiry date ──────────────────
    const { count: expired } = await supabase
      .from('deals')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)
      .select('id', { count: 'exact', head: true })

    log.push(`Auto-expired: ${expired ?? 0} deals`)

    // ── Step 7: Revalidate homepage so users see fresh deals ──────────────
    revalidatePath('/')
    revalidatePath('/deals')
    log.push('Cache revalidated — homepage will show fresh deals on next request')

    // ── Step 8: Log this run to Supabase for visibility ───────────────────
    await supabase.from('sync_log').insert({
      ran_at:       timestamp,
      deals_synced: upserted,
      deals_expired: expired ?? 0,
      notes:        log.join('\n'),
    })

    return NextResponse.json({
      ok:      true,
      synced:  upserted,
      expired: expired ?? 0,
      log,
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    log.push(`ERROR: ${message}`)

    // Log the failure too
    await supabase.from('sync_log').insert({
      ran_at: timestamp,
      notes:  log.join('\n'),
      error:  message,
    }).catch(() => {}) // Don't throw if the log insert itself fails

    return NextResponse.json({ error: message, log }, { status: 500 })
  }
}
