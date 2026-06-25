'use client'

import { useState, useEffect } from 'react'

type Deal = {
  id: string
  plan_name: string
  description: string
  price: number
  retail_price: number
  is_active: boolean
  is_featured: boolean
  is_negoshi_pick: boolean
  affiliate_url: string
  speed_down: number | null
  has_lock_in: boolean
  internet_tier: string | null
  providers: { name: string; logo_color: string; logo_text: string }
  categories: { name: string; slug: string }
}

const EMPTY_FORM = {
  plan_name: '', description: '', price: '', retail_price: '',
  affiliate_url: '', provider_id: '', category_id: '', data_gb: '',
  speed_down: '', expires_at: '', has_lock_in: false, internet_tier: '',
  is_active: true, is_featured: false, is_member_exclusive: false, is_negoshi_pick: false,
}

export default function AdminPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editDeal, setEditDeal] = useState<Deal | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [providers, setProviders] = useState<{id:string;name:string}[]>([])
  const [categories, setCategories] = useState<{id:string;name:string;slug:string}[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterCat, setFilterCat] = useState<'all'|'mobile'|'internet'>('all')
  const [filterActive, setFilterActive] = useState<'all'|'live'|'off'>('all')
  const [sortBy, setSortBy] = useState<'price'|'speed'|'name'>('price')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [search, setSearch] = useState('')

  async function loadDeals() {
    setLoading(true)
    const res = await fetch('/api/admin/deals')
    if (res.ok) setDeals(await res.json())
    setLoading(false)
  }

  async function loadMeta() {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/admin/meta/providers'),
      fetch('/api/admin/meta/categories'),
    ])
    if (pRes.ok) setProviders(await pRes.json())
    if (cRes.ok) setCategories(await cRes.json())
  }

  useEffect(() => { loadDeals(); loadMeta() }, [])

  async function patch(id: string, fields: Record<string, unknown>) {
    await fetch('/api/admin/deals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    })
    setDeals(ds => ds.map(d => d.id === id ? { ...d, ...fields } as Deal : d))
  }

  async function bulkSetActive(active: boolean) {
    for (const id of selected) await patch(id, { is_active: active })
    setSelected(new Set())
  }

  async function bulkSetPick(pick: boolean) {
    for (const id of selected) await patch(id, { is_negoshi_pick: pick })
    setSelected(new Set())
  }

  function openEdit(deal: Deal) {
    setEditDeal(deal)
    setForm({
      plan_name: deal.plan_name,
      description: deal.description || '',
      price: String(deal.price),
      retail_price: String(deal.retail_price),
      affiliate_url: deal.affiliate_url,
      provider_id: '',
      category_id: '',
      data_gb: '',
      speed_down: String(deal.speed_down || ''),
      expires_at: '',
      has_lock_in: deal.has_lock_in,
      internet_tier: deal.internet_tier || '',
      is_active: deal.is_active,
      is_featured: deal.is_featured,
      is_member_exclusive: false,
      is_negoshi_pick: deal.is_negoshi_pick,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveDeal() {
    setSaving(true); setMsg('')
    const payload = {
      plan_name: form.plan_name,
      description: form.description,
      price: parseFloat(form.price),
      retail_price: parseFloat(form.retail_price),
      affiliate_url: form.affiliate_url,
      speed_down: form.speed_down ? parseInt(form.speed_down) : null,
      has_lock_in: form.has_lock_in,
      internet_tier: form.internet_tier || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      is_negoshi_pick: form.is_negoshi_pick,
    }

    if (editDeal) {
      const res = await fetch('/api/admin/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editDeal.id, ...payload }),
      })
      if (res.ok) {
        setMsg('Deal updated!')
        loadDeals()
        setShowForm(false)
        setEditDeal(null)
      }
    } else {
      const res = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, provider_id: form.provider_id, category_id: form.category_id, data_gb: form.data_gb ? parseInt(form.data_gb) : null }),
      })
      if (res.ok) {
        setMsg('Deal added!')
        setForm(EMPTY_FORM)
        setShowForm(false)
        loadDeals()
      } else {
        const err = await res.json()
        setMsg('Error: ' + err.error)
      }
    }
    setSaving(false)
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = deals
    .filter(d => filterCat === 'all' || d.categories?.slug === filterCat)
    .filter(d => filterActive === 'all' || (filterActive === 'live' ? d.is_active : !d.is_active))
    .filter(d => search === '' || d.plan_name.toLowerCase().includes(search.toLowerCase()) || d.providers?.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return sortDir === 'asc' ? a.price - b.price : b.price - a.price
      if (sortBy === 'speed') return sortDir === 'asc' ? (a.speed_down||0) - (b.speed_down||0) : (b.speed_down||0) - (a.speed_down||0)
      return sortDir === 'asc' ? a.plan_name.localeCompare(b.plan_name) : b.plan_name.localeCompare(a.plan_name)
    })

  const tierLabel: Record<string, string> = { solo: 'Solo/Couple', small: 'Small family', family: 'Family 4+' }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE', padding: '2rem 5%', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '1.5rem', color: '#1B4332' }}>Nego<span style={{ color: '#C9943A' }}>shi</span> Admin</h1>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => { setEditDeal(null); setForm(EMPTY_FORM); setShowForm(v => !v) }} style={btn('#C9943A')}>+ Add deal</button>
            <a href="/" style={{ ...btn('#555'), textDecoration: 'none' }}>View site</a>
          </div>
        </div>

        {msg && <div style={{ background: '#fff', border: '1px solid rgba(26,23,20,.1)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{msg}</div>}

        {showForm && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>{editDeal ? 'Edit deal — ' + editDeal.plan_name : 'Add new deal'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div><label style={lbl}>Plan name</label><input value={form.plan_name} onChange={e => setForm(f => ({ ...f, plan_name: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Affiliate URL</label><input value={form.affiliate_url} onChange={e => setForm(f => ({ ...f, affiliate_url: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Price ($/mo)</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Retail price ($/mo)</label><input type="number" value={form.retail_price} onChange={e => setForm(f => ({ ...f, retail_price: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Speed Mbps (internet)</label><input type="number" value={form.speed_down} onChange={e => setForm(f => ({ ...f, speed_down: e.target.value }))} style={inp} /></div>
              <div>
                <label style={lbl}>Internet tier (cheapest price sub-tab)</label>
                <select value={form.internet_tier} onChange={e => setForm(f => ({ ...f, internet_tier: e.target.value }))} style={inp}>
                  <option value="">None / not applicable</option>
                  <option value="solo">Solo / Couple (1-2 people)</option>
                  <option value="small">Small family (2-3 people)</option>
                  <option value="family">Family 4+ people</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, height: 'auto', resize: 'vertical' }} />
              </div>
              {!editDeal && (
                <>
                  <div>
                    <label style={lbl}>Provider</label>
                    <select value={form.provider_id} onChange={e => setForm(f => ({ ...f, provider_id: e.target.value }))} style={inp}>
                      <option value="">Select...</option>
                      {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Category</label>
                    <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} style={inp}>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {(['is_active','is_negoshi_pick','is_featured','has_lock_in'] as const).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                    {key.replace(/is_|has_/g,'').replace(/_/g,' ')}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={saveDeal} disabled={saving} style={btn('#1B4332')}>{saving ? 'Saving...' : editDeal ? 'Update deal' : 'Save deal'}</button>
              <button onClick={() => { setShowForm(false); setEditDeal(null) }} style={btn('#888')}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(26,23,20,.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(26,23,20,.06)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem 0.85rem', borderRadius: 8, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.85rem', outline: 'none', flex: 1, minWidth: 160 }} />
            {(['all','mobile','internet'] as const).map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: '0.4rem 0.9rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: filterCat === cat ? '#1B4332' : 'rgba(26,23,20,.08)', color: filterCat === cat ? '#fff' : '#7A736C' }}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
            {(['all','live','off'] as const).map(s => (
              <button key={s} onClick={() => setFilterActive(s)} style={{ padding: '0.4rem 0.9rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: filterActive === s ? '#C9943A' : 'rgba(26,23,20,.08)', color: filterActive === s ? '#fff' : '#7A736C' }}>
                {s === 'all' ? 'All status' : s === 'live' ? 'Live' : 'Off'}
              </button>
            ))}
            <span style={{ fontSize: '0.8rem', color: '#7A736C', marginLeft: 'auto' }}>{filtered.length} deals</span>
          </div>

          {selected.size > 0 && (
            <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(29,67,50,.06)', borderBottom: '1px solid rgba(26,23,20,.06)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1B4332' }}>{selected.size} selected</span>
              <button onClick={() => bulkSetActive(true)} style={btn('#1B4332')}>Set live</button>
              <button onClick={() => bulkSetActive(false)} style={btn('#888')}>Turn off</button>
              <button onClick={() => bulkSetPick(true)} style={btn('#C9943A')}>Mark top pick</button>
              <button onClick={() => bulkSetPick(false)} style={btn('#999')}>Remove top pick</button>
              <button onClick={() => setSelected(new Set())} style={{ fontSize: '0.82rem', color: '#7A736C', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F7F4EE' }}>
                  <th style={th}><input type="checkbox" onChange={e => e.target.checked ? setSelected(new Set(filtered.map(d => d.id))) : setSelected(new Set())} /></th>
                  <th style={th}>Provider</th>
                  <th style={th} onClick={() => { setSortBy('name'); setSortDir(d => d === 'asc' ? 'desc' : 'asc') }}><span style={{ cursor: 'pointer' }}>Plan {sortBy === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span></th>
                  <th style={th} onClick={() => { setSortBy('price'); setSortDir(d => d === 'asc' ? 'desc' : 'asc') }}><span style={{ cursor: 'pointer' }}>Price {sortBy === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span></th>
                  <th style={th} onClick={() => { setSortBy('speed'); setSortDir(d => d === 'asc' ? 'desc' : 'asc') }}><span style={{ cursor: 'pointer' }}>Speed {sortBy === 'speed' ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span></th>
                  <th style={th}>Tier</th>
                  <th style={th}>Live</th>
                  <th style={th}>Top Pick</th>
                  <th style={th}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#7A736C' }}>Loading...</td></tr>
                ) : filtered.map(deal => (
                  <tr key={deal.id} style={{ borderTop: '1px solid rgba(26,23,20,.05)', opacity: deal.is_active ? 1 : 0.45, background: selected.has(deal.id) ? 'rgba(29,67,50,.04)' : 'transparent' }}>
                    <td style={td}><input type="checkbox" checked={selected.has(deal.id)} onChange={() => toggleSelect(deal.id)} /></td>
                    <td style={td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: deal.providers?.logo_color ?? '#888', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, flexShrink: 0 }}>{deal.providers?.logo_text ?? '?'}</div>
                        <span style={{ whiteSpace: 'nowrap' }}>{deal.providers?.name}</span>
                      </div>
                    </td>
                    <td style={{ ...td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.plan_name}</td>
                    <td style={td}><strong>${deal.price}</strong><span style={{ color: '#aaa', textDecoration: 'line-through', marginLeft: 6, fontSize: '0.78rem' }}>${deal.retail_price}</span></td>
                    <td style={td}>{deal.speed_down ? deal.speed_down + ' Mbps' : '-'}</td>
                    <td style={td}>
                      {deal.internet_tier ? (
                        <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 100, background: 'rgba(24,95,165,.1)', color: '#185FA5' }}>{tierLabel[deal.internet_tier] || deal.internet_tier}</span>
                      ) : '-'}
                    </td>
                    <td style={td}>
                      <button onClick={() => patch(deal.id, { is_active: !deal.is_active })} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_active ? '#167A3A' : '#ccc', color: deal.is_active ? '#167A3A' : '#999' }}>
                        {deal.is_active ? 'Live' : 'Off'}
                      </button>
                    </td>
                    <td style={td}>
                      <button onClick={() => patch(deal.id, { is_negoshi_pick: !deal.is_negoshi_pick })} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid', cursor: 'pointer', background: 'none', borderColor: deal.is_negoshi_pick ? '#C9943A' : '#ccc', color: deal.is_negoshi_pick ? '#C9943A' : '#999' }}>
                        {deal.is_negoshi_pick ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td style={td}>
                      <button onClick={() => openEdit(deal)} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: 100, border: '1px solid #1B4332', cursor: 'pointer', background: 'none', color: '#1B4332' }}>Edit</button>
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

const btn = (bg: string): React.CSSProperties => ({ background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' })
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#7A736C', marginBottom: '0.3rem' }
const inp: React.CSSProperties = { width: '100%', padding: '0.6rem 0.85rem', borderRadius: 7, border: '1px solid rgba(26,23,20,.15)', fontSize: '0.875rem', outline: 'none', background: '#fff' }
const th: React.CSSProperties = { padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.78rem', color: '#7A736C', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.65rem 1rem', verticalAlign: 'middle' }
