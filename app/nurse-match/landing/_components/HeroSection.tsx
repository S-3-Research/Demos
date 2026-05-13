import Link from 'next/link'
import Countdown from './Countdown'
import { COHORT, STATS, AUTONOMY_PILLS } from '../_config'

export default function HeroSection() {
  return (
    <section
      className="hero-vline min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #040E1B 0%, #071828 45%, #0A2038 100%)' }}
    >
      {/* Ghost "30" */}
      <div
        className="absolute right-[-60px] bottom-[-80px] font-cormorant font-light leading-none pointer-events-none select-none"
        style={{
          fontSize: 'clamp(320px, 40vw, 560px)',
          color: 'rgba(11,110,120,0.05)',
          letterSpacing: '-0.05em',
        }}
        aria-hidden
      >
        30
      </div>

      <div
        className="hero-layout max-w-[1160px] mx-auto px-[72px] max-[600px]:px-6 py-[110px] relative z-[2]"
      >
        {/* ── LEFT COLUMN ── */}
        <div className="hero-left">
          {/* Overline */}
          <div className="flex items-center gap-[14px] mb-8">
            <div
              className="blink-dot w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ background: 'var(--teal-light)' }}
            />
            <span
              className="font-barlow font-bold text-[11px] tracking-[.26em] uppercase"
              style={{ color: 'var(--teal-light)' }}
            >
              Cohort 4 &nbsp;·&nbsp; Selection Now Open
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-cormorant font-bold leading-[.92] tracking-[-0.025em] mb-[30px]"
            style={{ fontSize: 'clamp(56px, 7.5vw, 100px)' }}
          >
            <span className="block" style={{ color: 'var(--cream)' }}>30 Nurses.</span>
            <span className="block italic" style={{ color: 'var(--teal-light)' }}>Nationwide.</span>
            <span className="block" style={{ color: 'var(--cream)' }}>Selected.</span>
          </h1>

          {/* Tagline */}
          <p
            className="font-cormorant italic leading-[1.45] mb-7 border-l-2 pl-[18px]"
            style={{
              fontSize: 'clamp(20px, 2.2vw, 28px)',
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'var(--teal)',
            }}
          >
            <strong className="not-italic font-semibold text-white">
              Elevate your nursing career — on your terms.
            </strong>
          </p>

          <p
            className="font-barlow font-bold text-[12px] tracking-[.16em] uppercase mb-5"
            style={{ color: 'var(--teal-light)' }}
          >
            Designed for working nurses. Built to fit your schedule.
          </p>

          <p className="text-[15px] leading-[1.75] max-w-[500px] mb-9" style={{ color: 'var(--muted)' }}>
            Continue caring for patients while gaining access to flexible clinical research
            opportunities and new income pathways —{' '}
            <strong className="font-medium" style={{ color: 'rgba(255,255,255,0.82)' }}>
              without leaving your current role.
            </strong>
          </p>

          {/* Confidence builder */}
          <div className="flex items-center gap-[10px] mb-5">
            <span className="text-[14px]" style={{ color: 'var(--teal-light)' }}>✦</span>
            <span
              className="font-barlow font-bold text-[12px] tracking-[.12em] uppercase"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              No prior research experience required &nbsp;·&nbsp; Your clinical background is the foundation
            </span>
          </div>

          {/* Identity block */}
          <div
            className="mb-7 px-6 py-[22px] border-l-2"
            style={{
              borderColor: 'var(--teal)',
              background: 'rgba(11,110,120,0.05)',
            }}
          >
            <p
              className="font-cormorant font-normal leading-[1.65] mb-3"
              style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', color: 'rgba(255,255,255,0.8)' }}
            >
              This is not just training.{' '}
              <em style={{ color: 'var(--cream)' }}>It&apos;s access to a new layer of your profession.</em>
            </p>
            <p className="text-[14px] leading-[1.72] mb-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Elevate your nursing profession — work on your own time, engage when it fits your life,
              and step into new opportunities without leaving your current role.
            </p>
            <p className="text-[14px] leading-[1.72] mb-[10px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Certified nurses become eligible for{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>paid, project-based clinical research opportunities</strong>{' '}
              designed to create additional income — on your terms.
            </p>
            <p className="text-[14px] leading-[1.72]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              And the work matters. You&apos;ll help bring new treatments directly into communities —{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>shaping how care is delivered in the future.</strong>
            </p>
          </div>

          <p
            className="font-barlow font-semibold text-[13px] tracking-[.1em] uppercase mb-7"
            style={{ color: 'var(--teal-light)' }}
          >
            Built for nurses like you — already delivering care at the highest level.
          </p>

          {/* Autonomy pills */}
          <div className="flex gap-[10px] flex-wrap mb-8">
            {AUTONOMY_PILLS.map((p) => (
              <div
                key={p.label}
                className="inline-flex items-center gap-[7px] border rounded-[2px] px-[14px] py-2
                  font-barlow font-bold text-[12px] tracking-[.1em] uppercase transition-all duration-200
                  hover:text-white"
                style={{
                  background: 'var(--teal-pale)',
                  borderColor: 'rgba(11,110,120,0.35)',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                <span className="text-[14px]">{p.icon}</span>
                {p.label}
              </div>
            ))}
          </div>

          {/* Earning signal */}
          <div
            className="mb-8 px-5 py-4 border rounded-[2px] flex items-start gap-3"
            style={{
              background: 'rgba(11,110,120,0.08)',
              borderColor: 'rgba(11,110,120,0.22)',
            }}
          >
            <span className="text-[20px] flex-shrink-0">💰</span>
            <p className="font-dm text-[14px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Certified nurses become eligible for{' '}
              <strong className="text-white">paid clinical research opportunities</strong> — designed
              to supplement income on their own schedule.
            </p>
          </div>

          {/* Stats row */}
          <div
            className="stats-row-grid border rounded-[2px] overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="stat-item px-[18px] py-4 border-r last:border-r-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <span
                  className="font-cormorant text-[30px] font-bold block leading-none mb-1"
                  style={{ color: 'var(--gold-bright)' }}
                >
                  {s.value}
                </span>
                <span
                  className="font-barlow font-bold text-[10px] uppercase tracking-[.14em]"
                  style={{ color: 'var(--muted)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <p
            className="font-cormorant text-[16px] italic mt-4"
            style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.01em' }}
          >
            Your clinical expertise is the foundation.
          </p>
        </div>

        {/* ── CTA CARD ── */}
        <div
          className="card-float rounded-[3px] overflow-hidden"
          style={{
            background: 'var(--cream)',
            boxShadow: '0 0 0 1px rgba(196,154,26,.3), 0 50px 90px rgba(0,0,0,.65), 0 2px 0 rgba(232,168,32,.5) inset',
          }}
        >
          {/* Card header */}
          <div
            className="card-hd-ghost card-hd-line relative px-[26px] pt-[26px] pb-[22px] overflow-hidden border-b"
            style={{
              background: 'linear-gradient(155deg, var(--ink) 0%, var(--ink-light) 100%)',
              borderColor: 'rgba(232,168,32,0.18)',
            }}
          >
            <p
              className="font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-[10px]"
              style={{ color: 'var(--teal-light)' }}
            >
              ◆ Research-Ready Nurse™ · {COHORT.name}
            </p>
            <p
              className="font-cormorant text-[17px] font-bold mb-[18px]"
              style={{ color: 'white' }}
            >
              ACHIEVE Clinical Expertise
            </p>
            <p
              className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-[3px]"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Sponsored Seats Available
            </p>
            <span
              className="font-cormorant font-bold leading-none block tracking-[-0.04em]"
              style={{ fontSize: '88px', color: 'var(--gold-bright)' }}
            >
              {COHORT.seats}
            </span>
            <span
              className="font-barlow font-black text-[13px] tracking-[.14em] uppercase block mt-1"
              style={{ color: 'var(--cream)' }}
            >
              Nurses Selected — Nationwide
            </span>

            {/* $3K block */}
            <div
              className="mt-[14px] rounded-[2px] px-4 py-[14px] border"
              style={{
                background: 'linear-gradient(135deg, rgba(232,168,32,.15), rgba(232,168,32,.06))',
                borderColor: 'rgba(232,168,32,0.35)',
              }}
            >
              <p
                className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-[6px]"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Sponsored Program
              </p>
              <div className="flex items-baseline gap-2 mb-[6px]">
                <span
                  className="font-cormorant font-bold leading-none"
                  style={{
                    fontSize: '42px',
                    color: 'var(--gold-bright)',
                    textDecoration: 'line-through',
                    textDecorationColor: 'rgba(232,168,32,0.4)',
                  }}
                >
                  {COHORT.tuitionValue}
                </span>
                <span
                  className="font-barlow font-black text-[22px] tracking-[.04em] uppercase"
                  style={{ color: 'var(--cream)' }}
                >
                  Covered.
                </span>
              </div>
              <p
                className="font-barlow font-bold text-[11px] tracking-[.1em] uppercase"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                For the first {COHORT.seats} selected nurses &nbsp;·&nbsp; $0 out of pocket
              </p>
            </div>

            <p className="mt-2 text-[11px] italic" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Additional qualified nurses may be invited to enroll at standard tuition
            </p>
          </div>

          {/* Card body */}
          <div className="px-[26px] pt-5 pb-[26px]">
            {/* Selection notice */}
            <div
              className="border-l-2 px-[13px] py-[11px] mb-4 rounded-r-[2px]"
              style={{
                background: 'var(--ink)',
                borderColor: 'var(--teal-light)',
              }}
            >
              <p
                className="font-barlow font-black text-[11px] tracking-[.16em] uppercase mb-[3px]"
                style={{ color: 'var(--teal-light)' }}
              >
                ◆ Only {COHORT.seats} Seats. Nationwide.
              </p>
              <p className="text-[12px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Selection is based on specialty, geography, and community need. Seats are limited.
                Apply early. Cohort seats are finite.
              </p>
            </div>

            {/* Countdown */}
            <div
              className="border rounded-[2px] px-[14px] py-3 mb-4 text-center"
              style={{
                background: 'var(--ink)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="font-barlow font-bold text-[9px] tracking-[.22em] uppercase mb-[9px]"
                style={{ color: 'var(--muted)' }}
              >
                Cohort 4 Closes In
              </p>
              <Countdown />
            </div>

            {/* CTA button */}
            <Link
              href={COHORT.applyUrl}
              className="btn-shimmer flex w-full items-center justify-center rounded-[2px] mb-[10px] py-[17px]
                font-barlow font-black text-[13px] tracking-[.22em] uppercase text-white
                transition-all duration-200 hover:translate-y-[-2px]"
              style={{
                background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)',
                boxShadow: '0 6px 28px rgba(11,110,120,.4), inset 0 1px 0 rgba(255,255,255,.15)',
              }}
            >
              → Apply for Selection
            </Link>

            <p
              className="text-center font-barlow font-bold text-[10px] tracking-[.16em] uppercase mb-[10px]"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Takes ~3 minutes
            </p>

            <Link
              href="/nurse-match/landing/apply#refer"
              className="block w-full text-center rounded-[2px] mb-[14px] py-[10px] border border-[rgba(0,0,0,.15)]
                font-barlow font-bold text-[12px] tracking-[.14em] uppercase transition-all duration-200
                hover:bg-[var(--ink)] hover:text-[var(--gold-bright)] hover:border-[var(--ink)]"
              style={{ background: 'transparent', color: '#555' }}
            >
              Refer a Nurse Colleague
            </Link>

            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--green)' }}>✓</span>
              <span className="text-[11px]" style={{ color: '#555' }}>
                Selection is limited. Apply early.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
