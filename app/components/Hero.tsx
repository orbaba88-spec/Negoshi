'use client'

import { useEffect, useState, useRef } from 'react'

const MEMBER_COUNT = 2413

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return count
}

export default function Hero() {
  const count = useCountUp(MEMBER_COUNT)

  return (
    <div className="n-hero-wrap">
      <div className="n-hero">
        <div>
          <div className="n-eyebrow">
            <div className="n-pulse" />
            Live deals · Updated daily
          </div>
          <h1>
            Together,<br />
            we <em>pay less.</em>
          </h1>
          <p className="n-hero-sub">
            Negoshi pools Australians together to unlock mobile and internet rates
            you simply can't get on your own. The more members, the stronger our deal.
          </p>
          <a href="#join" className="n-btn-primary">
            Join free — 30 seconds →
          </a>
          <div className="n-trust">
            <div className="n-avatars">
              {['#4A7EC9','#7B68EE','#D07070','#3A9E6A'].map((bg, i) => (
                <div key={i} className="n-avatar" style={{ background: bg }}>
                  {['SL','MR','AK','TN'][i]}
                </div>
              ))}
            </div>
            <span className="n-trust-text">
              <strong>{count.toLocaleString()}</strong> Australians already saving
            </span>
          </div>
        </div>
        <div className="n-hero-visual">
          <div className="n-member-badge">🔑 Negoshi member rate</div>
          <div style={{ background: '#fff', borderRadius: 14, padding: '2rem', border: '1px solid rgba(26,23,20,.07)', textAlign: 'center', color: '#7A736C', fontSize: '0.9rem' }}>
            Live deals loading below ↓
          </div>
        </div>
      </div>
    </div>
  )
}
