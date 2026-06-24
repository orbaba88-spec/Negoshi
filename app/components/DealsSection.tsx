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
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

type Props = { deals: Deal[] }

export default function DealsSection({ deals }: Props) {
  const [activeTab, setActiveTab] = useState<'picks' | 'cheapest' | 'value'>('picks')

  const sorted = {
    picks:    [...deals].filter(d => d.is_negoshi_pick),
    cheapest: [...deals].sort((a, b) => a.price - b.price),
    value:    [...deals].sort((a, b) => (a.price / (a.retail_price || 1)) - (b.price / (b.retail_price || 1))),
  }

  const filtered = sorted[activeTab].slice(0, 6)
  const saving = (d: Deal) => Math.round(d.retail_price - d.price)

  const tabs = [
    { key: 'picks',    label: '⭐ Negoshi best picks' },
    { key: 'cheapest', label: '💰 Lowest price'       },
    { key: 'value',    label: '📊 Most data per $'    },
  ] as const

  return (
    <section className="n-deals-bg">
      <div className="n-deals-inner">
        <div className="n-deals-header">
          <div>
            <div className="n-sect-eyebrow">Hot deals</div>
            <h2 className="n-sect-title" style={{ marginBottom: 0 }}>What's live right now</h2>
          </div>
          <div className="n-tab-bar">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`n-tab${activeTab === t.key ? ' active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C', fontSize: '0.95rem' }}>
            No deals in this category yet — check back soon.
          </div>
        ) : (
          <div className="n-deals-grid">
            {filtered.map((deal) => (
              <div
                key={deal.id}
                className={`n-deal-card${deal.is_featured ? ' featured' : ''}`}
                style={{ position: 'relative' }}
              >
                {deal.is_negoshi_pick && (
                  <div className="n-featured-label">⭐ Negoshi pick</div>
                )}
                {!deal.is_negoshi_pick && deal.is_featured && (
                  <div className="n-featured-label">Best value</div>
                )}

                <div className="n-card-top">
                  <div className="n-card-prov">
                    <div className="n-card-logo" style={{ background: deal.providers?.logo_color }}>
                      {deal.providers?.logo_text}
                    </div>
                    <div>
                      <div className="n-card-prov-name">{deal.providers?.name}</div>
                      <div className={`n-cat-pill${deal.categories?.slug === 'internet' ? ' inet' : ''}`}>
                        {deal.categories?.name}
                      </div>
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

                <div className="n-card-saving">
                  ✓ Save ${saving(deal)}/month
                </div>

                {deal.is_member_exclusive && (
                  <div className="n-member-only">🔑 Negoshi member exclusive</div>
                )}

                
                  href={deal.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="n-deal-btn"
                >
                  Get this deal
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="n-see-all">
          <a href="/deals">See all deals →</a>
        </div>
      </div>
    </section>
  )
}
