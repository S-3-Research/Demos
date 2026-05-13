export default function LandingFooter() {
  return (
    <footer
      className="border-t px-[72px] max-[600px]:px-6 py-6"
      style={{
        background: 'var(--ink-mid)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-[1160px] mx-auto flex items-center justify-between">
        <div>
          <div
            className="font-cormorant font-bold text-[18px] tracking-[.05em] mb-1"
            style={{ color: 'var(--gold-bright)' }}
          >
            ACHIEVE
          </div>
          <div
            className="font-barlow text-[11px] tracking-[.14em]"
            style={{ color: 'var(--muted)' }}
          >
            Clinician-Powered &nbsp;·&nbsp; Research-Ready &nbsp;·&nbsp; Community-Centered &nbsp;·&nbsp; achievenetwork.org
          </div>
        </div>

        <div className="flex gap-[18px]">
          {['About', 'FAQ', 'Privacy', 'Apply'].map((link) => (
            <a
              key={link}
              href="#"
              className="font-barlow font-bold text-[11px] tracking-[.14em] uppercase no-underline
                transition-colors duration-200 hover:text-[var(--teal-light)]"
              style={{ color: 'rgba(255,255,255,0.42)' }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
