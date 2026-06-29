// ─── StatsBar ──────────────────────────────────────────────────────────────
export function StatsBar() {
  const stats = [
    { num: '47',   lbl: 'Live deals today'    },
    { num: '20+',  lbl: 'Providers compared'  },
    { num: '$34',  lbl: 'Avg monthly saving'  },
    { num: '$0',   lbl: 'Cost to join'        },
  ]
  return (
    <div className="n-stats">
      <div className="n-stats-inner">
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div>
              <div className="n-stat-num">{s.num}</div>
              <div className="n-stat-lbl">{s.lbl}</div>
            </div>
            {i < stats.length - 1 && <div className="n-stat-div" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HowItWorks ────────────────────────────────────────────────────────────
export function HowItWorks() {
  const steps = [
    {
      icon: '🔍',
      title: "Browse today's deals",
      desc: 'See the best mobile and internet plans updated daily — with live pricing and real savings shown upfront.',
    },
    {
      icon: '✉️',
      title: 'Join free in 30 seconds',
      desc: 'Drop your email to become a Negoshi member. No credit card, no commitment — just access to the best rates we find.',
    },
    {
      icon: '💸',
      title: 'Pay less, every month',
      desc: 'The more Australians join, the more leverage we have to negotiate better rates directly with providers.',
    },
  ]
  return (
    <section id="how-it-works" className="n-sect">
      <div className="n-sect-eyebrow">How it works</div>
      <h2 className="n-sect-title">Three steps to paying less</h2>
      <p className="n-sect-sub">No hidden fees, no credit card, no catch. Negoshi is free because saving money should be.</p>
      <div className="n-steps">
        {steps.map((s, i) => (
          <div key={i} className="n-step" data-n={i + 1}>
            <div className="n-step-icon">{s.icon}</div>
            <div className="n-step-title">{s.title}</div>
            <p className="n-step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#9A9389' }}>
        Some links earn Negoshi a small commission — at no extra cost to you.{' '}
        <a href="/disclaimer" style={{ textDecoration: 'underline' }}>How we make money</a>
      </p>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────
export function Footer() {
  const links = [
    { label: 'Deals',                href: '/deals' },
    { label: 'About',                href: '/about' },
    { label: 'Privacy Policy',       href: '/privacy' },
    { label: 'Terms of Use',         href: '/terms' },
    { label: 'Affiliate Disclaimer', href: '/disclaimer' },
    { label: 'Contact',              href: 'mailto:hello@negoshi.com.au' },
  ]
  return (
    <footer className="n-footer">
      <div className="n-footer-inner">
        <span className="n-footer-logo">Nego<span>shi</span></span>
        <ul className="n-footer-links">
          {links.map((l) => (
            <li key={l.label}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <span className="n-footer-copy">© 2025 Negoshi Pty Ltd · Perth, WA</span>
      </div>
    </footer>
  )
}