import Link from 'next/link'
import { PRIORITY_AREAS, COHORT } from '../_config'

const barColors = {
  red:  'rgba(185,50,50,0.75)',
  gold: '#C49A1A',
  teal: 'rgba(11,140,150,0.75)',
}

const statusColors = {
  red:  'rgba(220,80,80,0.9)',
  gold: '#E8A820',
  teal: 'rgba(11,180,160,0.9)',
}

export default function ScarcitySection() {
  return (
    <section
      className="relative py-[100px] px-[72px] max-[600px]:px-6 overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #040E1B 0%, #071420 60%, #060F1A 100%)' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-2 gap-[80px] items-start max-[1000px]:grid-cols-1 max-[1000px]:gap-12">
        {/* Left */}
        <div>
          <h2
            className="font-cormorant font-bold leading-[.95] tracking-[-0.02em] mb-4"
            style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
          >
            <span className="block" style={{ color: 'var(--cream)' }}>Seats Fill</span>
            <span className="block italic" style={{ color: 'var(--teal-light)' }}>By Priority.</span>
            <span className="block" style={{ color: 'var(--cream)' }}>Yours Is</span>
            <span className="block italic" style={{ color: 'var(--gold-bright)' }}>Active Now.</span>
          </h2>

          <div className="w-9 h-px mb-[18px]" style={{ background: 'var(--teal)' }} />

          <p className="text-[15px] leading-[1.72] mb-[26px]" style={{ color: 'var(--muted)' }}>
            Not open enrollment. Only {COHORT.seats} nurses receive sponsored seats, allocated by
            specialty, geography, and community need. Apply early — selection notifications are sent
            on a rolling basis. Early applicants are reviewed first.
          </p>

          <Link
            href={COHORT.applyUrl}
            className="btn-shimmer inline-flex items-center rounded-[2px] px-8 py-4 mb-5
              font-barlow font-black text-[13px] tracking-[.22em] uppercase text-white
              transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)',
              boxShadow: '0 6px 28px rgba(11,110,120,.4), inset 0 1px 0 rgba(255,255,255,.15)',
            }}
          >
            → Apply for Selection
          </Link>

          <div
            className="text-[13px] leading-[1.6] px-4 py-3 border-l-2"
            style={{
              borderColor: 'var(--teal)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <strong style={{ color: 'var(--teal-light)' }}>Rolling review:</strong> Selection
            notifications will be sent on a rolling basis. Early applicants will be prioritized.
          </div>
        </div>

        {/* Right — priority panel */}
        <div
          className="border rounded-[2px] p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          <p className="font-barlow font-black text-[11px] tracking-[.16em] uppercase mb-4">
            <span style={{ color: 'var(--gold-bright)' }}>◆</span>{' '}
            <span className="text-white">Cohort 4 — Active Priority Areas</span>{' '}
            <span className="font-normal italic" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Priority areas vary by cohort and geography
            </span>
          </p>

          <div className="flex flex-col gap-3 mb-4">
            {PRIORITY_AREAS.map((area) => (
              <div key={area.name} className="flex items-center gap-3">
                <span
                  className="font-barlow font-bold text-[12px] w-[130px] flex-shrink-0"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {area.name}
                </span>
                <div
                  className="flex-1 rounded-[1px] h-1 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="h-full rounded-[1px]"
                    style={{ width: `${area.pct}%`, background: barColors[area.color] }}
                  />
                </div>
                <span
                  className="font-barlow font-bold text-[11px] w-[110px] text-right flex-shrink-0"
                  style={{ color: statusColors[area.color] }}
                >
                  {area.status}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 flex-wrap">
            {[
              { color: barColors.red,  label: 'Filling Fast' },
              { color: barColors.gold, label: 'Priority Review' },
              { color: barColors.teal, label: 'Seats Available' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: l.color }}
                />
                <span className="font-barlow text-[10px] tracking-[.1em]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
