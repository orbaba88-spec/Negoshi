import Link from 'next/link'

type Deal = {
  id: string
  plan_name: string
  description: string | null
  price: number
  retail_price: number
  is_member_exclusive: boolean
  is_negoshi_pick: boolean
  affiliate_url: string
  speed_down: number | null
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

export default function HomepageDeals({ deals = [] }: { deals: Deal[] }) {
  const saving = (d: Deal) => Math.round(d.retail_price - d.price)

  return (
    <section style={{ background: '#EDE8DF', padding: '5rem 5%' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="n-sect-eyebrow">Top picks</div>
            <h2 className="n-sect-title" style={{ marginBottom: 0 }}>Our best deals right now</h2>
          </div>
          <Link href="/deals" style={{ fontWeight: 600, color: '#1B4332', textDecoration: 'none', fontSize: '0.95rem' }}>
            Browse all deals
          </Link>
        </div>

        {!deals || deals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7A736C', background: '#fff', borderRadius: 14 }}>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Deals loading soon</p>
            <p style={{ fontSize: '0.85rem' }}>Mark deals as Top Pick in the admin to feature them here.</p>
          </div>
        ) : (
          <div className="n-deals-grid">
            {deals.map((deal, i) => (
              <div key={deal.id} className="n-deal-card" style={{ position: 'relative' }}>
                {i === 0 && <div className="n-featured-label">Best pick</div>}
                {deal.is_negoshi_pick && i > 0 && <div className="n-featured-label">Top pick</div>}
                <div className="n-card-top">
                  <div className="n-card-prov">
                    <div className="n-card-logo" style={{ background: deal.providers?.logo_color }}>
                      {deal.providers?.logo_text}
                    </div>
                    <div>
                      <div className="n-card-prov-name">{deal.providers?.name}</div>
                      <div className={'n-cat-pill' + (deal.categories?.slug === 'internet' ? ' inet' : '')}>
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
                {saving(deal) > 0 && <div className="n-card-saving">Save ${saving(deal)}/month</div>}
                {deal.speed_down && <div style={{ fontSize: '0.78rem', color: '#185FA5', fontWeight: 600 }}>{deal.speed_down} Mbps</div>}
                {deal.is_member_exclusive && <div className="n-member-only">Negoshi member exclusive</div>}
                <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" className="n-deal-btn">
                  Get this deal
                </a>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link href="/deals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1B4332', color: '#fff', padding: '0.875rem 2rem', borderRadius: 100, fontWeight: 600, fontSize: '0.975rem', textDecoration: 'none' }}>
            Browse all deals
          </Link>
          <p style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: '#7A736C' }}>
            Live deals across mobile and internet — updated daily
          </p>
        </div>
      </div>
    </section>
  )
}