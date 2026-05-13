"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList, Settings, Bell, Zap,
  Map as MapIcon
} from 'lucide-react';

import {
  MOCK_TRIALS_V2 as MOCK_TRIALS,
  SidebarItemV2,
  AdminMatchWorkspaceV2 as AdminMatchWorkspace,
  AdminTrials,
  AdminSystemConfig,
  MapboxStyles,
} from '../shared_v2';

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState('Workspace');
  const [trials, setTrials] = useState(MOCK_TRIALS);
  const [selectedTrialId, setSelectedTrialId] = useState(MOCK_TRIALS[0].id);
  const [viewMode, setViewMode] = useState('match');
  const [selectedAddrId, setSelectedAddrId] = useState(MOCK_TRIALS[0].addresses[0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const pageContent = () => {
    switch (currentPage) {
      case 'Workspace': return <AdminMatchWorkspace trials={trials} setTrials={setTrials} selectedAddrId={selectedAddrId} setSelectedAddrId={setSelectedAddrId} viewMode={viewMode} setViewMode={setViewMode} selectedTrialId={selectedTrialId} setSelectedTrialId={setSelectedTrialId} />;
      case 'Trials': return <AdminTrials />;
      case 'Config': return <AdminSystemConfig />;
      default: return <AdminMatchWorkspace trials={trials} setTrials={setTrials} selectedAddrId={selectedAddrId} setSelectedAddrId={setSelectedAddrId} viewMode={viewMode} setViewMode={setViewMode} selectedTrialId={selectedTrialId} setSelectedTrialId={setSelectedTrialId} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-slate-900 select-none overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white z-50 shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/nurse-match" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Nurse<span className="text-blue-600">Match</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white transition-all relative">
            <Bell size={18} />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">AD</div>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold text-slate-800">Operator</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`hidden md:flex md:flex-col border-r border-slate-100 bg-white shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'w-[96px]' : 'w-64'}`}
          onMouseEnter={() => setSidebarCollapsed(false)}
          onMouseLeave={() => setSidebarCollapsed(true)}
        >
          <div className={`px-6 flex flex-col border-b border-slate-100/50 pt-3 pb-2 overflow-hidden`}>
            <p className={`text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap mb-0.5 transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Main Navigation</p>
          </div>
          <nav className="flex-1 space-y-3 px-6 py-4">
            <SidebarItemV2 icon={MapIcon} label="Match Workspace" active={currentPage === 'Workspace'} onClick={() => setCurrentPage('Workspace')} collapsed={sidebarCollapsed} />
            <SidebarItemV2 icon={ClipboardList} label="Trials" active={currentPage === 'Trials'} onClick={() => setCurrentPage('Trials')} collapsed={sidebarCollapsed} />
            <SidebarItemV2 icon={Settings} label="System Config" active={currentPage === 'Config'} onClick={() => setCurrentPage('Config')} collapsed={sidebarCollapsed} />
          </nav>
        </aside>
        <main className="flex-1 relative bg-slate-50 overflow-y-auto">{pageContent()}</main>
      </div>

      <MapboxStyles />
    </div>
  );
}
