import Countdown from '../../landing/_components/Countdown'
import { COHORT } from '../../_config'

export default function ApplySidebar() {
  return (
    <aside className="sticky top-[140px] max-[860px]:static space-y-4">
      {/* Countdown urgency — hidden on mobile (shown in hero instead) */}
      <div
        className="hidden sm:block border rounded-[8px] p-4 bg-[#1a8c9e]/[0.07] border-[#1a8c9e]/20"
      >
        <p
          className="font-extrabold text-[11px] tracking-[.18em] uppercase mb-[10px] text-[#1a8c9e]"
        >
          ◆ Cohort 4 Closes In
        </p>
        <Countdown size="sm" />
        <p className="text-[11px] leading-[1.5] mt-2 text-white/30">
          Seats are limited and highly competitive. Early applicants are reviewed first.
        </p>
      </div>

      {/* Sponsored card */}
      <div
        className="rounded-[8px] overflow-hidden border bg-[#0c2236] border-white/[0.08]"
      >
        <div
          className="relative px-5 py-5 border-b bg-[#0d2a3f] border-[#d4920a]/15"
        >
          <p
            className="font-bold text-[10px] tracking-[.22em] uppercase mb-2 text-[#1a8c9e]"
          >
            ◆ Sponsored Program
          </p>
          <p
            className="font-bold text-[10px] tracking-[.2em] uppercase mb-1"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Certification Value
          </p>
          <div className="flex items-baseline gap-2 mb-[6px]">
            <span
              className="font-bold text-[36px] leading-none"
              style={{
                fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)',
                color: '#d4920a',
                textDecorationColor: 'rgba(212,146,10,0.5)',
              }}
            >
              {COHORT.tuitionValue}
            </span>
            <span
              className="font-black text-[18px] tracking-[.06em] uppercase"
              style={{ color: 'white' }}
            >
              Covered.
            </span>
          </div>
          <p className="text-[11px] italic" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
              className="flex items-start gap-[10px] py-[10px] border-b last:border-b-0 border-white/[0.06]"
            >
              <span className="flex-shrink-0 mt-[1px] text-[#1a8c9e] text-[14px]">✓</span>
              <span className="text-[13px] leading-[1.45] text-white/50">
                <strong className="text-white">{item.label}</strong> {item.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence note */}
      <div
        className="text-[12px] italic leading-[1.6] px-4 py-[14px] border rounded-[8px] bg-white/[0.03] border-white/[0.07] text-white/35"
      >
        Most nurses who apply are new to clinical research. What matters is clinical excellence,
        curiosity, and a desire to grow.
        <br /><br />
        <strong className="text-white/65">
          If that sounds like you — you are exactly who this was designed for.
        </strong>
      </div>
    </aside>
  )
}
