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
  title: 'Apply for Selection | ACHIEVE Research-Ready Nurse™',
  description:
    'Apply for Cohort 4 of the ACHIEVE Research-Ready Nurse™ program. 30 fully sponsored seats. Takes 3 minutes. No prior research experience required.',
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
