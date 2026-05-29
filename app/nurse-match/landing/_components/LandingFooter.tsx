export default function LandingFooter() {
  return (
    <div className="bg-white px-5 sm:px-6 py-10 border-t border-[#e8eef2]">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 sm:items-center">
        {/* Logo + about — row on mobile */}
        <div className="flex sm:block items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0d2a3f] rounded-[14px] flex items-center justify-center font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[18px] sm:text-[20px] text-[#f0a922] font-black shrink-0">
            A
          </div>
          {/* Label visible only on mobile next to logo */}
          <div className="sm:hidden text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a6b7a]">About ACHIEVE</div>
        </div>
        <div>
          <div className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a6b7a] mb-1.5">About ACHIEVE</div>
          <p className="text-[13px] sm:text-[14px] text-[#6b7c8d] leading-[1.6]">ACHIEVE Clinical Expertise is a clinician-powered clinical research platform preparing nurses and community-based clinicians for research-ready roles in decentralized, community-based, and real-world clinical studies.</p>
          <a href="https://achieveexpertise.com/" className="text-[#1a6b7a] font-semibold no-underline text-[13px] sm:text-[14px] mt-2 inline-block">Learn more about ACHIEVE →</a>
        </div>
        {/* Badges — horizontal scroll on mobile, flex wrap on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-1 sm:pb-0 sm:flex-col sm:gap-3 -mx-5 px-5 sm:mx-0 sm:px-0">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#1a6b7a]">
                  <path d="M4.5 2.5v7a7.5 7.5 0 0 0 15 0v-7"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                  <circle cx="12" cy="21" r="1.5"/>
                  <line x1="4.5" y1="2.5" x2="4.5" y2="5"/>
                  <line x1="19.5" y1="2.5" x2="19.5" y2="5"/>
                </svg>
              ),
              label: 'Clinician-Powered',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#1a6b7a]">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              ),
              label: 'Community-Focused',
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#1a6b7a]">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
              label: 'Real-World Impact',
            },
          ].map((badge) => (
            <div key={badge.label} className="text-center px-4 py-3 border border-[#e8eef2] rounded-2xl shrink-0 sm:shrink sm:w-full flex sm:flex-row items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#f0f4f7] flex items-center justify-center shrink-0">{badge.icon}</div>
              <div className="text-[11px] font-semibold text-[#0d2a3f] whitespace-nowrap sm:whitespace-normal">{badge.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
