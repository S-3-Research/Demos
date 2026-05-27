'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COHORT } from '../../_config'
import ProofBar from './ProofBar'

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
    <section className="min-h-[65vh] px-6 pb-0 relative overflow-hidden flex flex-col"
     style={{ background: 'linear-gradient(180deg, #c8d8e8 0%, #dde8ee 15%, #f3f3f3 35%, #f8f8f8   100%)' }}
     >


      {/* Announcement bar */}
      <div className="w-full max-w-7xl mx-auto pt-5 px-5 mb-1 text-gray-400 text-center font-bold text-[14px] tracking-[0.04em] uppercase">
        <span className="mr-1.5">★</span>
        <span>INAUGURAL COHORT NOW OPEN — 30 SPONSORED SEATS AVAILABLE</span>
      </div>

      {/* Nav Bar */}
      <div className="w-full max-w-7xl mx-auto px-0 pt-5">
        <div
          className="backdrop-blur-xl border border-white/40 bg-gray-100/30 rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden px-5 py-3 flex items-center justify-between"
        >
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-2 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />
          {/* Logo — left */}
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
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
          </div>
          {/* Social icons + Contact CTA — right */}
          <div className="relative flex items-center gap-3">
            {/* Facebook */}
            <a href="https://www.facebook.com/" rel="noopener" aria-label="Visit Facebook" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/" rel="noopener" aria-label="Visit Instagram" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="https://twitter.com/" rel="noopener" aria-label="Visit Twitter" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.938l4.279 5.658zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Divider */}
            <div className="w-px h-4 bg-[#0d2a3f]/15" />
            <Link
              href="mailto:hello@achieveclinical.com"
              className="border-2 border-[#0d2a3f] bg-[#0d2a3f] text-white text-[12px] font-extrabold px-5 py-[9px] rounded-3xl no-underline uppercase tracking-[0.06em]"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>

      {/* Radial glow */}
      {/* <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,107,122,0.3)_0%,transparent_70%)] pointer-events-none" /> */}

      <div className="w-full max-w-7xl mx-auto grid grid-cols-[2fr_3fr] gap-10 items-end py-13 px-6 flex-1 min-h-0">
        {/* Left content */}
        <div className="flex flex-col justify-end h-full">
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
          <h1 className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] mb-4">
            Expand Your<br />
            <span className="text-[#f0a922]">Nursing Career</span>
            <em className="text-[22px] ml-3">with</em>
            <br />Clinical Research.
          </h1>
          <Link
            href={COHORT.applyUrl}
            className="self-start border-2 border-[#f0a922] bg-[#f0a922] text-gray-100 font-extrabold text-[15px] py-[14px] px-6 rounded-3xl no-underline uppercase tracking-[0.06em] text-center mb-3 relative overflow-hidden"
          >
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]" />
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
