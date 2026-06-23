import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const clean = email.toLowerCase().trim()

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: clean })

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Negoshi <onboarding@resend.dev>',
        to: clean,
        subject: 'Welcome to Negoshi — you just joined the collective',
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1A1714;">
            <h1 style="font-size: 2rem; font-weight: 700; color: #1B4332; margin-bottom: 0.5rem;">Welcome to Negoshi.</h1>
            <p style="font-size: 1.1rem; color: #7A736C; margin-bottom: 2rem;">You just joined the collective.</p>
            <p style="line-height: 1.8; margin-bottom: 1.25rem;">Every month, Australians overpay for mobile and internet by $40–$50 without realising it. You just took the first step to fixing that.</p>
            <p style="line-height: 1.8; margin-bottom: 1.25rem;">Here is what happens next:</p>
            <ul style="line-height: 2; padding-left: 1.25rem; margin-bottom: 1.5rem;">
              <li>Browse today's best deals at <a href="https://www.negoshi.com.au/deals" style="color: #1B4332;">negoshi.com.au/deals</a></li>
              <li>As our collective grows, we negotiate exclusive wholesale rates</li>
              <li>You will be the first to know when a new member-only deal drops</li>
            </ul>
            <p style="line-height: 1.8; margin-bottom: 2rem;">The more of us, the better the deal. Share Negoshi with one friend today — it costs nothing and saves everyone.</p>
            <a href="https://www.negoshi.com.au/deals" style="display: inline-block; background: #1B4332; color: #fff; padding: 0.85rem 1.75rem; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 0.95rem;">Browse live deals →</a>
            <p style="margin-top: 3rem; font-size: 0.8rem; color: #aaa;">Negoshi · Perth, WA · <a href="https://www.negoshi.com.au" style="color: #aaa;">negoshi.com.au</a></p>
          </div>
        `,
      }),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }

  return NextResponse.json({ ok: true })
}
