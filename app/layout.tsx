import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
  weight: ['300', '500', '700'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Negoshi — Better deals together',
  description:
    'Negoshi pools Australians together to unlock exclusive mobile and internet rates. Free to join. Save every month.',
  openGraph: {
    title: 'Negoshi — Better deals together',
    description: 'Free to join. Save on mobile and internet every month.',
    url: 'https://negoshi.com.au',
    siteName: 'Negoshi',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}
