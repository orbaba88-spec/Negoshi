import { createClient } from '@supabase/supabase-js'
import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import DealsSection from '../components/DealsSection'
import '../negoshi.css'

export const revalidate = 0

async function getAllDeals() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('deals')
    .select(`id, plan_name, description, price, retail_price, is_featured, is_member_exclusive, affiliate_url, providers ( name, logo_color, logo_text ), categories ( name, slug )`)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('price', { ascending: true })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export default async function DealsPage() {
  const deals = await getAllDeals()
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: '#F7F4EE', padding: '4rem 5% 3rem' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div className="n-sect-eyebrow">Live deals</div>
            <h1 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1A1714', marginBottom: '0.75rem' }}>
              The best deals in Australia,<br />right now.
            </h1>
            <p style={{ fontSize: '1rem', color: '#7A736C', lineHeight: 1.7, maxWidth: 500 }}>
              Every deal checked and updated daily. No paid placements — just the most valuable plans available.
            </p>
          </div>
        </div>
        <DealsSection deals={deals as any} />
      </main>
      <Footer />
    </>
  )
}
