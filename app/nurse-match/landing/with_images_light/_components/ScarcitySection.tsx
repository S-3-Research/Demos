'use client'
import { useEffect, useRef, useState } from 'react'

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export default function ScarcitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const vh = window.innerHeight
      const raw = (vh * 0.75 - top) / (height * 1.5)
      setProgress(Math.min(1, Math.max(0, raw)))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const p = easeOut(progress)

  return (
    <div ref={sectionRef} className="bg-gradient-to-br from-[#1a6b7a] to-[#0d2a3f] px-6 py-8 text-center text-white overflow-hidden">
      <div className="max-w-[700px] mx-auto">
        <div
          style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}
          className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#f0a922] mb-2"
        >
          Why It Matters
        </div>
        <h2
          style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)`, transitionDelay: '0.05s' }}
          className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.3rem,2.5vw,1.8rem)] mb-[10px] leading-[1.2]"
        >
          Too Many Patients Lack Access to Clinical Innovation.
        </h2>
        <p
          style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}
          className="text-[15px] text-white/80"
        >
          Trials closer to home can help bring research opportunities to more patients and communities.
        </p>
      </div>
    </div>
  )
}

