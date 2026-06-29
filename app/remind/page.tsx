import Navbar from '../components/Navbar'
import { Footer } from '../components/StaticSections'
import PromoReminderForm from '../components/PromoReminderForm'

export default function RemindPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="n-sect" style={{ maxWidth: 520, margin: '0 auto' }}>
          <div className="n-sect-eyebrow">Promo expiry reminder</div>
          <h1 className="n-sect-title">Don't get caught paying full price</h1>
          <p className="n-sect-sub">
            Tell us your current plan and when your promo ends — we'll email you a
            week before so you can switch before the price goes up.
          </p>
          <PromoReminderForm />
        </div>
      </main>
      <Footer />
    </>
  )
}