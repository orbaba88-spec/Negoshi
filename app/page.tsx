import { createClient } from '@supabase/supabase-js'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { StatsBar, HowItWorks, Footer } from './components/StaticSections'
import DealsSection from './components/DealsSection'
import { CollectivePower, CTASection } from './components/ClientSections'
import './negoshi.css'

async function getDeals() {
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
    .limit(6)
  if (error) { console.error(error); return [] }
  return data ?? []
}

export default async function HomePage() {
  const deals = await getDeals()
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <DealsSection deals={deals as any} />
        <CollectivePower />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
