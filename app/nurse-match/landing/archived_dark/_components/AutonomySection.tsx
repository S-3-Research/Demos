const TESTIMONIALS = [
  { quote: 'It was the best thing I could have done for my career. I finally felt like my skills were being used at their full potential.', attrib: 'RN, Clinical Research Transition', sub: '10-year bedside RN' },
  { quote: 'Working on something that could potentially change the future of standard care is rewarding.', attrib: 'RN, Decentralized Trials', sub: 'ICU RN — Clinical Research Nurse' },
  { quote: "It's a very nice way to be able to see the outcomes and improve patient lives.", attrib: 'Research Nurse', sub: 'Community Health RN' },
]

export default function AutonomySection() {
  return (
    <section className="py-[60px] px-6 bg-[#f7f9fb]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[280px_1fr] gap-10 items-start">
        {/* Built for nurses card */}
        <div className="bg-[#0d2a3f] rounded-[14px] px-6 py-7 text-white">
          <h3 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[1.3rem] mb-4 leading-[1.2]">
            Built for Nurses Ready to Do More.
          </h3>
          <div className="bg-[#d4920a] rounded-lg px-4 py-[14px] mb-4 flex items-center gap-[10px]">
            <div className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[2rem] text-[#0d2a3f] leading-none font-black">30</div>
            <div className="text-[13px] text-[#0d2a3f] font-semibold leading-[1.3]">Inaugural sponsored seats — full tuition covered.</div>
          </div>
          <p className="text-[13px] text-white/70 leading-[1.5]">All applicants automatically waitlisted for future funded cohorts — no need to reapply.</p>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#d4920a] mb-4">
            What Nurses Are Saying
          </div>
          <div className="grid grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.attrib} className="bg-white rounded-xl p-5 border border-[#e8eef2]">
                <div className="text-[32px] text-[#1a6b7a] leading-[0.8] mb-2">&ldquo;</div>
                <p className="text-[13px] italic text-[#1a2a38] leading-[1.6] mb-3">{t.quote}</p>
                <div className="text-[12px] text-[#6b7c8d] font-semibold">
                  — {t.attrib}<br />{t.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
