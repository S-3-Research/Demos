import Link from 'next/link'
import ApplyPageClient from './_components/ApplyPageClient'
import Countdown from '../landing/_components/Countdown'

export const metadata = {
  title: 'ACHIEVE | Apply for Selection',
}

export default function ApplyPage() {
  return (
    <div className="bg-[#071828] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[#0a1f30] border-b border-white/[0.07] flex items-center justify-between px-4 sm:px-8 md:px-12 py-3 sm:py-[14px]">
        <div>
          <div className="text-white font-bold text-[18px] sm:text-[20px]" style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)' }}>
            ACHIEVE
          </div>
          <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#1a8c9e]">
            Research-Ready Nurse™ · Cohort 4
          </div>
        </div>
        <Link
          href="/nurse-match/landing"
          className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-white/30 no-underline whitespace-nowrap"
        >
          ← Back
        </Link>
      </header>

      {/* Hero */}
      <div className="bg-[#0a1f30] border-b border-white/[0.07] px-4 sm:px-8 md:px-12 pt-6 pb-8 sm:pb-10 text-center relative overflow-hidden">
        <div style={{
          position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)',
          fontSize: 'clamp(120px, 30vw, 280px)', color: 'rgba(26,140,158,0.04)',
          pointerEvents: 'none', lineHeight: 1,
        }} aria-hidden>30</div>

        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1a8c9e]" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.24em] uppercase text-[#1a8c9e]">
              Cohort 4 · Selection Now Open
            </span>
          </div>
          <h1
            className="text-white font-normal leading-none tracking-[-0.025em] mb-3"
            style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)', fontSize: 'clamp(32px, 8vw, 64px)' }}
          >
            Apply for{' '}
            <em style={{ color: '#d4920a' }}>Selection.</em>
          </h1>
          <p className="text-[13px] sm:text-[15px] leading-[1.7] text-white/50 mb-5 px-2 sm:px-0">
            This application takes approximately 3 minutes. No prior research experience required.
          </p>
          <div className="hidden sm:inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-[#1a8c9e]/25 rounded-[6px] bg-[#1a8c9e]/[0.07] text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#1a8c9e] mx-2 sm:mx-0">
            <span>✦</span>
            <span className="text-center">No prior research experience required &nbsp;·&nbsp; Certify in ~10 hours, on your own time</span>
          </div>

          {/* Mobile-only countdown — hidden on desktop where sidebar shows it */}
          <div className="sm:hidden mt-5 flex flex-col items-center gap-2">
            <p className="font-extrabold text-[10px] tracking-[.18em] uppercase text-[#1a8c9e]">
              ◆ Cohort 4 Closes In
            </p>
            <Countdown size="sm" />
          </div>
        </div>
      </div>

      {/* Progress bar + form grid */}
      <ApplyPageClient />
    </div>
  )
}
