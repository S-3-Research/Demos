import Link from 'next/link'
import { COHORT } from '../../_config'

export default function BottomCTA() {
  return (
    <div id="apply" className="bg-[#0d2a3f] py-8 px-5 sm:py-7 sm:px-6">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-6">
        <div>
          <h3 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[1.25rem] sm:text-[1.3rem] text-white mb-1">Be the Nurse Clinical Research Needs.</h3>
          <p className="text-center sm:text-left text-[12px] text-white/50">Apply in minutes. Keep your current job. Earn more on your own schedule.</p>
        </div>
        <div className="sm:text-right shrink-0">
          <Link href={COHORT.applyUrl} className="block sm:inline-block text-center bg-[#d4920a] text-[#0d2a3f] font-bold text-[14px] py-4 px-8 rounded-2xl no-underline uppercase tracking-[0.06em]">
            Apply
            <span className="hidden sm:inline"> for the Inaugural Cohort →</span>
          </Link>
          <div className="text-[12px] text-white/50 mt-2 text-center sm:text-right">Seats are limited. Apply today.</div>
        </div>
      </div>
    </div>
  )
}

