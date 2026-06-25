import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import '../negoshi.css'

export const metadata = {
  title: 'Affiliate Disclaimer — Negoshi',
}

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: '#F7F4EE', padding: '4rem 5% 3rem' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div className="n-sect-eyebrow">Legal</div>
            <h1 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1A1714', marginBottom: '0.75rem' }}>Affiliate Disclaimer</h1>
            <p style={{ fontSize: '0.9rem', color: '#7A736C' }}>Last updated: June 2025</p>
          </div>
        </div>
        <div style={{ padding: '3rem 5% 5rem', maxWidth: 740, margin: '0 auto' }}>
          <div style={{ fontSize: '1rem', color: '#1A1714', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section style={{ background: '#F7F4EE', borderRadius: 14, padding: '1.5rem 1.75rem', borderLeft: '3px solid #1B4332' }}>
              <p style={{ fontWeight: 600 }}>In plain English: some links on Negoshi are affiliate links. If you click one and sign up, we may earn a small commission — at zero extra cost to you. This is how we keep the platform free.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>How affiliate links work</h2>
              <p>Negoshi partners with telecommunications providers and affiliate networks including Commission Factory. When you click a deal link and complete a sign-up, we may receive a commission from the provider. This commission is paid by the provider — not by you. The price you pay is the same whether or not you arrived via our link.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Our editorial independence</h2>
              <p>Our affiliate relationships do not influence which deals we feature or how we rank them. Deals are selected based on value to our members — not commission rates. We also display deals that earn us no commission at all.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Collective negotiation</h2>
              <p>In addition to affiliate commissions, Negoshi negotiates wholesale rates directly with providers on behalf of our member collective. These exclusive deals are offered to members at no cost. Negoshi may earn a margin on these wholesale arrangements.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>ACCC compliance</h2>
              <p>This disclosure is made in accordance with ACCC guidelines on endorsements and affiliate marketing. We are committed to full transparency in all commercial relationships.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Questions</h2>
              <p>Contact us at <a href="mailto:hello@negoshi.com.au" style={{ color: '#1B4332' }}>hello@negoshi.com.au</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}