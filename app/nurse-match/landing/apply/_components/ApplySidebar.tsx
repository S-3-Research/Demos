import Countdown from '../../_components/Countdown'
import { COHORT } from '../../_config'

export default function ApplySidebar() {
  return (
    <aside className="sticky top-[140px] max-[860px]:static space-y-4">
      {/* Countdown urgency */}
      <div
        className="border rounded-[2px] p-4"
        style={{
          background: 'rgba(11,110,120,0.08)',
          borderColor: 'rgba(11,110,120,0.2)',
        }}
      >
        <p
          className="font-barlow font-extrabold text-[11px] tracking-[.18em] uppercase mb-[10px]"
          style={{ color: 'var(--teal-light)' }}
        >
          ◆ Cohort 4 Closes In
        </p>
        <Countdown size="sm" />
        <p className="text-[11px] leading-[1.5] mt-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
          Seats are limited and highly competitive. Early applicants are reviewed first.
        </p>
      </div>

      {/* Sponsored card */}
      <div
        className="rounded-[2px] overflow-hidden"
        style={{
          background: 'var(--cream)',
          boxShadow: '0 0 0 1px rgba(196,154,26,.3), 0 20px 48px rgba(0,0,0,.5)',
        }}
      >
        <div
          className="card-hd-line relative px-5 py-5 border-b overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--ink), var(--ink-light))',
            borderColor: 'rgba(232,168,32,0.15)',
          }}
        >
          <p
            className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-2"
            style={{ color: 'var(--teal-light)' }}
          >
            ◆ Sponsored Program
          </p>
          <p
            className="font-barlow font-bold text-[10px] tracking-[.2em] uppercase mb-1"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Certification Value
          </p>
          <div className="flex items-baseline gap-2 mb-[6px]">
            <span
              className="font-cormorant font-bold text-[36px] leading-none"
              style={{
                color: 'var(--gold-bright)',
                textDecoration: 'line-through',
                textDecorationColor: 'rgba(232,168,32,0.4)',
              }}
            >
              {COHORT.tuitionValue}
            </span>
            <span
              className="font-barlow font-black text-[18px] tracking-[.06em] uppercase"
              style={{ color: 'var(--cream)' }}
            >
              Covered.
            </span>
          </div>
          <p className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
            For the first {COHORT.seats} selected nurses · $0 out of pocket
          </p>
        </div>
        <div className="px-5 py-[18px]">
          {[
            { label: 'Fully sponsored tuition', detail: 'for selected nurses' },
            { label: 'Virtual training', detail: '~10 hours, your own pace' },
            { label: 'Paid research opportunities', detail: 'after certification' },
            { label: 'No research experience', detail: 'required to apply' },
            { label: 'Keep your current role', detail: 'this adds to it' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-[10px] py-[10px] border-b last:border-b-0"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <span className="flex-shrink-0 mt-[1px]" style={{ color: 'var(--teal)', fontSize: '14px' }}>✓</span>
              <span className="text-[13px] leading-[1.45]" style={{ color: '#444' }}>
                <strong style={{ color: 'var(--ink)' }}>{item.label}</strong> {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence note */}
      <div
        className="text-[12px] italic leading-[1.6] px-4 py-[14px] border rounded-[2px]"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.38)',
        }}
      >
        Most nurses who apply are new to clinical research. What matters is clinical excellence,
        curiosity, and a desire to grow.
        <br /><br />
        <strong style={{ color: 'rgba(255,255,255,0.55)' }}>
          If that sounds like you — you are exactly who this was designed for.
        </strong>
      </div>
    </aside>
  )
}
