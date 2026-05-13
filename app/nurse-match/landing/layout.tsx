import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Barlow_Condensed } from 'next/font/google'
import './landing.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ACHIEVE | 30 Nurses. Nationwide. Selected.',
  description:
    '30 nurses. Nationwide. Selected. ACHIEVE is selecting a limited group of bedside nurses for fully sponsored access to a clinical research certification valued at $3,000.',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable} ${barlowCondensed.variable} achieve-landing achieve-grain`}
      style={{ overflowX: 'hidden' }}
    >
      {children}
    </div>
  )
}
