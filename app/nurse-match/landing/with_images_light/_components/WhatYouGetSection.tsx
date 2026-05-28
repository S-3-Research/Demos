'use client'
import { useEffect, useRef, useState } from 'react'

const VALUE_CARDS = [
  { icon: '💵', title: 'Supplemental Paid Income', desc: 'Become eligible for project-based paid research opportunities that fit your earnings goals.' },
  { icon: '🗓', title: 'Flexible Around Your Shift', desc: 'Designed to fit around your current nursing role — not replace it. Set your own pace and availability.' },
  { icon: '📋', title: 'Research-Ready Nurse™ Certificate', desc: 'GCP-certified training that prepares you for real-world research opportunities in your community.' },
  { icon: '📍', title: 'Matched to Local Opportunities', desc: 'Once certified, you can be matched directly to nearby research opportunities — no searching required.' },
]

const META_ITEMS = [
  { icon: '👥', label: 'Who can apply?', body: 'Active U.S.-based RN or NP licenses welcome. All backgrounds — including those new to research.' },
  { icon: '⚡', label: 'How selection works', body: 'Applications reviewed on a rolling basis. Early applicants receive priority for the 30 sponsored seats.' },
  { icon: '🛡', label: 'No risk to your current role', body: 'Training is fully asynchronous and self-paced. Keep your job — add research on your own terms.' },
]

export default function WhatYouGetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const shown = visible ? 'animate-[fade-up_0.6s_ease-out_both]' : 'opacity-0'

  return (
    <section
      ref={sectionRef}
      className="px-5 sm:px-12 py-16 sm:py-24"
      style={{ background: 'linear-gradient(180deg, #f8f8f8 0%, #f0f4f7 100%)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">

        {/* Heading */}
        <div className={shown} style={{ animationDelay: '0.05s' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a6b7a] mb-3">What you get</p>
          <h2 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.15] text-[#f0a922] max-w-xl">
            A New Income Stream.<br />
            <span className="text-[#0d2a3f]">Built on What You Already Know.</span>
          </h2>
        </div>

        {/* 4 value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`flex flex-col gap-4 px-6 py-7 rounded-3xl border border-[#e2eaef] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_36px_rgba(0,0,0,0.13)] hover:scale-[1.05] transition-all duration-300 ease-out ${shown}`}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#0d2a3f] to-[#1a4a60] rounded-2xl flex items-center justify-center text-[22px] shrink-0">
                {card.icon}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#0d2a3f] mb-1.5 leading-tight">{card.title}</h4>
                <p className="text-[13px] text-[#6b7c8d] leading-[1.65]">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Meta strip */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 rounded-3xl overflow-hidden border border-[#e2eaef] ${shown}`} style={{ animationDelay: '0.4s' }}>
          {META_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`px-6 py-6 flex flex-col gap-2 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-[#e2eaef]' : ''} ${i % 2 === 0 ? 'bg-[#f7f9fb]' : 'bg-white'}`}
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#1a6b7a] flex items-center gap-2">
                <span>{item.icon}</span>{item.label}
              </div>
              <p className="text-[13px] text-[#1a2a38] leading-[1.6]">{item.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
