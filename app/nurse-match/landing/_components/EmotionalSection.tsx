import { QUOTES } from '../_config'

export default function EmotionalSection() {
  return (
    <section className="emotional-bg px-[72px] max-[600px]:px-6">
      <div className="max-w-[1160px] mx-auto">
        {/* Section tag */}
        <div
          className="inline-block font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-6 px-3 py-2 border rounded-[2px]"
          style={{
            color: 'var(--teal-light)',
            borderColor: 'rgba(11,110,120,0.3)',
            background: 'rgba(11,110,120,0.1)',
          }}
        >
          What Changes
        </div>

        <h2
          className="font-cormorant font-bold leading-[.95] tracking-[-0.02em] mb-8"
          style={{ fontSize: 'clamp(42px, 5vw, 68px)', color: 'var(--cream)' }}
        >
          Why This{' '}
          <em style={{ color: 'var(--teal-light)', fontStyle: 'italic' }}>Matters.</em>
        </h2>

        <div className="max-w-[680px] mb-8">
          <p className="text-[16px] leading-[1.82] mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
            You&apos;ve built a career grounded in clinical judgment, trust, and real responsibility.
          </p>
          <p className="text-[16px] leading-[1.82] mb-4" style={{ color: 'rgba(255,255,255,0.62)' }}>
            Now, a sponsored opportunity is opening a new pathway. Through ACHIEVE, you can extend
            your expertise beyond the bedside — engaging with emerging therapies, contributing to
            how care evolves, and participating in clinical research in a structured, supported way.
          </p>
          <p
            className="font-cormorant font-semibold italic text-[20px] mb-4 border-l-2 pl-4 leading-[1.55]"
            style={{ color: 'var(--cream)', borderColor: 'var(--teal)' }}
          >
            This pathway creates flexible, project-based opportunities that reflect the full value of
            your experience — while allowing you to continue in your current role.
          </p>
          <p className="text-[16px] leading-[1.82]" style={{ color: 'rgba(255,255,255,0.62)' }}>
            And for your community, the impact is meaningful. It helps bring cutting-edge therapies
            closer to patients — through clinicians they already trust.
          </p>
        </div>

        <p
          className="font-barlow font-semibold text-[12px] tracking-[.16em] uppercase mb-5"
          style={{ color: 'var(--muted)' }}
        >
          Nurses who step into clinical research often describe the same shift:
        </p>

        {/* Quotes grid */}
        <div className="grid grid-cols-3 gap-6 max-[1000px]:grid-cols-1">
          {QUOTES.map((q) => (
            <div
              key={q.author}
              className="p-6 border rounded-[2px] relative overflow-hidden transition-colors duration-200
                hover:bg-[rgba(11,110,120,0.04)]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <p
                className="font-cormorant italic text-[18px] font-normal leading-[1.6] mb-4"
                style={{ color: 'rgba(255,255,255,0.82)' }}
              >
                {q.quote}
              </p>
              <div
                className="font-barlow font-bold text-[10px] tracking-[.2em] uppercase"
                style={{ color: 'var(--teal-light)' }}
              >
                {q.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
