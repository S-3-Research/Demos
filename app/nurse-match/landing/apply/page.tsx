import Link from 'next/link'
import ApplyPageClient from './_components/ApplyPageClient'

export const metadata = {
  title: 'ACHIEVE | Apply for Selection',
}

export default function ApplyPage() {
  return (
    <>
      {/* Header */}
      <header
        className="sticky top-0 z-[100] flex items-center justify-between px-12 max-[860px]:px-6 py-4 border-b"
        style={{
          background: 'var(--ink-mid)',
          borderColor: 'rgba(232,168,32,0.12)',
        }}
      >
        <div>
          <div
            className="font-cormorant font-bold text-[20px] tracking-[.05em]"
            style={{ color: 'var(--gold-bright)' }}
          >
            ACHIEVE
          </div>
          <div
            className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase"
            style={{ color: 'var(--teal-light)' }}
          >
            Research-Ready Nurse™ · Cohort 4
          </div>
        </div>
        <Link
          href="/nurse-match/landing"
          className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase
            no-underline transition-colors duration-200 hover:text-[var(--gold-bright)]"
          style={{ color: 'rgba(255,255,255,0.42)' }}
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Hero */}
      <div
        className="relative overflow-hidden px-12 max-[860px]:px-6 py-16 text-center border-b"
        style={{
          background: 'linear-gradient(155deg, #040E1B 0%, #071828 50%, #0A2038 100%)',
          borderColor: 'rgba(232,168,32,0.1)',
        }}
      >
        {/* Ghost 30 */}
        <div
          className="absolute right-[-40px] top-1/2 -translate-y-1/2 font-cormorant font-light
            leading-none pointer-events-none"
          style={{ fontSize: '280px', color: 'rgba(11,110,120,0.04)' }}
          aria-hidden
        >
          30
        </div>
        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--teal-light), transparent)' }}
        />

        <div className="max-w-[680px] mx-auto relative z-[1]">
          <div className="inline-flex items-center gap-[10px] mb-5">
            <div
              className="blink-dot w-[6px] h-[6px] rounded-full"
              style={{ background: 'var(--teal-light)' }}
            />
            <span
              className="font-barlow font-bold text-[11px] tracking-[.24em] uppercase"
              style={{ color: 'var(--teal-light)' }}
            >
              Cohort 4 · Selection Now Open
            </span>
          </div>
          <h1
            className="font-cormorant font-bold leading-none tracking-[-0.025em] mb-3"
            style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--cream)' }}
          >
            Apply for{' '}
            <em style={{ color: 'var(--gold-bright)' }}>Selection.</em>
          </h1>
          <p className="text-[15px] leading-[1.7] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            This application takes approximately 3 minutes. No prior research experience required.
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-[2px]
              font-barlow font-bold text-[11px] tracking-[.14em] uppercase"
            style={{
              background: 'rgba(11,110,120,0.1)',
              borderColor: 'rgba(11,110,120,0.25)',
              color: 'var(--teal-light)',
            }}
          >
            <span>✦</span>
            <span>No prior research experience required &nbsp;·&nbsp; Certify in ~10 hours, on your own time</span>
          </div>
        </div>
      </div>

      {/* Progress bar + form grid — client component owns step state */}
      <ApplyPageClient />
    </>
  )
}
