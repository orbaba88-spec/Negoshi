'use client'
import { useState } from 'react'

export default function PromoReminderForm({ dealName = '' }: { dealName?: string }) {
  const [email, setEmail]     = useState('')
  const [plan, setPlan]       = useState(dealName)
  const [endDate, setEndDate] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!email || !email.includes('@')) return setMessage('Please enter a valid email.')
    if (!plan)    return setMessage('Please enter your plan name.')
    if (!endDate) return setMessage('Please select when your promo ends.')
    setStatus('loading')
    try {
      const res = await fetch('/api/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan_name: plan, promo_end_date: endDate }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏰</div>
        <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1A1714' }}>Reminder set!</p>
        <p style={{ color: '#7A736C', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          We'll email you a week before your promo ends so you can switch before the price goes up.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1714' }}>Your email</label>
        <input
          className="n-email-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1714' }}>What plan are you on?</label>
        <input
          className="n-email-input"
          type="text"
          placeholder="e.g. iiNet 25GB Small"
          value={plan}
          onChange={e => setPlan(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1714' }}>When does your promo end?</label>
        <input
          className="n-email-input"
          type="date"
          value={endDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      {message && (
        <p style={{ color: 'rgba(180,60,60,0.85)', fontSize: '0.82rem', margin: 0 }}>{message}</p>
      )}
      <button className="n-btn-primary" onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? 'Setting reminder...' : 'Remind me →'}
      </button>
    </div>
  )
}