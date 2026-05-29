'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COHORT } from '../../../_config'

const IMAGES = [
  '/images/nurse_match/istockphoto-998313080-1024x1024.jpg',
  '/images/nurse_match/istockphoto-998313770-1024x1024.jpg',
  '/images/nurse_match/istockphoto-998339320-1024x1024.jpg',
  '/images/nurse_match/istockphoto-1209368403-1024x1024.jpg',
  '/images/nurse_match/istockphoto-1387028955-1024x1024.jpg',
  '/images/nurse_match/istockphoto-2187596922-1024x1024.jpg',
]


export default function HeroSection() {
  const [heroImg, setHeroImg] = useState(IMAGES[0])
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <section className="bg-[linear-gradient(135deg,#0d2a3f_0%,#1a3d54_60%,#1e5068_100%)] text-white py-12 px-6 relative overflow-hidden min-h-[50vh] flex flex-col">
      {/* Radial glow */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,107,122,0.3)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto grid grid-cols-2 gap-10 items-end flex-1">
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
          <Link
            href={COHORT.applyUrl}
            className="block bg-[#d4920a] text-[#0d2a3f] font-bold text-[14px] py-[14px] px-6 rounded-lg no-underline uppercase tracking-[0.06em] text-center mb-[14px]"
          >
            Apply for Sponsored Selection →
          </Link>
        </div>

        {/* Right: CTA panel */}
        {/* <div className="relative flex flex-col gap-4 pb-8">
          <div className="bg-white/[0.12] backdrop-blur-[8px] border border-white/20 rounded-[10px] px-[14px] py-3 text-[11px] text-white/90 leading-[1.5]">
            <strong className="text-[#f0a922] block mb-1 text-[12px]">TransCelerate BioPharma Recognized</strong>
            This ICH E6 GCP Investigator Site Training meets the Minimum Criteria for mutual recognition of GCP training among major trial sponsors worldwide.
          </div>

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
        </div> */}
        <div className="relative flex flex-col gap-0 pb-0 justify-end items-end h-full">
          {/* Rounded image container — adjust w/translate to position; h fills remaining column */}
          <div className="relative w-full flex-1 min-h-0 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={heroImg}
              alt="Medical team"
              fill
              className="object-cover object-[70%_20%]"
              priority
            />

            {/* 🖼 Floating image picker — dev only */}
            <button
              onClick={() => setPickerOpen(o => !o)}
              className="absolute top-3 left-3 z-20 bg-black/50 hover:bg-black/70 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition"
            >
              🖼 Change Photo
            </button>
            {pickerOpen && (
              <div className="absolute top-10 left-3 z-30 bg-black/70 backdrop-blur-md rounded-2xl p-3 grid grid-cols-3 gap-2 w-[260px]">
                {IMAGES.map((src) => (
                  <button
                    key={src}
                    onClick={() => { setHeroImg(src); setPickerOpen(false) }}
                    className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition ${heroImg === src ? 'border-[#2dd4bf]' : 'border-transparent hover:border-white/60'}`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Glassmorphism floating card — bottom-right */}
            <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-4 flex gap-5 items-center">
              {/* Seat count — SVG knockout text revealing glass */}
              <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                <defs>
                  <mask id="knockout">
                    <rect width="80" height="80" fill="white" rx="12" />
                    <text x="40" y="46" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="900" fontSize="40" fill="black">30</text>
                    <text x="40" y="60" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="8" letterSpacing="1" fill="black">SPONSORED</text>
                    <text x="40" y="71" textAnchor="middle" fontFamily="system-ui,sans-serif" fontWeight="700" fontSize="8" letterSpacing="1" fill="black">SEATS</text>
                  </mask>
                </defs>
                <rect width="80" height="80" fill="white" mask="url(#knockout)" rx="12" />
              </svg>
              {/* Text */}
              <div className="flex flex-col justify-between self-stretch py-1.5">
                {[
                  'Rolling Admissions',
                  '3-min Application',
                  'Auto-Waitlisted',
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    {/* <span className="shrink-0 w-4 h-4 rounded-full border border-gray-200/70 flex items-center justify-center">
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span> */}
                    <span className="text-white/80 text-[15px] leading-none drop-shadow-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
