'use client'

import { useState } from 'react'

export type Deal = {
  id: string
  plan_name: string
  description: string | null
  price: number
  retail_price: number
  is_featured: boolean
  is_member_exclusive: boolean
  is_negoshi_pick: boolean
  affiliate_url: string
  speed_down: number | null
  has_lock_in: boolean
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

type Props = { deals: Deal[] }

export default function DealsSection({ deals }: Props) {
  const [category, setCategory] = useState<'mobile' | 'internet'>('mobile')
  const [mobileSub, setMobileSub] = useState<'picks' | 'value' | 'cheapest'>('picks')
  const [internetSub, setInternetSub] = useState<'picks' | 'finder'>('picks')
  const [step, setStep] = useState(1)
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState<string[]>([])
  const [q3, setQ3] = useState<string[]>([])
  const [recommended, setRecommended] = useState<Deal[]>([])

  const mobile = deals.filter(d => d.categories?.slug === 'mobile')
  const internet = deals.filter(d => d.categories?.slug === 'internet')

  const mobileSorted = {
    picks: mobile.filter(d => d.is_negoshi_pick),
    value: [...mobile].sort((a, b) => (a.price / (a.retail_price || 1)) - (b.price / (b.retail_price || 1))),
    cheapest: [...mobile].sort((a, b) => a.price - b.price),
  }

  const saving = (d: Deal) => Math.round(d.retail_price - d.price)

  function toggleQ2(val: string) {
    setQ2(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }

  function toggleQ3(val: string) {
    setQ3(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }

  function findPlan() {
    let minSpeed = 25
    if (q1 === '2-3') minSpeed = 50
    if (q1 === '4plus') minSpeed = 100
    if (q2.includes('gaming')) minSpeed = Math.max(minSpeed, 100)
    if (q2.includes('wfh') || q2.includes('calls')) minSpeed = Math.max(minSpeed, 50)
    if (q2.includes('smarthome') || q2.includes('kids')) minSpeed = Math.max(minSpeed, 50)

    let results = internet.filter(d => (d.speed_down || 0) >= minSpeed)
    if (q3.includes('no-lock-in')) results = results.filter(d => !d.has_lock_in)
    if (q3.includes('fastest')) results = [...results].sort((a, b) => (b.speed_down || 0) - (a.speed_down || 0))
    else results = [...results].sort((a, b) => a.price - b.price)

    setRecommended(results.slice(0, 3))
    setStep(4)
  }

  function resetFinder() {
    setStep(1); setQ1(''); setQ2([]); setQ3([]); setRecommended([])
  }

  const DealCard = ({ deal, label }: { deal: Deal; label?: string }) => (
    <div className={'n-deal-card' + (deal.is_featured ? ' featured' : '')} style={{ position: 'relative' }}>
      {(label || deal.is_negoshi_pick) && <div className="n-featured-label">{label || 'Top Pick'}</div>}
      <div className="n-card-top">
        <div className="n-card-prov">
          <div className="n-card-logo" style={{ background: deal.providers?.logo_color }}>{deal.providers?.logo_text}</div>
          <div>
            <div className="n-card-prov-name">{deal.providers?.name}</div>
            <div className={'n-cat-pill' + (deal.categories?.slug === 'internet' ? ' inet' : '')}>{deal.categories?.name}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="n-card-plan">{deal.plan_name}</div>
        <div className="n-card-spec">{deal.description}</div>
      </div>
      <div className="n-card-pricing">
        <div>
          <div className="n-card-price">${deal.price}</div>
          <div className="n-card-price-lbl">/month</div>
        </div>
        <div className="n-card-retail">${deal.retail_price}/mo retail</div>
      </div>
      <div className="n-card-saving">Save ${saving(deal)}/month</div>
      {deal.is_member_exclusive && <div className="n-member-only">Negoshi member exclusive</div>}
      <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" className="n-deal-btn">Get this deal</a>
    </div>
  )

  return (
    <section className="n-deals-bg">
      <div className="n-deals-inner">
        <div className="n-deals-header">
          <div>
            <div className="n-sect-eyebrow">Hot deals</div>
            <h2 className="n-sect-title" style={{ marginBottom: 0 }}>What is live right now</h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button className={'n-tab' + (category === 'mobile' ? ' active' : '')} onClick={() => setCategory('mobile')} style={{ fontSize: '0.95rem', padding: '0.55rem 1.4rem' }}>Mobile</button>
          <button className={'n-tab' + (category === 'internet' ? ' active' : '')} onClick={() => setCategory('internet')} style={{ fontSize: '0.95rem', padding: '0.55rem 1.4rem' }}>Internet</button>
        </div>

        {category === 'mobile' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
              <button className={'n-tab' + (mobileSub === 'picks' ? ' active' : '')} onClick={() => setMobileSub('picks')} style={{ fontSize: '0.82rem' }}>Top Picks</button>
              <button className={'n-tab' + (mobileSub === 'value' ? ' active' : '')} onClick={() => setMobileSub('value')} style={{ fontSize: '0.82rem' }}>Best Value</button>
              <button className={'n-tab' + (mobileSub === 'cheapest' ? ' active' : '')} onClick={() => setMobileSub('cheapest')} style={{ fontSize: '0.82rem' }}>Lowest Price</button>
            </div>
            {mobileSorted[mobileSub].length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C' }}>No deals yet.</div>
            ) : (
              <div className="n-deals-grid">
                {mobileSorted[mobileSub].slice(0, 6).map(deal => <DealCard key={deal.id} deal={deal} />)}
              </div>
            )}
          </>
        )}

        {category === 'internet' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
              <button className={'n-tab' + (internetSub === 'picks' ? ' active' : '')} onClick={() => { setInternetSub('picks'); resetFinder() }} style={{ fontSize: '0.82rem' }}>Top Picks</button>
              <button className={'n-tab' + (internetSub === 'finder' ? ' active' : '')} onClick={() => setInternetSub('finder')} style={{ fontSize: '0.82rem' }}>Find My Plan</button>
            </div>

            {internetSub === 'picks' && (
              <div className="n-deals-grid">
                {internet.filter(d => d.is_negoshi_pick).slice(0, 6).map(deal => <DealCard key={deal.id} deal={deal} />)}
              </div>
            )}

            {internetSub === 'finder' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '2rem', border: '1px solid rgba(26,23,20,.08)' }}>

                {step === 1 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A736C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Step 1 of 3</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>How many people in your household?</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {[
                        { key: 'just-me', label: 'Just me', desc: 'Solo browsing and streaming' },
                        { key: '2-3', label: '2 to 3 people', desc: 'Couple or small family' },
                        { key: '4plus', label: '4 or more people', desc: 'Large household or heavy use' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => { setQ1(opt.key); setStep(2) }}
                          style={{ display: 'flex', alignItems: 'center', background: q1 === opt.key ? 'rgba(29,67,50,.08)' : '#F7F4EE', border: q1 === opt.key ? '2px solid #1B4332' : '2px solid transparent', borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</div>
                            <div style={{ fontSize: '0.8rem', color: '#7A736C', marginTop: 2 }}>{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A736C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Step 2 of 3</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>What do you use internet for?</h3>
                    <p style={{ fontSize: '0.85rem', color: '#7A736C', marginBottom: '1.5rem' }}>Select all that apply</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.5rem' }}>
                      {[
                        { key: 'streaming', label: 'Browsing and streaming' },
                        { key: 'wfh', label: 'Working from home' },
                        { key: 'gaming', label: 'Gaming and 4K' },
                        { key: 'calls', label: 'Video calls (Zoom, Teams)' },
                        { key: 'smarthome', label: 'Smart home devices' },
                        { key: 'kids', label: 'Kids and family' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => toggleQ2(opt.key)}
                          style={{ background: q2.includes(opt.key) ? 'rgba(29,67,50,.08)' : '#F7F4EE', border: q2.includes(opt.key) ? '2px solid #1B4332' : '2px solid transparent', borderRadius: 10, padding: '0.75rem 1rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: q2.includes(opt.key) ? 600 : 400 }}>
                          {q2.includes(opt.key) ? 'Checked ' : ''}{opt.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => setStep(1)} style={{ padding: '0.7rem 1.25rem', borderRadius: 8, border: '1px solid rgba(26,23,20,.15)', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Back</button>
                      <button onClick={() => setStep(3)} disabled={q2.length === 0} style={{ padding: '0.7rem 1.5rem', borderRadius: 8, background: q2.length > 0 ? '#1B4332' : '#ccc', color: '#fff', border: 'none', cursor: q2.length > 0 ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 600 }}>Next</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A736C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Step 3 of 3</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>What matters most to you?</h3>
                    <p style={{ fontSize: '0.85rem', color: '#7A736C', marginBottom: '1.5rem' }}>Select all that apply</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                      {[
                        { key: 'cheapest', label: 'Lowest price' },
                        { key: 'fastest', label: 'Fastest speed' },
                        { key: 'no-lock-in', label: 'No lock-in contract' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => toggleQ3(opt.key)}
                          style={{ background: q3.includes(opt.key) ? 'rgba(29,67,50,.08)' : '#F7F4EE', border: q3.includes(opt.key) ? '2px solid #1B4332' : '2px solid transparent', borderRadius: 10, padding: '0.85rem 1.25rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: q3.includes(opt.key) ? 600 : 400 }}>
                          {q3.includes(opt.key) ? 'Checked ' : ''}{opt.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => setStep(2)} style={{ padding: '0.7rem 1.25rem', borderRadius: 8, border: '1px solid rgba(26,23,20,.15)', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Back</button>
                      <button onClick={findPlan} disabled={q3.length === 0} style={{ padding: '0.7rem 1.5rem', borderRadius: 8, background: q3.length > 0 ? '#1B4332' : '#ccc', color: '#fff', border: 'none', cursor: q3.length > 0 ? 'pointer' : 'not-allowed', fontSize: '0.875rem', fontWeight: 600 }}>Show my plans</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{recommended.length > 0 ? 'Your best matches' : 'No exact matches found'}</h3>
                      <button onClick={resetFinder} style={{ fontSize: '0.82rem', color: '#1B4332', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Start over</button>
                    </div>
                    {recommended.length === 0 ? (
                      <p style={{ color: '#7A736C', fontSize: '0.9rem' }}>No plans match your criteria yet. Check Top Picks instead.</p>
                    ) : (
                      <div className="n-deals-grid">
                        {recommended.map((deal, i) => <DealCard key={deal.id} deal={deal} label={i === 0 ? 'Best match' : undefined} />)}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </>
        )}

        <div className="n-see-all" style={{ marginTop: '2rem' }}>
          <a href="/deals">See all deals</a>
        </div>
      </div>
    </section>
  )
}