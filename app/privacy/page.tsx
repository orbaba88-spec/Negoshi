import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import '../negoshi.css'

export const metadata = {
  title: 'Privacy Policy — Negoshi',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: '#F7F4EE', padding: '4rem 5% 3rem' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div className="n-sect-eyebrow">Legal</div>
            <h1 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#1A1714', marginBottom: '0.75rem' }}>Privacy Policy</h1>
            <p style={{ fontSize: '0.9rem', color: '#7A736C' }}>Last updated: June 2025</p>
          </div>
        </div>
        <div style={{ padding: '3rem 5% 5rem', maxWidth: 740, margin: '0 auto' }}>
          <div style={{ fontSize: '1rem', color: '#1A1714', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Our commitment</h2>
              <p>Negoshi is committed to protecting your personal information in accordance with the Australian Privacy Act 1988 and the Australian Privacy Principles.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. What we collect</h2>
              <p>We collect the following when you use our platform:</p>
              <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Email address</strong> — when you sign up as a member</li>
                <li><strong>Usage data</strong> — pages visited and links clicked, collected anonymously</li>
                <li><strong>Device information</strong> — browser type and IP address for security purposes</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>We do not collect payment information or sensitive personal information.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. How we use it</h2>
              <p>We use your information to send deal updates and member offers, notify you of collective deals, improve our platform, and comply with legal obligations. We will never sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. How we store it</h2>
              <p>Your data is stored securely using Supabase with industry-standard encryption. We retain your data for as long as you remain a Negoshi member or as required by law.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>5. Third parties</h2>
              <p>We share limited data with trusted services to operate our platform: Resend (email delivery), Vercel (hosting), and Commission Factory (affiliate tracking). These providers only receive the minimum data necessary and are bound to protect your information.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Cookies</h2>
              <p>We use cookies to improve your experience and track affiliate referrals. You can disable cookies in your browser settings, though this may affect some functionality.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>7. Your rights</h2>
              <p>You have the right to access, correct, or delete your personal information, and to withdraw consent to marketing at any time. Contact us at <a href="mailto:hello@negoshi.com.au" style={{ color: '#1B4332' }}>hello@negoshi.com.au</a> to exercise these rights.</p>
            </section>
            <section>
              <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>8. Complaints</h2>
              <p>If you have a privacy concern, contact us at <a href="mailto:hello@negoshi.com.au" style={{ color: '#1B4332' }}>hello@negoshi.com.au</a>. If unsatisfied, you may contact the Office of the Australian Information Commissioner at <a href="https://www.oaic.gov.au" style={{ color: '#1B4332' }}>oaic.gov.au</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}