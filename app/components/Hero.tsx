export default function Hero() {
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
            Negoshi finds the best mobile and internet rates in Australia —
            updated daily, free to use, no catch.
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
              Free to join · No credit card · Cancel anytime
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