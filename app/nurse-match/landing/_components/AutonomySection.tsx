'use client'
import { useEffect, useRef, useState } from 'react'

const TESTIMONIALS = [
  { quote: 'It was the best thing I could have done for my career. I finally felt like my skills were being used at their full potential.', attrib: 'RN, Clinical Research Transition', sub: '10-year bedside RN' },
  { quote: 'Working on something that could potentially change the future of standard care is rewarding.', attrib: 'RN, Decentralized Trials', sub: 'ICU RN — Clinical Research Nurse' },
  { quote: "It's a very nice way to be able to see the outcomes and improve patient lives.", attrib: 'Research Nurse', sub: 'Community Health RN' },
]

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export default function AutonomySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const { top, bottom, height } = el.getBoundingClientRect()
      const vh = window.innerHeight
      // enter: section top slides into 85% of viewport
      const enterRaw = (vh * 0.85 - top) / (height * 1.2)
      // exit: section bottom leaves viewport top — retract when bottom < 45% vh
      const exitRaw = bottom / (vh * 0.65)
      const raw = Math.min(enterRaw, exitRaw)
      setProgress(Math.min(1, Math.max(0, raw)))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const p = easeOut(progress)

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 px-5 sm:px-12 bg-[#f0f4f7] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-[280px_1fr] gap-8 sm:gap-12 items-start">

        {/* Left promo card — slides in from left */}
        <div
          style={{ transform: `translateX(${(1 - p) * -80}px)`, opacity: p }}
          className="bg-[#0d2a3f] rounded-3xl px-6 py-7 text-white w-full"
        >
          <h3 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[1.3rem] mb-4 leading-[1.2]">
            Built for Nurses Ready to Do More.
          </h3>
          <div className="bg-[#f0a922] rounded-2xl px-4 py-[14px] mb-4 flex items-center gap-[10px]">
            <div className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[2rem] text-[#0d2a3f] leading-none font-black">30</div>
            <div className="text-[13px] text-[#0d2a3f] font-semibold leading-[1.3]">Inaugural sponsored seats — full tuition covered.</div>
          </div>
          <p className="text-[13px] text-white/70 leading-[1.5]">All applicants automatically waitlisted for future funded cohorts — no need to reapply.</p>
        </div>

        {/* Right — heading + testimony cards */}
        <div className="w-full">
          <div
            style={{ transform: `translateX(${(1 - p) * -60}px)`, opacity: p }}
            className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.15] text-[#f0a922] mb-5"
          >
            What Nurses Are Saying
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => {
              // each card staggered — later cards need more scroll
              const cardP = easeOut(Math.min(1, Math.max(0, (progress - i * 0.12) / 0.7)))
              const offsetX = (1 - cardP) * -(120 + i * 40)
              return (
                <div
                  key={t.attrib}
                  style={{ transform: `translateX(${offsetX}px)`, opacity: cardP }}
                  className="bg-white rounded-3xl p-5 border border-[#e2eaef] shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                >
                  <div className="text-[32px] text-[#f0a922] leading-[0.8] mb-2">&ldquo;</div>
                  <p className="text-[13px] italic text-[#1a2a38] leading-[1.6] mb-4">{t.quote}</p>
                  <div className="text-[12px] text-[#6b7c8d] font-semibold leading-[1.5]">
                    — {t.attrib}<br />{t.sub}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
