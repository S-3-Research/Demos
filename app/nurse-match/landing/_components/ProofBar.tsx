'use client'
import { useRef } from 'react'

const avatarColors = ['#4f7cac', '#6a9fb5', '#5b8a8b', '#7da87b', '#9b8ec4']

const stats = [
  {
    metric: '$3,000',
    metricSub: 'tuition value',
    label: 'Fully sponsored — no out-of-pocket cost for the inaugural cohort.',
    type: 'stat',
  },
  {
    metric: '8–10 hrs',
    metricSub: 'total training time',
    label: 'Self-paced and asynchronous. Fit it around your existing schedule.',
    type: 'stat',
  },
  // {
  //   metric: '30',
  //   metricSub: 'sponsored seats',
  //   label: 'Limited availability — applications reviewed on a rolling basis.',
  //   type: 'stat',
  // },
  {
    metric: '100%',
    metricSub: 'job-compatible',
    label: 'No need to leave your current role. Train on your own time.',
    type: 'stat',
  },
  {
    metric: '0',
    metricSub: 'experience required',
    label: 'Open to nurses from all specialties and backgrounds.',
    type: 'stat',
  },
  {
    metric: null,
    metricSub: 'nurses already applied',
    label: 'Join a growing community expanding into clinical research.',
    type: 'avatars',
  },
]

export default function ProofBar() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' })
  }

  return (
    <section className="bg-white py-10 sm:pt-10 sm:pb-7 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-5 pr-5 sm:pl-0 sm:pr-0 [scroll-padding-left:1.25rem] sm:[scroll-padding-left:0px]"
          style={{ scrollbarWidth: 'none' }}
        >
          {stats.map((item, i) => (
            <div
              key={i}
              className="flex-1 min-w-[82vw] sm:min-w-[260px] px-5 sm:px-8 flex flex-col gap-4 snap-start animate-[fade-up_0.6s_ease-out_both]"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {/* Top divider */}
              <div className="h-px bg-black/15 w-full mb-2" />

              {/* Primary metric or avatars */}
              {item.type === 'stat' ? (
                <div>
                  <div className="text-[2.6rem] font-black text-[#0d1a24] leading-none tracking-tight">
                    {item.metric}
                  </div>
                  <div className="text-[11px] text-[#0d1a24]/45 uppercase tracking-[0.1em] mt-1 font-medium">
                    {item.metricSub}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Overlapping avatars */}
                  <div className="flex items-center mb-2">
                    {avatarColors.map((color, j) => (
                      <div
                        key={j}
                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold"
                        style={{ backgroundColor: color, marginLeft: j === 0 ? 0 : -10 }}
                      >
                        {['RN', 'LN', 'MN', 'SN', '+'][j]}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-[#0d1a24]/45 uppercase tracking-[0.1em] font-medium">
                    {item.metricSub}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-[14px] text-[#0d1a24]/60 leading-[1.6] font-normal">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Nav buttons — bottom right */}
        <div className="flex justify-end gap-2 mt-8">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-black/40 hover:border-black/50 hover:text-black/80 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center text-black/40 hover:border-black/50 hover:text-black/80 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
