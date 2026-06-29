import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find everyone whose promo ends in exactly 7 days
  const target = new Date()
  target.setDate(target.getDate() + 7)
  const dateStr = target.toISOString().split('T')[0]

  const { data: reminders, error } = await supabase
    .from('promo_reminders')
    .select('*')
    .eq('promo_end_date', dateStr)
    .eq('reminder_sent', false)

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  if (!reminders?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const r of reminders) {
    try {
      await resend.emails.send({
        from: 'Negoshi <hello@negoshi.com.au>',
        to: r.email,
        subject: `Your ${r.plan_name} promo ends in 7 days`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:2rem;">
            <h2 style="color:#1A1714;">⏰ Your promo is ending soon</h2>
            <p>Just a heads up — your <strong>${r.plan_name}</strong> promotional rate ends in 7 days.</p>
            <p>Before it reverts to full price, check what's live on Negoshi right now.</p>
            <a href="https://www.negoshi.com.au/deals"
               style="display:inline-block;background:#4A7EC9;color:#fff;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;margin:1rem 0;">
              See today's best deals →
            </a>
            <p style="color:#9A9389;font-size:0.85rem;margin-top:2rem;">
              You set this reminder on Negoshi. 
              <a href="https://www.negoshi.com.au">negoshi.com.au</a>
            </p>
          </div>
        `,
      })
      await supabase
        .from('promo_reminders')
        .update({ reminder_sent: true })
        .eq('id', r.id)
      sent++
    } catch (err) {
      console.error(`Failed for ${r.email}:`, err)
    }
  }

  return NextResponse.json({ sent })
}