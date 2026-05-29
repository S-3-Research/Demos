import Link from 'next/link'
import { COHORT } from '../../../_config'

export default function BottomCTA() {
  return (
    <div id="apply" className="bg-[#0d2a3f] py-7 px-6">
      <div className="max-w-[1100px] mx-auto w-full flex items-center justify-between gap-6">
        <div>
          <div className="text-[28px] mb-1">👩‍⚕️</div>
          <h3 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[1.3rem] text-white mb-1">Be the Nurse Clinical Research Needs.</h3>
          <p className="text-[13px] text-white/60">Apply in minutes. Keep your current job. Earn more on your own schedule.</p>
        </div>
        <div className="text-right shrink-0">
          <Link href={COHORT.applyUrl} className="inline-block bg-[#d4920a] text-[#0d2a3f] font-bold text-[14px] py-4 px-8 rounded-lg no-underline uppercase tracking-[0.06em] whitespace-nowrap">
            Apply for the Inaugural Cohort →
          </Link>
          <div className="text-[12px] text-white/50 mt-2">Seats are limited. Apply today.</div>
        </div>
      </div>
    </div>
  )
}

