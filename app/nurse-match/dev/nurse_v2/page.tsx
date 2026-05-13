"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Zap, Home, Settings, ChevronDown } from 'lucide-react';

import {
  MOCK_NURSES_V2,
  NursePortalV2,
  MapboxStyles,
} from '../shared_v2';

export default function NursePage() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const nurseUser = MOCK_NURSES_V2[0];

  // ── avatar dropdown ──
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans text-slate-900 select-none overflow-hidden">

      {/* ── Mobile top bar: branding left + avatar dropdown right ── */}
      <div className="md:hidden shrink-0 flex items-center justify-between px-4 pt-3.5 pb-2">
        <Link
          href="/nurse-match"
          className="flex items-center gap-1.5 transition-opacity active:opacity-70"
        >
          <div className="bg-blue-600 p-1 rounded-lg text-white">
            <Zap size={12} fill="currentColor" />
          </div>
          <span className="text-[11px] font-extrabold tracking-tight text-slate-700">
            Nurse<span className="text-blue-600">Match</span>
          </span>
        </Link>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shadow-md active:scale-95 transition-transform ring-2 ring-white"
          >
            SJ
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-[200] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">S. Jenkins, RN</p>
                <p className="text-[10px] text-slate-400">Clinical Ops</p>
              </div>
              <button
                onClick={() => navigateTo('Dashboard')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${currentPage === 'Dashboard' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Home size={14} /> Dashboard
              </button>
              <button
                onClick={() => navigateTo('Coverage')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${currentPage === 'Coverage' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <MapPin size={14} /> Coverage
              </button>
              <button
                onClick={() => navigateTo('Settings')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${currentPage === 'Settings' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Settings size={14} /> Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop-only minimal top bar ── */}
      <header className="hidden md:flex h-12 border-b border-slate-100 px-6 items-center justify-between bg-white shrink-0">
        <Link href="/nurse-match" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Zap size={14} fill="currentColor" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-700">
            Nurse<span className="text-blue-600">Match</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['Dashboard', 'Coverage', 'Settings'] as const).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${currentPage === p ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {p}
              </button>
            ))}
          </nav>
          <Link
            href="/nurse-match/app/admin_v2"
            className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors"
          >
            Admin →
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <button className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] shadow-sm hover:ring-2 hover:ring-blue-200 transition-all">
            SJ
          </button>
        </div>
      </header>

      {/* ── Main content — full bleed ── */}
      <main className="flex-1 relative overflow-hidden">
        <NursePortalV2 user={nurseUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </main>

      <MapboxStyles />
    </div>
  );
}
