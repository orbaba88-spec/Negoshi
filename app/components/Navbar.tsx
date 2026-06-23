import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="n-nav">
      <Link href="/" className="n-logo">
        Nego<span>shi</span>
      </Link>
      <ul className="n-nav-links">
        <li><Link href="/deals">Deals</Link></li>
        <li><Link href="#how-it-works">How it works</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="#join" className="n-nav-cta">Join free</Link></li>
      </ul>
    </nav>
  )
}
