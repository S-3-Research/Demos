import Link from 'next/link'
import { WHO_QUALIFIES, COHORT } from '../_config'

export default function WhoQualifiesSection() {
  return (
    <section className="py-[100px] px-[72px] max-[600px]:px-6" style={{ background: 'var(--ink-mid)' }}>
      <div className="max-w-[1160px] mx-auto grid grid-cols-2 gap-[80px] max-[1000px]:grid-cols-1 max-[1000px]:gap-12">
        {/* Left */}
        <div>
          <div
            className="inline-block font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-6 px-3 py-2 border rounded-[2px]"
            style={{
              color: 'var(--teal-light)',
              borderColor: 'rgba(11,110,120,0.3)',
              background: 'rgba(11,110,120,0.1)',
            }}
          >
            The Selection
          </div>

          <h2
            className="font-cormorant font-bold leading-[.95] tracking-[-0.02em] mb-3"
            style={{ fontSize: 'clamp(38px, 4.5vw, 62px)', color: 'white' }}
          >
            Who This Is{' '}
            <em style={{ color: 'var(--gold-bright)', fontStyle: 'italic' }}>Designed For.</em>
          </h2>

          <div className="w-9 h-px mb-6" style={{ background: 'var(--gold)' }} />

          <p
            className="font-cormorant font-semibold italic text-[20px] mb-4 leading-[1.4]"
            style={{ color: 'var(--cream)' }}
          >
            Selection is based on clinical experience, readiness,{' '}
            <em style={{ color: 'var(--gold-bright)' }}>and cohort alignment.</em>
          </p>

          <p
            className="font-cormorant text-[18px] italic mb-4 leading-[1.5]"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            We are selecting nurses across specialties and care settings. Most applicants are new to
            clinical research. Clinical excellence, readiness, and curiosity are what matter.
          </p>

          <p
            className="font-barlow font-bold text-[11px] tracking-[.14em] uppercase mb-5"
            style={{ color: 'var(--teal-light)' }}
          >
            No prior research experience expected &nbsp;·&nbsp; We look for clinical excellence,
            curiosity, and commitment.
          </p>

          <p className="text-[15px] leading-[1.75] mb-6" style={{ color: 'var(--muted)' }}>
            Only <strong className="text-white">{COHORT.seats} nurses nationwide</strong> will
            receive fully sponsored tuition for the {COHORT.certName} Certification — a $3,000
            professional training value, at $0 cost for selected nurses.
            <br /><br />
            Elevate your nursing career — work on your own time, engage when it fits your life, and
            step into new opportunities without leaving your current role. Certified nurses become
            eligible for{' '}
            <strong className="text-white">paid, project-based clinical research opportunities</strong>{' '}
            — a new income stream, on your terms.
            <br /><br />
            And the work matters. You won&apos;t just care for patients — you&apos;ll help bring new
            treatments directly into communities, shaping how care is delivered in the future.
          </p>

          <Link
            href={COHORT.applyUrl}
            className="btn-shimmer inline-flex items-center justify-center rounded-[2px] px-8 py-4
              font-barlow font-black text-[13px] tracking-[.22em] uppercase text-white
              transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)',
              boxShadow: '0 6px 28px rgba(11,110,120,.4), inset 0 1px 0 rgba(255,255,255,.15)',
            }}
          >
            → Apply for Selection
          </Link>
        </div>

        {/* Right — qualifications box */}
        <div>
          <div
            className="border rounded-[2px] overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div
              className="px-5 py-4 border-b"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <p
                className="font-barlow font-black text-[11px] tracking-[.2em] uppercase"
                style={{ color: 'var(--gold-bright)' }}
              >
                ◆ Who Is Selected
              </p>
            </div>

            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {WHO_QUALIFIES.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 px-5 py-4"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="w-1 h-1 rounded-full flex-shrink-0 mt-[7px]"
                    style={{ background: 'var(--teal-light)' }}
                  />
                  <p className="text-[14px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <strong className="text-white">{item.label}</strong> — {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="px-5 py-4 text-[11px] italic leading-[1.6]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Selection is based on specialty, geography, language capability, and community need.
              We welcome nurses from all backgrounds — including those new to research. Apply early —
              selection is rolling and early applicants are reviewed first.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
