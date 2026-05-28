'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed z-50 w-full px-3 sm:px-6 mt-5 sm:mt-15">
      {/* Nav Bar */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="backdrop-blur-xl border border-white/40 bg-gray-100/30 rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden px-4 sm:px-5 py-3 flex items-center justify-between">
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-2 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />

          {/* Logo — left */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Image
              src="/images/nurse_match/nexct_logo_transparent.png"
              alt="NexCT Logo"
              width={100}
              height={30}
              className="object-contain shrink-0"
              priority
            />
            {/* Text — hidden on mobile */}
            <div className="hidden sm:block">
              <div className="text-[11px] uppercase text-gray-500 mb-0 font-bold leading-tight">
                Research-Ready Nurse™ Program
              </div>
              <div className="text-[11px] text-gray-400">
                by ACHIEVE Clinical and S-3 Research
              </div>
            </div>
          </div>

          {/* Desktop right — social icons + CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a href="https://www.facebook.com/" rel="noopener" aria-label="Visit Facebook" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/" rel="noopener" aria-label="Visit Instagram" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://twitter.com/" rel="noopener" aria-label="Visit Twitter" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.938l4.279 5.658zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <div className="w-px h-4 bg-[#0d2a3f]/15" />
            <Link
              href="mailto:hello@achieveclinical.com"
              className="border-2 border-[#0d2a3f] bg-[#0d2a3f] hover:bg-[#1a4060] hover:border-[#1a4060] text-white text-[12px] font-extrabold px-5 py-[9px] rounded-3xl no-underline uppercase tracking-[0.06em] transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile right — CTA + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="mailto:hello@achieveclinical.com"
              className="border-2 border-[#0d2a3f] bg-[#0d2a3f] text-white text-[11px] font-extrabold px-3 py-[7px] rounded-3xl no-underline uppercase tracking-[0.05em] whitespace-nowrap"
            >
              Contact
            </Link>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className="text-[#0d2a3f] p-1"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden mt-2 backdrop-blur-xl border border-white/40 bg-gray-100/50 rounded-3xl shadow-lg px-5 py-4 flex flex-col gap-4">
            <div className="text-[11px] uppercase text-gray-500 font-bold leading-tight">
              Research-Ready Nurse™ Program
            </div>
            <div className="text-[11px] text-gray-400 -mt-2">
              by ACHIEVE Clinical and S-3 Research
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/" rel="noopener" aria-label="Facebook" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/" rel="noopener" aria-label="Instagram" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com/" rel="noopener" aria-label="Twitter/X" className="text-[#0d2a3f]/50 hover:text-[#0d2a3f] transition">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.938l4.279 5.658zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
