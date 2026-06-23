'use client'

import { useEffect, useRef, useState } from 'react'

const MEMBER_COUNT = 2413
const NEXT_MILESTONE = 5000

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return count
}

// ─── Collective Power ─────────────────────────────────────────────────────
export function CollectivePower() {
  const count = useCountUp(MEMBER_COUNT, 1600)
  const [barWidth, setBarWidth] = useState('0%')

  useEffect(() => {
    const t = setTimeout(() => {
      setBarWidth(`${(MEMBER_COUNT / NEXT_MILESTONE * 100).toFixed(2)}%`)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  const bullets = [
    { icon: '✅', label: 'Zero cost to join.', sub: 'Negoshi is free. Always.' },
    { icon: '🔓', label: 'No lock-in.',       sub: 'Switch plans or leave anytime — no strings.' },
    { icon: '🏷️', label: 'Exclusive rates.',  sub: "Member deals can't be found anywhere else." },
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
          to negotiate exclusive wholesale rates directly with providers — rates you
          can't find anywhere else.
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
        <div className="n-coll-vis-title">Members and counting</div>
        <div className="n-coll-counter">{count.toLocaleString()}</div>
        <div className="n-coll-sublabel">Australians in the collective</div>

        <div className="n-milestone-bar">
          <div className="n-milestone-fill" style={{ width: barWidth }} />
        </div>
        <div className="n-milestone-labels">
          <span>Now: <strong>{MEMBER_COUNT.toLocaleString()}</strong></span>
          <span>Next deal: <strong>{NEXT_MILESTONE.toLocaleString()}</strong></span>
        </div>
        <p className="n-milestone-hint">
          At {NEXT_MILESTONE.toLocaleString()} members, we negotiate our next exclusive wholesale rate.
        </p>

        <div className="n-coll-chips">
          {providers.map((p) => <div key={p} className="n-chip">{p}</div>)}
        </div>
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
