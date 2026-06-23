'use client'

import { useState } from 'react'

export type Deal = {
  id: string
  plan_name: string
  data_gb: number | null
  price: number
  retail_price: number
  is_featured: boolean
  is_member_exclusive: boolean
  affiliate_url: string
  description: string | null
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

type Props = { deals: Deal[] }

export default function DealsSection({ deals }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'internet'>('all')

  const filtered = deals.filter((d) => {
    if (activeTab === 'all') return true
    return d.categories.slug === activeTab
  })

  const saving = (d: Deal) => Math.round(d.retail_price - d.price)

  return (
    <section className="n-deals-bg">
      <div className="n-deals-inner">
        <div className="n-deals-header">
          <div>
            <div className="n-sect-eyebrow">Hot deals</div>
            <h2 className="n-sect-title" style={{ marginBottom: 0 }}>What's live right now</h2>
          </div>
          <div className="n-tab-bar">
            {(['all', 'mobile', 'internet'] as const).map((tab) => (
              <button
                key={tab}
                className={`n-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All' : tab === 'mobile' ? '📱 Mobile' : '🌐 Internet'}
              </button>
            ))}
          </div>
        </div>

        <div className="n-deals-grid">
          {filtered.map((deal) => (
            <div
              key={deal.id}
              className={`n-deal-card${deal.is_featured ? ' featured' : ''}`}
              style={{ position: 'relative' }}
            >
              {deal.is_featured && (
                <div className="n-featured-label">⭐ Best value</div>
              )}
              <div className="n-card-top">
                <div className="n-card-prov">
                  <div
                    className="n-card-logo"
                    style={{ background: deal.providers.logo_color }}
                  >
                    {deal.providers.logo_text}
                  </div>
                  <div>
                    <div className="n-card-prov-name">{deal.providers.name}</div>
                    <div className={`n-cat-pill${deal.categories.slug === 'internet' ? ' inet' : ''}`}>
                      {deal.categories.name}
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
                ✓ Members save ${saving(deal)}/month
              </div>

              {deal.is_member_exclusive && (
                <div className="n-member-only">🔑 Negoshi member exclusive</div>
              )}

              <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" className="n-deal-btn">
                Get this deal →
              </a>
            </div>
          ))}
        </div>

        <div className="n-see-all">
          <a href="/deals">See all deals →</a>
        </div>
      </div>
    </section>
  )
}
