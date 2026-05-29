export default function Ticker() {
  return (
    <>
      {/* Gold announcement bar */}
      <div className="bg-[#d4920a] text-[#0d2a3f] text-center px-4 py-[10px] font-bold text-[14px] tracking-[0.04em] uppercase">
        <span className="mr-1.5">★</span>
        INAUGURAL COHORT NOW OPEN — 30 SPONSORED SEATS AVAILABLE
      </div>

      {/* Navy sub-bar */}
      <div className="bg-[#0d2a3f] text-white text-center px-4 py-2 text-[13px] flex items-center justify-center gap-2">
        <span className="w-4 h-4 bg-[#d4920a] rounded-[3px] inline-flex items-center justify-center shrink-0 text-[#0d2a3f] text-[10px] font-black">✓</span>
        All applicants automatically waitlisted for future funded cohorts — no need to reapply
      </div>
    </>
  )
}