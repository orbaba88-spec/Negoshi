'use client'

import { useState, useEffect, useCallback } from 'react'

type Deal = {
  id: string
  plan_name: string
  price: number
  retail_price: number
  is_active: boolean
  is_featured: boolean
  is_member_exclusive: boolean
  affiliate_url: string
  description: string
  expires_at: string | null
  cf_product_id: string | null
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

const EMPTY_FORM = {
  plan_name: '', description: '', price: '', retail_price: '',
  affiliate_url: '', provider_id: '', category_id: '', data_gb: '',
  expires_at: '', is_active: true, is_featured: false, is_member_exclusive: false,
}

export default function AdminPage() {
  const [password, setPassword]     = useState('')
  const [authed, setAuthed]         = useState(false)
  const [authError, setAuthError]   = useState('')
  const [deals, setDeals]           = useState<Deal[]>([])
  const [loading, setLoading]       = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [providers, setProviders]   = useState<{id:string;name:string}[]>([])
  const [categories, setCategories] = useState<{id:string;name:string;slug:string}[]>([])

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }), [password])

  async function login() {
    setAuthError('')
    const res = await fetch('/api/admin/deals', { headers: headers() })
    if (res.ok) {
      setAuthed(true)
      const data = await res.json()
      setDeals(data)
    } else {
      setAuthError('Wrong password')
    }
  }

  async function loadDeals() {
    setLoading(true)
    const res = await fetch('/api/admin/deals', { headers: headers() })
    if (res.ok) setDeals(await res.json())
    setLoading(false)
  }

  async function loadProvidersMeta() {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/admin/meta/providers', { headers: headers() }),
      fetch('/api/admin/meta/categories', { headers: headers() }),
    ])
    if (pRes.ok) setProviders(await pRes.json())
    if (cRes.ok) setCategories(await cRes.json())
  }

  useEffect(() => {
    if (authed) loadProvidersMeta()
  }, [authed])

  async function toggleActive(deal: Deal) {
    await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ id: deal.id, is_active: !deal.is_active }),
    })
    setDeals(ds => ds.map(d => d.id === deal.id ? { ...d, is_active: !d.is_active } : d))
  }

  async function toggleFeatured(deal: Deal) {
    await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ id: deal.id, is_featured: !deal.is_featured }),
    })
    setDeals(ds => ds.map(d => d.id === deal.id ? { ...d, is_featured: !d.is_featured } : d))
  }

  async function saveDeal() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/admin/deals', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        ...form,
        price:        parseFloat(form.price),
        retail_price: parseFloat(form.retail_price),
        data_gb:      form.data_gb ? parseInt(form.data_gb) : null,
        expires_at:   form.expires_at || null,
      }),
    })
    if (res.ok) {
      setMsg('Deal added ✓')
      setForm(EMPTY_FORM)
      setShowForm(false)
      loadDeals()
    } else {
      const err = await res.json()
      setMsg(`Error: ${err.error}`)
    }
    setSaving(false)
  }

  async function runSync() {
    setSyncStatus('Running sync...')
    const res = await fetch('/api/cron/sync-deals', {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET ?? ''}` },
    })
    const data = await res.json()
    setSyncStatus(res.ok
      ? `Sync complete — ${data.synced} deals updated, ${data.expired} expired`
      : `Sync failed: ${data.error}`)
    if (res.ok) loadDeals()
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F4EE' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '2.5rem', width: 340, border: '1px solid rgba(26,23,20,.08)' }}>
          <div style={{ fontFamily: 'serif', fontSize: '1.4rem', fontWeight: 700, color: '#1B4332', marginBottom: '1.5rem' }}>
            Nego<span style={{ color: '#C9943A' }}>shi</span> Admin
          </div>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ width: '100%', marginBottom: '0.75rem', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.9rem', outline: 'none' }}
          />
          {authError && <p style={{ color: '#c0392b', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{authError}</p>}
          <button
            onClick={login}
            style={{ width: '100%', background: '#1B4332', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            Enter
          </button>
        </div>
      </div>
    )
  }

  // ── Main admin UI ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', padding: '2rem 5%', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', color: '#1B4332' }}>
            Nego<span style={{ color: '#C9943A' }}>shi</span> Admin
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={runSync} style={btnStyle('#1B4332')}>
              🔄 Sync CF deals
            </button>
            <button onClick={() => setShowForm(v => !v)} style={btnStyle('#C9943A')}>
              + Add deal manually
            </button>
            <a href="/" style={{ ...btnStyle('#555'), textDecoration: 'none' }}>
              View site →
            </a>
          </div>
        </div>

        {syncStatus && (
          <div style={{ background: '#fff', border: '1px solid rgba(29,147,74,.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#167A3A' }}>
            {syncStatus}
          </div>
        )}

        {msg && (
          <div style={{ background: '#fff', border: '1px solid rgba(26,23,20,.1)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            {msg}
          </div>
        )}

        {/* Add deal form */}
        {showForm && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', padding: '1.75rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add a new deal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <FormInput label="Plan name" value={form.plan_name} onChange={v => setForm(f => ({ ...f, plan_name: v }))} />
              <FormInput label="Affiliate URL" value={form.affiliate_url} onChange={v => setForm(f => ({ ...f, affiliate_url: v }))} />
              <FormInput label="Member price ($)" value={form.price} type="number" onChange={v => setForm(f => ({ ...f, price: v }))} />
              <FormInput label="Retail price ($)" value={form.retail_price} type="number" onChange={v => setForm(f => ({ ...f, retail_price: v }))} />
              <FormInput label="Data (GB, optional)" value={form.data_gb} type="number" onChange={v => setForm(f => ({ ...f, data_gb: v }))} />
              <FormInput label="Expires at (optional)" value={form.expires_at} type="date" onChange={v => setForm(f => ({ ...f, expires_at: v }))} />
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  style={{ ...inputStyle, height: 'auto', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Provider</label>
                <select value={form.provider_id} onChange={e => setForm(f => ({ ...f, provider_id: e.target.value }))} style={inputStyle}>
                  <option value="">Select provider...</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={inputStyle}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {(['is_active','is_featured','is_member_exclusive'] as const).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                    {key.replace('is_', '').replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={saveDeal} disabled={saving} style={btnStyle('#1B4332')}>
                {saving ? 'Saving...' : 'Save deal'}
              </button>
              <button onClick={() => setShowForm(false)} style={btnStyle('#888')}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Deals table */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {deals.length} deals — {deals.filter(d => d.is_active).length} active
            </span>
            <button onClick={loadDeals} style={{ fontSize: '0.8rem', color: '#7A736C', background: 'none', border: 'none', cursor: 'pointer' }}>
              {loading ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F7F4EE' }}>
                  {['Provider','Plan','Price','Retail','Category','Source','Active','Featured','Actions'].map(h => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.78rem', color: '#7A736C', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map(deal => (
                  <tr key={deal.id} style={{ borderTop: '1px solid rgba(26,23,20,.05)', opacity: deal.is_active ? 1 : 0.45 }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: deal.providers?.logo_color ?? '#888', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>
                          {deal.providers?.logo_text ?? '?'}
                        </div>
                        {deal.providers?.name}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.plan_name}</td>
                    <td style={tdStyle}><strong>${deal.price}</strong></td>
                    <td style={{ ...tdStyle, color: '#7A736C', textDecoration: 'line-through' }}>${deal.retail_price}</td>
                    <td style={tdStyle}>{deal.categories?.name}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 100, background: deal.cf_product_id ? 'rgba(201,148,58,.12)' : 'rgba(29,67,50,.1)', color: deal.cf_product_id ? '#8B5A1A' : '#1B4332' }}>
                        {deal.cf_product_id ? 'CF auto' : 'Manual'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleActive(deal)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_active ? '#167A3A' : '#ccc', color: deal.is_active ? '#167A3A' : '#999' }}>
                        {deal.is_active ? 'Live' : 'Off'}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleFeatured(deal)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_featured ? '#C9943A' : '#ccc', color: deal.is_featured ? '#C9943A' : '#999' }}>
                        {deal.is_featured ? '⭐ Yes' : 'No'}
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#1B4332', textDecoration: 'none', marginRight: '0.5rem' }}>
                        Link ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </div>
  )
}

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg, color: '#fff', border: 'none', borderRadius: 8,
  padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
})

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7,
  border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none', background: '#fff',
}

const tdStyle: React.CSSProperties = {
  padding: '0.7rem 1rem', verticalAlign: 'middle',
}
