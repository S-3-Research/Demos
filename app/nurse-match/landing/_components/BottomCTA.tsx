import Link from 'next/link'
import { COHORT, BOTTOM_REASSURANCES } from '../_config'

export default function BottomCTA() {
  return (
    <section
      className="bcta-glow relative py-[120px] px-[72px] max-[600px]:px-6 text-center overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #040E1B 0%, #071420 50%, #060F1A 100%)' }}
    >
      <div className="max-w-[700px] mx-auto relative z-[1]">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-7 h-px" style={{ background: 'var(--teal)' }} />
          <span
            className="font-barlow font-bold text-[10px] tracking-[.24em] uppercase"
            style={{ color: 'var(--teal-light)' }}
          >
            For a Select Group of Nurses — {COHORT.name}
          </span>
          <div className="w-7 h-px" style={{ background: 'var(--teal)' }} />
        </div>

        {/* Headline */}
        <h2
          className="font-cormorant font-bold leading-[.9] tracking-[-0.025em] mb-5"
          style={{ fontSize: 'clamp(52px, 7vw, 96px)' }}
        >
          <span className="block" style={{ color: 'var(--cream)' }}>
            {COHORT.seats} Sponsored Seats.
          </span>
          <span className="block italic" style={{ color: 'var(--teal-light)' }}>
            Is One Yours?
          </span>
        </h2>

        <div className="w-9 h-px mx-auto my-[18px]" style={{ background: 'var(--teal)' }} />

        <p className="text-[15px] leading-[1.7] mb-6" style={{ color: 'var(--muted)' }}>
          ACHIEVE is selecting {COHORT.seats} nurses nationwide for a structured, supported pathway
          into clinical research. Applications are reviewed on a rolling basis. Selected nurses will
          be invited to move forward.
        </p>

        <p
          className="font-cormorant font-semibold italic text-[20px] mb-9 leading-[1.55]"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          This is how experienced nurses extend their impact — into research, innovation, and the
          future of care.
        </p>

        <Link
          href={COHORT.applyUrl}
          className="btn-shimmer inline-flex items-center justify-center rounded-[2px] px-16 py-5 mb-4
            font-barlow font-black text-[14px] tracking-[.24em] uppercase text-white
            transition-all duration-200 hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)',
            boxShadow: '0 8px 40px rgba(11,110,120,.45), inset 0 1px 0 rgba(255,255,255,.15)',
          }}
        >
          → Apply for Selection
        </Link>

        <p
          className="font-cormorant italic text-[16px] mt-[14px] mb-[6px] leading-[1.5]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          You&apos;ve already built the expertise. This is where it begins to expand.
        </p>

        <p
          className="font-barlow font-bold text-[10px] tracking-[.16em] uppercase mb-6"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Selection is limited · Additional nurses may enroll at standard tuition · Early applicants reviewed first
        </p>

        {/* Reassurances */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-6">
          {BOTTOM_REASSURANCES.map((r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="text-[8px]" style={{ color: 'var(--teal-light)' }}>◆</span>
              <span className="font-barlow text-[11px] tracking-[.1em]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                {r}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Not ready yet?{' '}
          <Link
            href="/nurse-match/landing/apply#refer"
            className="font-semibold transition-colors duration-200 hover:underline"
            style={{ color: 'var(--teal-light)' }}
          >
            Refer a nurse colleague →
          </Link>
        </p>
      </div>
    </section>
  )
}
