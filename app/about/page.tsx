import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import '../negoshi.css'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: '#F7F4EE', padding: '5rem 5% 4rem' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div className="n-sect-eyebrow">Our story</div>
            <h1 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#1A1714', marginBottom: '1.5rem' }}>
              Australians pay too much.<br />
              <em style={{ fontStyle: 'italic', color: '#1B4332' }}>That ends here.</em>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#7A736C', lineHeight: 1.75 }}>
              Negoshi started with a simple conversation — and a number that did not make sense.
            </p>
          </div>
        </div>
        <div style={{ padding: '4rem 5%', maxWidth: 740, margin: '0 auto' }}>
          <div style={{ fontSize: '1.05rem', color: '#1A1714', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>It started with a question. Talking to friends about their phone bills, one thing stood out — nobody had changed their provider in years. When asked how much they were paying, the answer was always the same: too much. Sometimes $40, sometimes $50 more per month than they needed to be.</p>
            <p>That did not make sense. Better deals exist. Switching takes 10 minutes. So why was nobody doing it?</p>
            <p>Some were too busy. Some found it confusing. But most were simply being <strong>punished for being loyal</strong> — staying with the same provider year after year while new customers got all the good deals. The system was built to take advantage of people who did not have the time or energy to fight back.</p>
            <p>So Negoshi was built to fight back for them.</p>
          </div>
          <div style={{ margin: '3rem 0', borderLeft: '3px solid #1B4332', paddingLeft: '1.75rem' }}>
            <p style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', fontWeight: 500, fontStyle: 'italic', color: '#1B4332', lineHeight: 1.4, margin: 0 }}>
              "A family of 4 could save over $2,000 a year just by switching to a better deal."
            </p>
          </div>
          <div style={{ fontSize: '1.05rem', color: '#1A1714', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>Negoshi does two things. First, it shows you the best mobile and internet deals available right now — no fluff, no paid placements, just the most valuable options clearly laid out.</p>
            <p>Second — as our member base grows, so does our power. When enough Australians join, Negoshi negotiates <strong>exclusive wholesale rates</strong> directly with the big providers. Rates only available to Negoshi members. For free.</p>
            <p>The more of us, the better the deal.</p>
          </div>
        </div>
        <div style={{ background: '#1B4332', padding: '5rem 5%' }}>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Where we are going</div>
            <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem' }}>Mobile and internet is just the start.</h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '1.5rem' }}>The vision for Negoshi is bigger than phone plans. The same system that gets you a better mobile deal can work for electricity, gas, insurance, fuel, groceries — anything you pay for every month without thinking about it.</p>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2.5rem' }}>Australians have been absorbing price hikes quietly for too long. Negoshi is about building enough collective power that the big companies have to come to us — not the other way around.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {['Mobile','Internet','Electricity','Gas','Insurance','Fuel','Groceries'].map((item, i) => (
                <div key={item} style={{ background: i < 2 ? 'rgba(201,148,58,0.25)' : 'rgba(255,255,255,0.1)', border: i < 2 ? '1px solid rgba(201,148,58,0.5)' : '1px solid rgba(255,255,255,0.15)', borderRadius: 100, padding: '0.4rem 1rem', fontSize: '0.85rem', color: i < 2 ? '#C9943A' : 'rgba(255,255,255,0.6)', fontWeight: i < 2 ? 600 : 400 }}>
                  {i < 2 ? `✓ ${item}` : item}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '1rem' }}>✓ Live now · Others coming as we grow</p>
          </div>
        </div>
        <div style={{ padding: '5rem 5%', textAlign: 'center', background: '#F7F4EE' }}>
          <div style={{ maxWidth: 500, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display), Fraunces, serif', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#1A1714' }}>Ready to stop overpaying?</h2>
            <p style={{ color: '#7A736C', marginBottom: '2rem', lineHeight: 1.7 }}>Join free. Browse deals. Save every month.</p>
            <a href="/#join" className="n-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>Join the collective →</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
