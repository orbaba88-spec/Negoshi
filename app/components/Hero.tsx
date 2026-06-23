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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const previewDeals = [
    { logo: 'TEL', color: '#0057B8', name: 'Telstra 30GB Mobile', detail: '30-day · Unlimited calls & SMS', price: '$22', was: '$45', save: 'Save $23/mo' },
    { logo: 'OPT', color: '#FF6B00', name: 'Optus Unlimited',     detail: 'No contract · All calls & SMS',  price: '$35', was: '$55', save: 'Save $20/mo' },
    { logo: 'ABB', color: '#1B4332', name: 'NBN 100/20 Home Fast', detail: 'Internet · Unlimited · No lock-in', price: '$65', was: '$89', save: 'Save $24/mo' },
  ]

  return (
    <div className="n-hero-wrap">
      <div className="n-hero">
        {/* Left — copy */}
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

        {/* Right — deal card previews */}
        <div className="n-hero-visual">
          <div className="n-member-badge">🔑 Negoshi member rate</div>
          {previewDeals.map((deal, i) => (
            <div
              key={i}
              className={`n-deal-preview${visible ? ' visible' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="n-dp-logo" style={{ background: deal.color }}>{deal.logo}</div>
              <div className="n-dp-info">
                <div className="n-dp-name">{deal.name}</div>
                <div className="n-dp-detail">{deal.detail}</div>
              </div>
              <div className="n-dp-pricing">
                <div className="n-dp-price">{deal.price}<span style={{ fontSize: '0.85rem' }}>/mo</span></div>
                <div className="n-dp-was">was {deal.was}</div>
                <div className="n-save-badge">{deal.save}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
