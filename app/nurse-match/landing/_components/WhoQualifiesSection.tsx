const FOUNDATION_ITEMS = [
  { icon: '🔍', title: 'Attention to Detail', desc: 'Ensures accuracy and protects data quality and participant safety.' },
  { icon: '🤝', title: 'Patient Advocacy', desc: 'Puts participants first and safeguards their well-being.' },
  { icon: '🧠', title: 'Critical Thinking', desc: 'Analyzes, questions, and solves problems in real time.' },
  { icon: '💡', title: 'Curiosity', desc: 'Asks questions and seeks better ways to advance science.' },
]

export default function WhoQualifiesSection() {
  return (
    <section className="py-[60px] px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.5rem,3vw,2rem)] text-[#0d2a3f] text-center mb-2">
          You Already Have the Foundation
        </h2>
        <p className="text-center text-[#6b7c8d] text-[15px] mb-8">
          The skills you use every day as a nurse are exactly what clinical research needs.
        </p>
        <div className="grid grid-cols-4 gap-5">
          {FOUNDATION_ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-[14px] p-5 rounded-[10px] bg-[#f7f9fb]">
              <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#1a6b7a] to-[#2a8fa0] flex items-center justify-center text-[20px] shrink-0">
                {item.icon}
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

