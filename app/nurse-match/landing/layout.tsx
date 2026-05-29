import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans, Barlow_Condensed } from 'next/font/google'
import '../nurse-match.css'

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
  title: 'Research-Ready Nurse™ Program | ACHIEVE Clinical Expertise',
  description:
    'Gain the skills, certification, and access to paid local research opportunities — on your schedule. 30 fully sponsored seats available.',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${barlowCondensed.variable} achieve-landing`}
      style={{ overflowX: 'hidden' }}
    >
      {children}
    </div>
  )
}
