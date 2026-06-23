import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { parseCFDatafeed, PROVIDER_MAP } from '@/lib/cf-datafeed'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const log: string[] = []
  const timestamp = new Date().toISOString()

  try {
    const cfFeedUrl = process.env.CF_DATAFEED_URL
    if (!cfFeedUrl) {
      return NextResponse.json({ error: 'CF_DATAFEED_URL not set' }, { status: 500 })
    }

    log.push(`Fetching CF datafeed...`)
    const feedRes = await fetch(cfFeedUrl, { next: { revalidate: 0 } })
    if (!feedRes.ok) throw new Error(`CF fetch failed: ${feedRes.status}`)

    const xmlString = await feedRes.text()
    const parsedDeals = parseCFDatafeed(xmlString)
    log.push(`Parsed ${parsedDeals.length} deals`)

    const { data: providers } = await supabase.from('providers').select('id, name')
    const providerIdMap: Record<string, string> = {}
    for (const p of providers ?? []) providerIdMap[p.name] = p.id

    const { data: categories } = await supabase.from('categories').select('id, slug')
    const categoryIdMap: Record<string, string> = {}
    for (const c of categories ?? []) categoryIdMap[c.slug] = c.id

    let upserted = 0
    let skipped = 0

    for (const deal of parsedDeals) {
      const providerId = providerIdMap[deal.provider_name]
      const categoryId = categoryIdMap[deal.category_slug]
      if (!providerId || !categoryId) { skipped++; continue }

      const { error } = await supabase.from('deals').upsert(
        {
          cf_product_id: deal.cf_product_id,
          plan_name: deal.plan_name,
          description: deal.description,
          price: deal.price,
          retail_price: deal.retail_price,
          affiliate_url: deal.affiliate_url,
          provider_id: providerId,
          category_id: categoryId,
          data_gb: deal.data_gb,
          expires_at: deal.expires_at,
          is_active: true,
          is_member_exclusive: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'cf_product_id', ignoreDuplicates: false }
      )
      if (error) { skipped++ } else { upserted++ }
    }

    log.push(`Upserted: ${upserted}, Skipped: ${skipped}`)

    await supabase
      .from('deals')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)

    revalidatePath('/')
    revalidatePath('/deals')

    await supabase.from('sync_log').insert({
      ran_at: timestamp,
      deals_synced: upserted,
      notes: log.join('\n'),
    })

    return NextResponse.json({ ok: true, synced: upserted, log })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message, log }, { status: 500 })
  }
}
