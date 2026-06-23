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
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [providers, setProviders] = useState<{id:string;name:string}[]>([])
  const [categories, setCategories] = useState<{id:string;name:string;slug:string}[]>([])

  async function loadDeals() {
    setLoading(true)
    const res = await fetch('/api/admin/deals')
    if (res.ok) setDeals(await res.json())
    setLoading(false)
  }

  async function loadMeta() {
    const pRes = await fetch('/api/admin/meta/providers')
    const cRes = await fetch('/api/admin/meta/categories')
    if (pRes.ok) setProviders(await pRes.json())
    if (cRes.ok) setCategories(await cRes.json())
  }

  useEffect(() => { loadDeals(); loadMeta() }, [])

  async function toggleActive(deal: Deal) {
    await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deal.id, is_active: !deal.is_active }),
    })
    setDeals(ds => ds.map(d => d.id === deal.id ? { ...d, is_active: !d.is_active } : d))
  }

  async function toggleFeatured(deal: Deal) {
    await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deal.id, is_featured: !deal.is_featured }),
    })
    setDeals(ds => ds.map(d => d.id === deal.id ? { ...d, is_featured: !d.is_featured } : d))
  }

  async function saveDeal() {
    setSaving(true)
    setMsg('')
    const res = await fetch('/api/admin/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        retail_price: parseFloat(form.retail_price),
        data_gb: form.data_gb ? parseInt(form.data_gb) : null,
        expires_at: form.expires_at || null,
      }),
    })
    if (res.ok) {
      setMsg('Deal added!')
      setForm(EMPTY_FORM)
      setShowForm(false)
      loadDeals()
    } else {
      const err = await res.json()
      setMsg(`Error: ${err.error}`)
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', padding: '2rem 5%', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', color: '#1B4332' }}>
            Nego<span style={{ color: '#C9943A' }}>shi</span> Admin
          </h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowForm(v => !v)} style={btnStyle('#C9943A')}>+ Add deal</button>
            <a href="/" style={{ ...btnStyle('#555'), textDecoration: 'none' }}>View site →</a>
          </div>
        </div>

        {msg && <div style={{ background: '#fff', border: '1px solid rgba(26,23,20,.1)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>{msg}</div>}

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', padding: '1.75rem', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add a new deal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {[['Plan name','plan_name','text'],['Affiliate URL','affiliate_url','text'],['Member price ($)','price','number'],['Retail price ($)','retail_price','number'],['Data GB (optional)','data_gb','number'],['Expires (optional)','expires_at','date']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem' }}>{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none' }} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem' }}>Provider</label>
                <select value={form.provider_id} onChange={e => setForm(f => ({ ...f, provider_id: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none' }}>
                  <option value="">Select provider...</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem' }}>Category</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none' }}>
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
              <button onClick={saveDeal} disabled={saving} style={btnStyle('#1B4332')}>{saving ? 'Saving...' : 'Save deal'}</button>
              <button onClick={() => setShowForm(false)} style={btnStyle('#888')}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{deals.length} deals — {deals.filter(d => d.is_active).length} active</span>
            <button onClick={loadDeals} style={{ fontSize: '0.8rem', color: '#7A736C', background: 'none', border: 'none', cursor: 'pointer' }}>{loading ? 'Loading...' : '↻ Refresh'}</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F7F4EE' }}>
                  {['Provider','Plan','Price','Retail','Active','Featured','Link'].map(h => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.78rem', color: '#7A736C', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map(deal => (
                  <tr key={deal.id} style={{ borderTop: '1px solid rgba(26,23,20,.05)', opacity: deal.is_active ? 1 : 0.45 }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: deal.providers?.logo_color ?? '#888', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>{deal.providers?.logo_text ?? '?'}</div>
                        {deal.providers?.name}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.plan_name}</td>
                    <td style={tdStyle}><strong>${deal.price}</strong></td>
                    <td style={{ ...tdStyle, color: '#7A736C', textDecoration: 'line-through' }}>${deal.retail_price}</td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleActive(deal)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_active ? '#167A3A' : '#ccc', color: deal.is_active ? '#167A3A' : '#999' }}>{deal.is_active ? 'Live' : 'Off'}</button>
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => toggleFeatured(deal)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_featured ? '#C9943A' : '#ccc', color: deal.is_featured ? '#C9943A' : '#999' }}>{deal.is_featured ? '⭐ Yes' : 'No'}</button>
                    </td>
                    <td style={tdStyle}>
                      <a href={deal.affiliate_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#1B4332', textDecoration: 'none' }}>Link ↗</a>
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

function btnStyle(bg: string): React.CSSProperties {
  return { background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }
}

const tdStyle: React.CSSProperties = { padding: '0.7rem 1rem', verticalAlign: 'middle' }
