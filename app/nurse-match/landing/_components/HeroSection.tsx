'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COHORT } from '../../_config'
import SiteHeader from './SiteHeader'

const IMAGES = [
  '/images/nurse_match/smiling_nurses.jpg',
]

export default function HeroSection() {
  const [heroImg] = useState(IMAGES[0])
  const [count, setCount] = useState(0)
  const [shimmerKey, setShimmerKey] = useState(0)
  const badgeRef = useRef<SVGSVGElement>(null)

  const runCountUp = () => {
    const target = 30
    const duration = 2400
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    setCount(0)
    requestAnimationFrame(tick)
  }

  useEffect(() => {
    runCountUp()
    const el = badgeRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) runCountUp() },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="min-h-[65vh] px-0 pb-0 relative overflow-hidden flex flex-col"
     style={{ background: 'linear-gradient(180deg, #c8d8e8 0%, #dde8ee 15%, #f3f3f3 35%, #f3f3f3   100%)' }}
     >


      {/* Announcement bar */}
      <div className="hidden sm:inline w-full py-2 my-3 text-gray-500 text-center font-bold text-[12px] tracking-[0.04em] uppercase">
        <span className="mr-1.5">★</span>
        <span>INAUGURAL COHORT NOW OPEN</span>
        <span className="hidden sm:inline"> — 30 SPONSORED SEATS AVAILABLE</span>
        
      </div>

      {/* Fixed nav rendered at top: 90px — spacer reserves its visual space */}
      <SiteHeader />
      <div className="h-20 sm:h-20" aria-hidden="true" />

      {/* Radial glow */}
      {/* <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,107,122,0.3)_0%,transparent_70%)] pointer-events-none" /> */}

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-[2fr_3fr] gap-6 sm:gap-10 items-end py-8 sm:py-13 px-5 sm:px-5 flex-1 min-h-0">
        {/* Left content */}
        <div className="flex flex-col justify-end sm:h-full">
          {/* <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg border-0 flex items-center justify-center shrink-0">
              <span className="text-[#2dd4bf] font-bold text-[30px] leading-none" style={{ fontFamily: 'Georgia, serif' }}>A</span>
            </div>
            <div>
              <div className="text-[11px] uppercase text-gray-500 mb-0 font-bold leading-tight">
                Research-Ready Nurse™ Program
              </div>
              <div className="text-[11px] text-gray-400">
                by ACHIEVE Clinical Expertise
              </div>
            </div>
          </div> */}
          <h1 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] mb-4 animate-[fade-up_0.6s_ease-out_0.15s_both]">
            Expand Your<br />
            <span className="text-[#f0a922]">Nursing Career</span>
            <em className="text-[22px] ml-3">with</em>
            <br />Clinical Research.
          </h1>
          <Link
            href={COHORT.applyUrl}
            onMouseEnter={() => setShimmerKey(k => k + 1)}
            className="self-stretch sm:self-start bg-[#f0a922] text-gray-100 font-extrabold text-[15px] py-[14px] sm:px-6 rounded-3xl no-underline uppercase tracking-[0.06em] text-center relative overflow-hidden transition-transform duration-200 hover:scale-[1.04] animate-[fade-up_0.6s_ease-out_0.3s_both]"
          >
            {/* Shimmer sweep — key flip remounts span, restarting animation each hover */}
            <span key={shimmerKey} className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_2s_1] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
            <span className="relative">• Apply for Sponsored Selection</span>
          </Link>
          {/* <p className="text-[16px] text-[#0d2a3f] leading-[1.6] mb-2">
            Gain the skills, certification, and access to paid local research opportunities — on your schedule.
          </p>
          <p className="text-[13px] text-[#0d2a3f] mb-8">
            Keep your current job. Earn more on your own schedule.
          </p> */}
          {/* <ProofBar /> */}

        </div>

        {/* Right: image */}
        <div className="relative flex flex-col gap-0 pb-0 justify-end items-end h-full animate-[fade-up_0.7s_ease-out_0.25s_both]">
          {/* Rounded image container — adjust w/translate to position; h fills remaining column */}
          <div className="relative w-full h-[260px] sm:h-auto sm:flex-1 sm:min-h-0 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={heroImg}
              alt="Medical team"
              fill
              className="object-cover object-[70%_20%] saturate-80 brightness-98"
              priority
            />

            {/* Glassmorphism floating card — bottom-right */}
            <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-white/20 border-0 border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-4 flex gap-3 items-center md:min-w-[320px] max-w-[420px]">
              {/* Seat count — SVG knockout text revealing glass */}
              <svg ref={badgeRef} width="90" height="90" viewBox="0 0 80 80" className="shrink-0">
                <rect width="80" height="80" fill="#09284d" rx="12" />
                <text x="40" y="46" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900" fontSize="40" fill="white">{count}</text>
                <text x="40" y="60" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="8" letterSpacing="1" fill="white">SPONSORED</text>
                <text x="40" y="71" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="8" letterSpacing="1" fill="white">SEATS</text>
              </svg>
              {/* Text */}
              <div className="hidden md:flex flex-col justify-between self-stretch py-2 px-2 flex-1 min-w-0">
                {[
                  'Rolling Admissions',
                  '3-min Application',
                  'Auto-Waitlisted',
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-3">
                    <span className="text-white text-[14px] tracking-wider font-bold leading-none drop-shadow-sm whitespace-nowrap">{item}</span>
                    <span className="text-white text-[14px] shrink-0">✔</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TransCelerate badge */}
          {/* <div className="bg-white/[0.12] backdrop-blur-[8px] border border-white/20 rounded-[10px] px-[14px] py-3 text-[11px] text-white/90 leading-[1.5]">
            <strong className="text-[#f0a922] block mb-1 text-[12px]">TransCelerate BioPharma Recognized</strong>
            This ICH E6 GCP Investigator Site Training meets the Minimum Criteria for mutual recognition of GCP training among major trial sponsors worldwide.
          </div> */}

          {/* CTA panel */}
          {/* <div className="bg-white rounded-2xl p-7 grid grid-cols-[auto_1fr] gap-6 items-start shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
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
          </div> */}
        </div>
      </div>
    </section>
  )
}
