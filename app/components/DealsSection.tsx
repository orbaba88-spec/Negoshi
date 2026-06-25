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
  internet_tier: string | null
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

type Props = { deals: Deal[] }

export default function DealsSection({ deals }: Props) {
  const [category, setCategory] = useState<'mobile' | 'internet'>('mobile')
  const [mobileSub, setMobileSub] = useState<'picks' | 'value' | 'cheapest'>('picks')
  const [internetSub, setInternetSub] = useState<'cheapest' | 'fastest' | 'sweet'>('cheapest')
  const [cheapestTier, setCheapestTier] = useState<'solo' | 'small' | 'family'>('solo')

  const mobile = deals.filter(d => d.categories?.slug === 'mobile')
  const internet = deals.filter(d => d.categories?.slug === 'internet')

  const mobileSorted = {
    picks: mobile.filter(d => d.is_negoshi_pick),
    value: [...mobile].sort((a, b) => (a.price / (a.retail_price || 1)) - (b.price / (b.retail_price || 1))),
    cheapest: [...mobile].sort((a, b) => a.price - b.price),
  }

  const internetSorted = {
    cheapest: internet.filter(d => d.internet_tier === cheapestTier).sort((a, b) => a.price - b.price),
    fastest: [...internet].sort((a, b) => (b.speed_down || 0) - (a.speed_down || 0)),
    sweet: internet.filter(d => d.price <= 80 && (d.speed_down || 0) >= 100).sort((a, b) => (b.speed_down || 0) / b.price - (a.speed_down || 0) / a.price),
  }

  const saving = (d: Deal) => Math.round(d.retail_price - d.price)

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
      {saving(deal) > 0 && <div className="n-card-saving">Save ${saving(deal)}/month</div>}
      {deal.speed_down && <div style={{ fontSize: '0.78rem', color: '#185FA5', fontWeight: 600 }}>{deal.speed_down} Mbps</div>}
      {deal.is_member_exclusive && <div className="n-member-only">Negoshi member exclusive</div>}
      <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" className="n-deal-btn">Get this deal</a>
    </div>
  )

  const Tab = ({ active, onClick, label, small }: { active: boolean; onClick: () => void; label: string; small?: boolean }) => (
    <button className={'n-tab' + (active ? ' active' : '')} onClick={onClick} style={{ fontSize: small ? '0.82rem' : '0.95rem', padding: small ? '0.45rem 1rem' : '0.55rem 1.4rem' }}>{label}</button>
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
          <Tab active={category === 'mobile'} onClick={() => setCategory('mobile')} label="Mobile" />
          <Tab active={category === 'internet'} onClick={() => setCategory('internet')} label="Internet" />
        </div>

        {category === 'mobile' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
              <Tab active={mobileSub === 'picks'} onClick={() => setMobileSub('picks')} label="Top Picks" small />
              <Tab active={mobileSub === 'value'} onClick={() => setMobileSub('value')} label="Best Value" small />
              <Tab active={mobileSub === 'cheapest'} onClick={() => setMobileSub('cheapest')} label="Lowest Price" small />
            </div>
            {mobileSorted[mobileSub].length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C' }}>No deals in this category yet.</div>
            ) : (
              <div className="n-deals-grid">
                {mobileSorted[mobileSub].slice(0, 6).map(deal => <DealCard key={deal.id} deal={deal} />)}
              </div>
            )}
          </>
        )}

        {category === 'internet' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <Tab active={internetSub === 'cheapest'} onClick={() => setInternetSub('cheapest')} label="Cheapest Price" small />
              <Tab active={internetSub === 'fastest'} onClick={() => setInternetSub('fastest')} label="Fastest Speed" small />
              <Tab active={internetSub === 'sweet'} onClick={() => setInternetSub('sweet')} label="Sweet Spot" small />
            </div>

            {internetSub === 'cheapest' && (
              <>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
                  <Tab active={cheapestTier === 'solo'} onClick={() => setCheapestTier('solo')} label="Solo / Couple" small />
                  <Tab active={cheapestTier === 'small'} onClick={() => setCheapestTier('small')} label="Small Family" small />
                  <Tab active={cheapestTier === 'family'} onClick={() => setCheapestTier('family')} label="Family 4+" small />
                </div>
                {internetSorted.cheapest.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C', background: '#fff', borderRadius: 14 }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No plans assigned to this tier yet.</p>
                    <p style={{ fontSize: '0.85rem' }}>Go to the admin page and set the Internet Tier for your plans.</p>
                  </div>
                ) : (
                  <div className="n-deals-grid">
                    {internetSorted.cheapest.slice(0, 6).map(deal => <DealCard key={deal.id} deal={deal} />)}
                  </div>
                )}
              </>
            )}

            {internetSub === 'fastest' && (
              <div className="n-deals-grid">
                {internetSorted.fastest.slice(0, 6).map((deal, i) => <DealCard key={deal.id} deal={deal} label={i === 0 ? 'Fastest' : undefined} />)}
              </div>
            )}

            {internetSub === 'sweet' && (
              internetSorted.sweet.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C' }}>No sweet spot deals found yet.</div>
              ) : (
                <div className="n-deals-grid">
                  {internetSorted.sweet.slice(0, 6).map((deal, i) => <DealCard key={deal.id} deal={deal} label={i === 0 ? 'Best balance' : undefined} />)}
                </div>
              )
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