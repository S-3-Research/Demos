export default function LandingFooter() {
  return (
    <div className="bg-white px-6 py-10 border-t border-[#e8eef2]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[auto_1fr_auto] gap-8 items-center">
        <div className="w-16 h-16 bg-[#0d2a3f] rounded-[14px] flex items-center justify-center font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[20px] text-[#f0a922] font-black shrink-0">
          A
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a6b7a] mb-1.5">About ACHIEVE</div>
          <p className="text-[14px] text-[#6b7c8d] leading-[1.6]">ACHIEVE Clinical Expertise is a clinician-powered clinical research platform preparing nurses and community-based clinicians for research-ready roles in decentralized, community-based, and real-world clinical studies.</p>
          <a href="#" className="text-[#1a6b7a] font-semibold no-underline text-[14px] mt-2 inline-block">Learn more about ACHIEVE →</a>
        </div>
        <div className="flex gap-4">
          {[
            { icon: '🏥', label: 'Clinician-Powered' },
            { icon: '🌍', label: 'Community-Focused' },
            { icon: '⭐', label: 'Real-World Impact' },
          ].map((badge) => (
            <div key={badge.label} className="text-center px-4 py-3 border border-[#e8eef2] rounded-[10px] min-w-[100px]">
              <div className="text-[22px] mb-1">{badge.icon}</div>
              <div className="text-[11px] font-semibold text-[#0d2a3f]">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
