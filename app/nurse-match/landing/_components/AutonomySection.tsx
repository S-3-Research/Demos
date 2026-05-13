import { AUTONOMY_CONTROLS } from '../_config'

export default function AutonomySection() {
  return (
    <section
      className="autonomy-bg relative py-[100px] px-[72px] max-[600px]:px-6"
      style={{ background: 'var(--ink)' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-2 gap-[80px] items-start max-[1000px]:grid-cols-1 max-[1000px]:gap-12">
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
            The Real Difference
          </div>

          <p
            className="font-cormorant font-bold leading-[.95] mb-6"
            style={{ fontSize: 'clamp(38px, 4.5vw, 64px)', color: 'var(--cream)' }}
          >
            You are in{' '}
            <em className="block" style={{ color: 'var(--teal-light)' }}>control.</em>
          </p>

          <div className="w-9 h-px mb-7" style={{ background: 'var(--teal)' }} />

          <p className="text-[15px] leading-[1.75]" style={{ color: 'var(--muted)' }}>
            ACHIEVE is structured to fit alongside your existing clinical role — virtual, self-paced,
            and designed for practicing nurses. You decide the pace and the level of engagement.
          </p>
        </div>

        {/* Right — control list */}
        <div
          className="border rounded-[2px] overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {AUTONOMY_CONTROLS.map((item, i) => (
            <div
              key={item.title}
              className="flex items-start gap-4 px-6 py-5 border-b last:border-b-0 transition-colors duration-200 hover:bg-[rgba(11,110,120,0.06)]"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-[2px] text-[18px]"
                style={{ background: 'var(--teal-pale)', border: '1px solid rgba(11,110,120,0.25)' }}
              >
                {item.icon}
              </div>
              <div>
                <p
                  className="font-barlow font-bold text-[13px] tracking-[.1em] uppercase mb-1"
                  style={{ color: 'white' }}
                >
                  {item.title}
                </p>
                <p className="text-[13px] leading-[1.5]" style={{ color: 'var(--muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
