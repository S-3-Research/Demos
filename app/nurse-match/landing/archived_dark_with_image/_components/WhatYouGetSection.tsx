const VALUE_CARDS = [
  { icon: '💵', title: 'Supplemental Paid Income', desc: 'Become eligible for project-based paid research opportunities that fit your earnings goals.' },
  { icon: '🗓', title: 'Flexible Opportunities Beyond Your Regular Shift', desc: 'Designed to fit around your current nursing role — not replace it. Set your own pace and availability.' },
  { icon: '📋', title: 'Research-Ready Nurse™ Certificate', desc: 'GCP-certified training that prepares you for real-world research opportunities in your community.' },
  { icon: '📍', title: 'Be Contacted for Local Opportunities', desc: 'Once certified, you can be matched directly to nearby research opportunities — no searching on your own.' },
]

export default function WhatYouGetSection() {
  return (
    <section className="py-[60px] px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.5rem,3vw,2rem)] text-[#0d2a3f] text-center mb-2">
          A New Income Stream. Built on What You Already Know.
        </h2>

        {/* 4 value cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {VALUE_CARDS.map((card) => (
            <div key={card.title} className="text-center px-5 py-7 rounded-xl border border-[#e8eef2] bg-white">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1a6b7a] to-[#2a8fa0] rounded-[14px] flex items-center justify-center text-[24px] mx-auto mb-4">
                {card.icon}
              </div>
              <h4 className="text-[15px] font-bold text-[#0d2a3f] mb-2">{card.title}</h4>
              <p className="text-[13px] text-[#6b7c8d] leading-[1.6]">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Eligibility + selection grid */}
        <div className="grid grid-cols-2 border border-[#e8eef2] rounded-xl overflow-hidden">
          <div className="px-6 py-5 bg-[#f7f9fb]">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1a6b7a] flex items-center gap-2 mb-2">
              👥 Who is eligible to apply?
            </div>
            <p className="text-[14px] text-[#1a2a38]">Active U.S.-based RN or NP licenses are welcome. Nurses from all backgrounds, including those new to research, are welcome to apply.</p>
          </div>
          <div className="px-6 py-5 bg-white border-l border-[#e8eef2]">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1a6b7a] flex items-center gap-2 mb-2">
              ⚡ How selection works:
            </div>
            <p className="text-[14px] text-[#1a2a38]">Applications are reviewed on a rolling basis. Early applicants receive priority consideration for the 30 sponsored seats.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
