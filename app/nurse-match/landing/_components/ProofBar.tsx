import { PROOF_BAR } from '../_config'

export default function ProofBar() {
  return (
    <>
      {/* Proof bar */}
      <div style={{ background: 'var(--ink-mid)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1160px] mx-auto px-[72px] max-[600px]:px-6 py-6 flex items-center justify-center flex-wrap gap-6">
          {PROOF_BAR.map((item, i) => (
            <div key={item.label} className="flex items-center gap-6">
              {i > 0 && (
                <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.07)' }} />
              )}
              <div className="text-center">
                <span
                  className="font-cormorant font-bold text-[22px] block leading-none mb-1"
                  style={{ color: 'var(--gold-bright)' }}
                >
                  {item.value}
                </span>
                <span
                  className="font-barlow font-bold text-[10px] uppercase tracking-[.14em]"
                  style={{ color: 'rgba(255,255,255,0.42)' }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Not a job line */}
      <div
        className="px-[72px] max-[600px]:px-6 py-[22px] text-center border-b"
        style={{ background: 'var(--ink)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <p
          className="font-cormorant font-semibold italic max-w-[700px] mx-auto"
          style={{
            fontSize: 'clamp(18px, 2vw, 24px)',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '-0.01em',
          }}
        >
          This is not a job. It&apos;s access to a new way of working.
        </p>
      </div>
    </>
  )
}
