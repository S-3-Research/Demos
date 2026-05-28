const ICONS = {
  detail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
      <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  advocacy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  thinking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  curiosity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.6-1.4 4.9-3.5 6.2V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1.8C6.4 13.9 5 11.6 5 9a7 7 0 0 1 7-7z"/>
      <line x1="9" y1="21" x2="15" y2="21"/>
      <line x1="10" y1="18" x2="10" y2="21"/>
      <line x1="14" y1="18" x2="14" y2="21"/>
    </svg>
  ),
}

const FOUNDATION_ITEMS = [
  { iconKey: 'detail' as const, title: 'Attention to Detail', desc: 'Ensures accuracy and protects data quality and participant safety.' },
  { iconKey: 'advocacy' as const, title: 'Patient Advocacy', desc: 'Puts participants first and safeguards their well-being.' },
  { iconKey: 'thinking' as const, title: 'Critical Thinking', desc: 'Analyzes, questions, and solves problems in real time.' },
  { iconKey: 'curiosity' as const, title: 'Curiosity', desc: 'Asks questions and seeks better ways to advance science.' },
]

export default function WhoQualifiesSection() {
  return (
    <section className="py-[60px] px-5 sm:px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.5rem,3vw,2rem)] text-[#0d2a3f] text-center mb-2">
          You Already Have the Foundation
        </h2>
        <p className="text-center text-[#6b7c8d] text-[15px] mb-8">
          The skills you use every day as a nurse are exactly what clinical research needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FOUNDATION_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-[14px] p-5 rounded-2xl bg-[#f7f9fb]">
              <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#1a6b7a] to-[#2a8fa0] flex items-center justify-center shrink-0">
                {ICONS[item.iconKey]}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#0d2a3f] mb-1">{item.title}</h4>
                <p className="text-[12px] text-[#6b7c8d] leading-[1.5]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

