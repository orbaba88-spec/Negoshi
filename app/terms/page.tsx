import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import '../negoshi.css'

export const metadata = {
  title: 'Terms of Use — Negoshi',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: '#F7F4EE', padding: '4rem 5% 3rem' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div className="n-sect-eyebrow">Legal</div>
            <h1 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1A1714', marginBottom: '0.75rem' }}>Terms of Use</h1>
            <p style={{ fontSize: '0.9rem', color: '#7A736C' }}>Last updated: June 2025</p>
          </div>
        </div>
        <div style={{ padding: '3rem 5% 5rem', maxWidth: 740, margin: '0 auto' }}>
          <div style={{ fontSize: '1rem', color: '#1A1714', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. About Negoshi</h2>
              <p>Negoshi is an Australian online platform operated as a sole trader business based in Perth, Western Australia. We provide deal comparison and collective buying services for mobile and internet plans. By using negoshi.com.au you agree to these Terms of Use.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Information accuracy</h2>
              <p>We strive to keep deal information accurate and up to date. However, prices, plan inclusions, and availability can change at any time without notice. All deals displayed on Negoshi are sourced from third-party providers and are provided for general information only. Always confirm current pricing directly with the provider before making any purchasing decision.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. Affiliate relationships</h2>
              <p>Negoshi earns commissions when users click certain links and make purchases with partner providers. This does not affect the price you pay. Our affiliate relationships do not influence which deals we display or recommend. Please see our Affiliate Disclaimer for full details.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. Membership</h2>
              <p>Joining Negoshi is free. By providing your email address you agree to receive communications from Negoshi. You may unsubscribe at any time by clicking the unsubscribe link in any email we send you.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>5. Limitation of liability</h2>
              <p>To the maximum extent permitted by Australian law, Negoshi is not liable for any loss or damage arising from your use of this website, including inaccurate pricing, changes made by third-party providers, or any transaction made with a provider. Nothing in these terms excludes rights you have under the Australian Consumer Law.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Third-party links</h2>
              <p>Our website contains links to third-party websites for your convenience only. We have no control over those websites and accept no responsibility for them.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>7. Intellectual property</h2>
              <p>All content on this website including text, graphics, logos, and design is the property of Negoshi. You may not reproduce or use any content without our written permission.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>8. Governing law</h2>
              <p>These terms are governed by the laws of Western Australia and the Commonwealth of Australia.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>9. Contact</h2>
              <p>Questions? Email us at <a href="mailto:hello@negoshi.com.au" style={{ color: '#1B4332' }}>hello@negoshi.com.au</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}