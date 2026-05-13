import { STEPS } from '../_config'

export default function StepsSection() {
  return (
    <section className="py-[100px] px-[72px] max-[600px]:px-6" style={{ background: 'var(--ink)' }}>
      <div className="max-w-[1160px] mx-auto">
        <div
          className="inline-block font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-6 px-3 py-2 border rounded-[2px]"
          style={{
            color: 'var(--teal-light)',
            borderColor: 'rgba(11,110,120,0.3)',
            background: 'rgba(11,110,120,0.1)',
          }}
        >
          The Path
        </div>

        <h2
          className="font-cormorant font-bold leading-[.95] tracking-[-0.02em] mb-3"
          style={{ fontSize: 'clamp(38px, 4.5vw, 62px)', color: 'white' }}
        >
          Apply. Get Selected.{' '}
          <em style={{ color: 'var(--gold-bright)', fontStyle: 'italic' }}>Step In.</em>
        </h2>

        <div className="w-9 h-px mb-10" style={{ background: 'var(--teal)' }} />

        {/* Steps row — matches original: gradient connector line, ink-mid ring shadow on nodes */}
        <div
          className="steps-layout"
        >
          {/* Connector line: teal → gold → teal, sits at top:28px (node center) */}
          <div
            className="steps-connector absolute z-0"
            style={{
              top: '28px',
              left: '10%',
              right: '10%',
              height: '1px',
              background: 'linear-gradient(90deg, var(--teal), var(--gold-bright), var(--teal))',
            }}
          />

          {STEPS.map((step, i) => (
            <div key={step.num} className="text-center relative z-[1] px-2">
              {/* Node — ink-mid ring shadow punches through the connector line */}
              <div
                className={`w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-3
                  font-cormorant font-bold text-[20px] leading-none transition-all duration-300
                  ${i === 0 ? 'step-node-glow' : ''}`}
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg, var(--teal), var(--teal-light))'
                    : 'var(--ink)',
                  borderColor: i === 0 ? 'var(--teal-light)' : 'rgba(11,110,120,0.3)',
                  color: i === 0 ? 'white' : 'var(--teal-light)',
                  boxShadow: '0 0 0 7px var(--ink)',
                }}
              >
                {step.num}
              </div>
              <p
                className="font-barlow font-extrabold text-[12px] tracking-[.08em] uppercase mb-[5px]"
                style={{ color: 'white' }}
              >
                {step.title}
              </p>
              <p className="text-[11px] leading-[1.45]" style={{ color: 'var(--muted)' }}>
                {step.desc}
              </p>
              <span
                className="inline-block font-barlow font-bold text-[9px] tracking-[.1em] uppercase
                  px-2 py-[2px] rounded-[1px] mt-[5px]"
                style={{
                  background: 'var(--teal-pale)',
                  color: 'var(--teal-light)',
                }}
              >
                {step.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
