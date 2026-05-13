import { BENEFITS } from '../_config'

export default function WhatYouGetSection() {
  return (
    <section className="py-[100px] px-[72px] max-[600px]:px-6" style={{ background: 'var(--cream)' }}>
      <div className="max-w-[1160px] mx-auto">
        <div
          className="inline-block font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-6 px-3 py-2 border rounded-[2px]"
          style={{
            color: 'var(--teal)',
            borderColor: 'rgba(11,110,120,0.25)',
            background: 'rgba(11,110,120,0.06)',
          }}
        >
          What Selected Nurses Receive
        </div>

        <h2
          className="font-cormorant font-bold leading-[.95] tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(38px, 4.5vw, 62px)', color: 'var(--ink)' }}
        >
          What Selected Nurses{' '}
          <em style={{ color: 'var(--teal)', fontStyle: 'italic' }}>Gain Access To.</em>
        </h2>

        <div className="w-9 h-px mb-8" style={{ background: 'var(--teal)' }} />

        <div className="grid grid-cols-2 gap-5 max-[1000px]:grid-cols-1">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 p-6 border border-l-4 rounded-[2px] transition-all duration-200
                hover:translate-y-[-3px] hover:border-l-[var(--gold)]"
              style={{
                background: 'white',
                borderColor: 'rgba(0,0,0,0.07)',
                borderLeftColor: 'var(--teal)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span className="text-[26px] flex-shrink-0 mt-[2px]">{b.icon}</span>
              <div>
                <p
                  className="font-barlow font-bold text-[13px] tracking-[.1em] uppercase mb-2"
                  style={{ color: 'var(--ink)' }}
                >
                  {b.title}
                </p>
                <p className="text-[13px] leading-[1.6]" style={{ color: '#555' }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-7 font-barlow font-bold text-[12px] tracking-[.14em] uppercase text-center"
          style={{ color: 'var(--teal)' }}
        >
          You don&apos;t need to change careers to begin. You just need a starting point.
        </p>
      </div>
    </section>
  )
}
