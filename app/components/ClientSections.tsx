'use client'

import { useState } from 'react'

// ─── Collective Power ─────────────────────────────────────────────────────
export function CollectivePower() {
  const bullets = [
    { icon: '✅', label: 'Zero cost to join.', sub: 'Negoshi is free. Always.' },
    { icon: '🔓', label: 'No lock-in.',        sub: 'Switch plans or leave anytime — no strings.' },
    { icon: '🔍', label: 'We do the research.', sub: 'Every deal checked and updated daily so you don\'t have to.' },
  ]

  const providers = ['Telstra', 'Optus', 'Vodafone', 'Aussie BB', 'Superloop']

  return (
    <section className="n-collective">
      <div>
        <div className="n-sect-eyebrow">The Negoshi model</div>
        <h2 className="n-sect-title">
          The more of us,<br />
          the lower the bill
        </h2>
        <p className="n-sect-sub">
          Negoshi isn't just a deals site. We use our growing member base as leverage
          to negotiate better rates directly with providers — and we list every good
          deal we find, regardless of whether we earn a commission on it.
        </p>
        <div className="n-coll-bullets">
          {bullets.map((b) => (
            <div key={b.label} className="n-coll-bullet">
              <div className="n-coll-icon">{b.icon}</div>
              <p className="n-coll-text">
                <strong>{b.label}</strong> {b.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="n-coll-visual">
        <div className="n-coll-vis-title">Providers we track</div>
        <div className="n-coll-chips" style={{ marginTop: '1rem' }}>
          {providers.map((p) => <div key={p} className="n-chip">{p}</div>)}
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
          Some links earn Negoshi a small commission — at no extra cost to you.{' '}
          <a href="/disclaimer" style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.7)' }}>
            How we make money
          </a>
        </p>
      </div>
    </section>
  )
}

// ─── CTA / Join section ───────────────────────────────────────────────────
export function CTASection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage('You\'re in! Welcome to Negoshi.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="join" className="n-cta">
      <h2>
        Join the collective.<br />
        <em>Pay less every month.</em>
      </h2>
      <p className="n-cta-sub">
        Free, takes 30 seconds, and you'll never pay full price for mobile or internet again.
      </p>

      {status === 'success' ? (
        <p style={{ color: '#7AE3A0', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          🎉 {message}
        </p>
      ) : (
        <div className="n-email-form">
          <input
            className="n-email-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="n-cta-btn" onClick={handleSubmit} disabled={status === 'loading'}>
            {status === 'loading' ? 'Joining...' : 'Join free →'}
          </button>
        </div>
      )}

      {message && status !== 'success' && (
        <p style={{ color: 'rgba(255,160,160,0.85)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          {message}
        </p>
      )}

      <p className="n-cta-note">No spam. No credit card. Leave anytime.</p>
    </section>
  )
}