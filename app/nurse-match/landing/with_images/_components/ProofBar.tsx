export default function ProofBar() {
  const items = [
    { icon: '📅', label: '8–10 Hour Virtual Training', sub: 'Self-paced and asynchronous' },
    { icon: '💰', label: 'Eligible for Paid Local Research Opportunities', sub: 'After course completion' },
    { icon: '💼', label: 'Keep Your Current Job', sub: 'No need to leave your role' },
    { icon: '✅', label: 'No Research Experience Required', sub: 'We welcome nurses from all backgrounds' },
  ]

  return (
    <div className="bg-[#0d2a3f] py-5 px-6">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[auto_repeat(4,1fr)] gap-3 items-center">
        {/* Tuition covered */}
        <div className="bg-white/[0.06] rounded-[10px] px-4 py-3 flex items-center gap-3">
          <div>
            <div className="text-[10px] text-white/60 uppercase tracking-[0.06em]">Tuition Covered</div>
            <div className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[1.6rem] text-[#f0a922] leading-none">$3,000</div>
            <div className="text-[10px] text-white/60 uppercase tracking-[0.06em]">Value — First 30 Only</div>
          </div>
        </div>

        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-[10px] text-white">
            <div className="w-10 h-10 bg-white/[0.08] rounded-lg flex items-center justify-center text-[18px] shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-[12px] font-bold text-white">{item.label}</div>
              <div className="text-[11px] text-white/60">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
