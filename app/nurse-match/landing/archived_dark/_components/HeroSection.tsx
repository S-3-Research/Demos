import Link from 'next/link'
import { COHORT } from '../../../_config'

export default function HeroSection() {
  return (
    <section className="bg-[linear-gradient(135deg,#0d2a3f_0%,#1a3d54_60%,#1e5068_100%)] text-white pt-12 px-6 pb-0 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,107,122,0.3)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-10 items-end">
        {/* Left content */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#f0a922] mb-1">
            Research-Ready Nurse™ Program
          </div>
          <div className="text-[13px] text-white/70 mb-5">
            by ACHIEVE Clinical Expertise
          </div>
          <h1 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] mb-4">
            Expand Your<br />
            <em className="italic text-[#f0a922]">Nursing Career</em><br />
            With Clinical Research.
          </h1>
          <p className="text-[16px] text-white/85 leading-[1.6] mb-2">
            Gain the skills, certification, and access to paid local research opportunities — on your schedule.
          </p>
          <p className="text-[13px] text-white/60 mb-8">
            Keep your current job. Earn more on your own schedule.
          </p>
        </div>

        {/* Right: CTA panel */}
        <div className="relative flex flex-col gap-4 pb-8">
          {/* TransCelerate badge */}
          <div className="bg-white/[0.12] backdrop-blur-[8px] border border-white/20 rounded-[10px] px-[14px] py-3 text-[11px] text-white/90 leading-[1.5]">
            <strong className="text-[#f0a922] block mb-1 text-[12px]">TransCelerate BioPharma Recognized</strong>
            This ICH E6 GCP Investigator Site Training meets the Minimum Criteria for mutual recognition of GCP training among major trial sponsors worldwide.
          </div>

          {/* CTA panel */}
          <div className="bg-white rounded-2xl p-7 grid grid-cols-[auto_1fr] gap-6 items-start shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="bg-[#0d2a3f] rounded-xl px-[18px] py-5 text-center min-w-[100px]">
              <div className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[3rem] text-[#f0a922] leading-none">
                {COHORT.seats}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 mt-1">
                Sponsored<br />Seats
              </div>
            </div>
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#0d2a3f] mb-3">
                Seats Filling Now
              </h3>
              <Link
                href={COHORT.applyUrl}
                className="block bg-[#d4920a] text-[#0d2a3f] font-bold text-[14px] py-[14px] px-6 rounded-lg no-underline uppercase tracking-[0.06em] text-center mb-[14px]"
              >
                Apply for Sponsored Selection →
              </Link>
              <ul className="list-none text-[13px] text-[#6b7c8d] flex flex-col gap-1.5">
                {[
                  `Only ${COHORT.seats} fully sponsored seats available.`,
                  'Applications reviewed on a rolling basis — early applicants receive priority.',
                  'Takes 3 minutes to apply.',
                  'All applicants automatically waitlisted for future funded cohorts.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#1a6b7a] font-black shrink-0 mt-[1px]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
