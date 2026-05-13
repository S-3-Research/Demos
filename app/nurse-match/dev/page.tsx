"use client";

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Users, 
  Map as MapIcon, 
  ShieldCheck, 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  Bell, 
  MousePointer2, 
  Activity,
  History,
  LayoutDashboard,
  Search,
  Layers,
  FileText,
  Globe,
  MessageSquare,
  Send,
  Blocks,
  Gauge
} from 'lucide-react';

// --- Sub-components ---

// Section Header Component
const SectionTitle = ({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-blue-600 rounded-lg text-white">
        <Icon size={20} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{String(title)}</h2>
    </div>
    <p className="text-slate-500 font-medium ml-12">{String(subtitle)}</p>
  </div>
);

// State Card Component
const StateCard = ({ title, description, color }: { title: string; description: string; color: string }) => (
  <div className={`p-4 rounded-2xl border-2 bg-white shadow-sm transition-all hover:shadow-md ${color}`}>
    <h4 className="font-bold text-xs uppercase tracking-widest mb-1">{String(title)}</h4>
    <p className="text-[11px] font-medium leading-relaxed opacity-80">{String(description)}</p>
  </div>
);

// Workflow Step Component
const FlowStep = ({ number, title, details }: { number: number; title: string; details: string[] }) => (
  <div className="flex gap-4 relative">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs z-10 shrink-0 border-4 border-white shadow-sm">
        {String(number)}
      </div>
      <div className="w-0.5 h-full bg-slate-200 absolute top-4"></div>
    </div>
    <div className="pb-10">
      <h4 className="font-bold text-slate-800 text-sm mb-1">{String(title)}</h4>
      <div className="text-xs text-slate-500 space-y-1">
        {details.map((d, i) => <p key={i} className="flex items-start gap-2"><span>•</span> {String(d)}</p>)}
      </div>
    </div>
  </div>
);

// Design Principle Card Component
const PrincipleCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-4">
      <Icon size={24} />
    </div>
    <h4 className="font-bold text-slate-800 mb-2">{String(title)}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{String(description)}</p>
  </div>
);

// Floating Table of Contents
const TableOfContents = ({ activeSection }: { activeSection: string }) => {
  const sections = [
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'schema', label: 'Schema' },
  ];
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-sm px-3 py-3 w-32">
      {sections.map(s => (
        <button key={s.id} onClick={() => scrollTo(s.id)} className="flex items-center justify-between w-full group py-1.5">
          <span className={`text-[9px] font-semibold tracking-wide transition-colors duration-150 ${
            activeSection === s.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}>{s.label}</span>
          <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 ${
            activeSection === s.id
              ? 'bg-blue-600 scale-125'
              : 'bg-slate-300 group-hover:bg-slate-400'
          }`} />
        </button>
      ))}
    </div>
  );
};

// --- Content Sections ---

// Architecture Overview View
const ArchitectureOverview = () => (
  <div className="space-y-12">
    {/* State Machine Visualization */}
    <div>
      <SectionTitle 
        icon={GitBranch} 
        title="Trial Lifecycle & State Machine" 
        subtitle="Visualizing the transition logic from draft to execution." 
      />
      
      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Phase 1: Setup</h5>
            <StateCard title="Draft" description="Initial trial creation. Site data incomplete." color="border-slate-200 text-slate-400" />
            <div className="flex justify-center text-slate-300 py-2"><ArrowRight /></div>
            <StateCard title="Ready" description="Addresses & requirements verified. Matching enabled." color="border-blue-200 text-blue-600" />
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Phase 2: Logic</h5>
            <StateCard title="Matching" description="Active manual/AI assignment workspace in progress." color="border-orange-200 text-orange-600 bg-orange-50/30" />
            <div className="flex justify-center text-slate-300 py-2"><ArrowRight /></div>
            <StateCard title="Confirmed" description="Allocation frozen. Ready for regulatory audit." color="border-green-200 text-green-600 bg-green-50/30" />
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Phase 3: Dispatch</h5>
            <StateCard title="Notified" description="Nurses received official portal/email alerts." color="border-slate-800 text-slate-800 bg-slate-900/5 shadow-inner" />
            <div className="flex justify-center text-slate-300 py-2"><ArrowRight /></div>
            <StateCard title="In Execution" description="On-site visits or home visits are currently active." color="border-blue-500 text-blue-700 bg-blue-50" />
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Phase 4: Archive</h5>
            <StateCard title="Completed" description="Final audit report generated. Sites closed." color="border-slate-100 text-slate-400 grayscale" />
          </div>
        </div>
      </div>
    </div>

    {/* User Flows */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <SectionTitle 
          icon={LayoutDashboard} 
          title="Admin Workflow" 
          subtitle="End-to-end operational path for Clinical Coordinators." 
        />
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <FlowStep number={1} title="Trial Initialization" details={["Define Sponsor & Protocol parameters", "Mark multiple execution sites on map", "Set clinical capability requirements for each site"]} />
          <FlowStep number={2} title="Match Workspace" details={["Filter eligible nurses via spatial queries", "Manually 'Lock' preferred clinical staff", "Utilize AI 'Fill' to resolve remaining coverage gaps"]} />
          <FlowStep number={3} title="Compliance Freeze" details={["Review plan conflicts (distance/availability)", "Freeze plan version for immutable Audit Log", "Single-click notification dispatch"]} />
        </div>
      </div>

      <div>
        <SectionTitle 
          icon={Users} 
          title="Nurse Workflow" 
          subtitle="Credential management and mission execution process." 
        />
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <FlowStep number={1} title="Onboarding & Compliance" details={["Upload RN/LPN certifications", "Set primary base address and service radius", "Define excluded zip code zones"]} />
          <FlowStep number={2} title="Availability Sync" details={["Define weekly operational windows", "Automatic status sync with global matching engine"]} />
          <FlowStep number={3} title="Mission Execution" details={["Receive confirmed trial assignment alerts", "Access Checklist and Map Navigation via portal"]} />
        </div>
      </div>
    </div>
  </div>
);

// V2 Workflow Chart with modal
const workflowSteps = [
  {
    id: 1, phase: 1, phaseColor: 'blue', title: 'Nurse Enrollment',
    badge: 'Status: Enrolled',
    badgeColor: 'bg-blue-100 text-blue-700',
    details: [
      'Nurse visits the landing page',
      'Completes intake form: profile, contact, capabilities',
      'Verifies email address',
      'Receives confirmation: "You will be contacted if selected"',
    ],
  },
  {
    id: 2, phase: 1, phaseColor: 'blue', title: 'Onboarding & Training',
    badge: 'Status: Eligible',
    badgeColor: 'bg-green-100 text-green-700',
    details: [
      'Admin reviews enrolled nurses',
      'Sends training invitation (URL or offline)',
      'Manually updates training + licensure status',
      'Future: auto-sync from platforms like Canvas',
    ],
  },
  {
    id: 3, phase: 1, phaseColor: 'blue', title: 'Database Ready',
    badge: '✓ Pool Ready',
    badgeColor: 'bg-slate-100 text-slate-600',
    details: [
      'Profile + contact info',
      'Capabilities / attributes',
      'Address (for geo-matching)',
      'Availability status',
      'Training & licensure verified',
    ],
  },
  {
    id: 4, phase: 2, phaseColor: 'violet', title: 'Case Management',
    badge: 'Status: Open',
    badgeColor: 'bg-violet-100 text-violet-700',
    details: [
      'Admin creates, searches, edits, or deletes cases',
      'Each case: one address + requirement set',
      'Requirements map directly to nurse intake attributes',
    ],
  },
  {
    id: 5, phase: 2, phaseColor: 'violet', title: 'Nurse Matching',
    badge: 'Status: Initiated',
    badgeColor: 'bg-amber-100 text-amber-700',
    details: [
      'Admin selects a case — system returns eligible nurses sorted by distance',
      'Each result shows nurse profile, attributes, and distance estimate',
      'Admin confirms → Match Record created with status Initiated',
      'Offline outreach tracked via Outcome Notes',
    ],
  },
  {
    id: 6, phase: 2, phaseColor: 'violet', title: 'Outreach Tracking',
    badge: 'Status: Completed',
    badgeColor: 'bg-blue-100 text-blue-700',
    details: [
      'Initiated → Confirmed → Completed / Failed',
      'match_outcome_notes logs every outreach attempt',
      'Examples: "Left voicemail", "Declined due to schedule"',
      'Case auto-closes when any match is marked Completed',
    ],
  },
];

// NodeCard component extracted outside V2WorkflowChart to prevent unnecessary re-renders
const NodeCard = ({ step, isActive, onToggle }: { step: typeof workflowSteps[0]; isActive: boolean; onToggle: () => void }) => {
  const isBlue = step.phaseColor === 'blue';
  return (
    <button
      onClick={onToggle}
      className={`flex-1 min-w-0 text-left rounded-xl border-2 p-4 transition-all duration-150 cursor-pointer ${
        isActive
          ? isBlue
            ? 'border-blue-500 bg-blue-600 shadow-lg shadow-blue-100'
            : 'border-violet-500 bg-violet-600 shadow-lg shadow-violet-100'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] mb-3 ${
        isActive ? 'bg-white/20 text-white' : isBlue ? 'bg-blue-600 text-white' : 'bg-violet-600 text-white'
      }`}>{step.id}</div>
      <p className={`text-xs font-bold leading-tight mb-2 ${isActive ? 'text-white' : 'text-slate-800'}`}>{step.title}</p>
      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
        isActive ? 'bg-white/20 text-white' : step.badgeColor
      }`}>{step.badge}</span>
    </button>
  );
};

const V2WorkflowChart = () => {
  const [selected, setSelected] = React.useState<number | null>(null);
  const selectedStep = workflowSteps.find(s => s.id === selected);
  const phase1 = workflowSteps.filter(s => s.phase === 1);
  const phase2 = workflowSteps.filter(s => s.phase === 2);

  return (
    <div>
      {/* Phase 1 row */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">Phase 1 — Nurse Pool</span>
          <div className="h-px flex-1 bg-blue-200"></div>
        </div>
        <div className="flex items-stretch gap-2">
          {phase1.map((step, i) => (
            <React.Fragment key={step.id}>
              <NodeCard 
                step={step} 
                isActive={selected === step.id}
                onToggle={() => setSelected(selected === step.id ? null : step.id)}
              />
              {i < phase1.length - 1 && (
                <div className="flex items-center shrink-0 text-slate-300"><ArrowRight size={16} /></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Connector between phases */}
      <div className="flex justify-center py-1">
        <div className="w-px h-5 bg-slate-200"></div>
      </div>

      {/* Phase 2 row */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-violet-500 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">Phase 2 — Matching</span>
          <div className="h-px flex-1 bg-violet-200"></div>
        </div>
        <div className="flex items-stretch gap-2">
          {phase2.map((step, i) => (
            <React.Fragment key={step.id}>
              <NodeCard 
                step={step} 
                isActive={selected === step.id}
                onToggle={() => setSelected(selected === step.id ? null : step.id)}
              />
              {i < phase2.length - 1 && (
                <div className="flex items-center shrink-0 text-slate-300"><ArrowRight size={16} /></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Modal overlay */}
      {selectedStep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${
                  selectedStep.phaseColor === 'blue' ? 'bg-blue-600' : 'bg-violet-600'
                }`}>{selectedStep.id}</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{selectedStep.title}</h4>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${selectedStep.badgeColor}`}>{selectedStep.badge}</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-base leading-none font-light shrink-0"
              >×</button>
            </div>
            {/* Details */}
            <div className="space-y-2.5">
              {selectedStep.details.map((d, i) => (
                <p key={i} className="text-sm text-slate-500 flex items-start gap-2.5">
                  <span className={`mt-0.5 shrink-0 font-bold text-xs ${
                    selectedStep.phaseColor === 'blue' ? 'text-blue-400' : 'text-violet-400'
                  }`}>→</span>
                  {d}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {!selectedStep && (
        <p className="text-center text-[10px] text-slate-400 mt-3">Click any step to see details</p>
      )}
    </div>
  );
};

// V2 Architecture Overview
const V2ArchitectureOverview = () => (
  <div className="space-y-5">

    {/* ── Development Roadmap ── */}
    <div id="roadmap" className="bg-blue-50 rounded-2xl px-8 py-8 border border-blue-200 scroll-mt-24">
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white"><GitBranch size={20} /></div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Development Roadmap</h2>
        </div>
        <p className="text-slate-500 font-medium ml-12">Two phases from nurse enrollment to case matching.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase 1 */}
        <div className="rounded-[2rem] border-2 border-blue-200 overflow-hidden flex flex-col">
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Phase 1</p>
              <h3 className="text-white font-bold text-base">Nurse Pool &amp; Database</h3>
            </div>
          </div>
          <div className="bg-blue-50/30 divide-y divide-blue-100 flex-1">
            {[
              { step: "1", label: "Nurse Enrollment & Intake", desc: "Nurse fills intake form → added to pool as Enrolled" },
              { step: "2", label: "Admin Onboarding & Training", desc: "Admin sends training invite → manually marks Eligible" },
              { step: "3", label: "Nurse Database Ready", desc: "Eligible nurses are available with full profiles for matching" },
            ].map((r) => (
              <div key={r.step} className="px-6 py-4 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{r.step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-blue-100/50">
            <p className="text-[11px] font-semibold text-blue-700">✅ Deliverable: verified nurse database ready for matching</p>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="rounded-[2rem] border-2 border-violet-200 overflow-hidden flex flex-col">
          <div className="bg-violet-600 px-6 py-5 flex items-center gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-violet-100">Phase 2</p>
              <h3 className="text-white font-bold text-base">Case Management &amp; Matching</h3>
            </div>
          </div>
          <div className="bg-violet-50/30 divide-y divide-violet-100 flex-1">
            {[
              { step: "4", label: "Case Management", desc: "Admin creates cases with address + requirement attributes" },
              { step: "5", label: "Nurse Matching Workflow", desc: "System returns eligible nurses sorted by distance → admin confirms → Match Record created → offline outreach tracked" },
            ].map((r) => (
              <div key={r.step} className="px-6 py-4 flex gap-4">
                <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{r.step}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{r.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-violet-100/50">
            <p className="text-[11px] font-semibold text-violet-700">✅ Deliverable: end-to-end match tracking with outreach log</p>
          </div>
        </div>
      </div>
    </div>

    {/* ── Product Workflow ── */}
    <div id="workflow" className="bg-slate-50 rounded-2xl px-8 py-8 border border-slate-200 scroll-mt-24">
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white"><Layers size={20} /></div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Product Workflow</h2>
        </div>
        <p className="text-slate-500 font-medium ml-12">Step-by-step operational flow from enrollment to case closure.</p>
      </div>

      <V2WorkflowChart />
    </div>

    {/* ── Data Schema ── */}
    <div id="schema" className="bg-slate-900 rounded-2xl px-8 py-8 border border-slate-700 scroll-mt-24">
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg text-white"><Database size={20} /></div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Data Schema Overview</h2>
        </div>
        <p className="text-slate-400 font-medium ml-12">How nurse data is structured — and who controls what.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Nurse */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="bg-blue-600 px-5 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-0.5">Entity 1</p>
            <h3 className="text-white font-bold text-sm">Nurse</h3>
            <p className="text-blue-200 text-[10px] mt-0.5">Maintained by nurses; read by the system</p>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { field: "Name / Email", note: "Identity & login" },
              { field: "Address", note: "Used for geo-matching" },
              { field: "Availability", note: "Accepting assignments?" },
              { field: "Capabilities / Attributes", note: "Skills mapped to case requirements" },
              { field: "Training Status", note: "Enrolled → Eligible" },
              { field: "License Info", note: "Verified credentials (optional)" },
              { field: "Account Status", note: "Registered / active" },
            ].map((row, i) => (
              <div key={i} className="px-5 py-2.5 flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-slate-200 shrink-0">{row.field}</span>
                <span className="text-[10px] text-slate-500 text-right">{row.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Case */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
          <div className="bg-violet-600 px-5 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-violet-200 mb-0.5">Entity 2</p>
            <h3 className="text-white font-bold text-sm">Case</h3>
            <p className="text-violet-200 text-[10px] mt-0.5">Created and managed by admin</p>
          </div>
          <div className="divide-y divide-white/10 flex-1">
            {[
              { field: "Address", note: "Site location for matching" },
              { field: "Requirement Set", note: "Attributes aligned with nurse intake" },
              { field: "Status", note: "Open / Closed" },
              { field: "Created At", note: "Timestamp" },
            ].map((row, i) => (
              <div key={i} className="px-5 py-2.5 flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-slate-200 shrink-0">{row.field}</span>
                <span className="text-[10px] text-slate-500 text-right">{row.note}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-violet-900/30 flex items-start gap-2 border-t border-white/10">
            <Activity size={12} className="text-violet-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-violet-300 font-medium leading-relaxed">Auto-closes when any linked match is marked Completed.</p>
          </div>
        </div>

        {/* Match Record */}
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="bg-slate-700 px-5 py-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Entity 3</p>
            <h3 className="text-white font-bold text-sm">Match Record</h3>
            <p className="text-slate-300 text-[10px] mt-0.5">Created per confirmed match</p>
          </div>
          <div className="divide-y divide-white/10">
            {[
              { field: "Case", note: "Linked case" },
              { field: "Nurse", note: "Matched nurse" },
              { field: "Distance / Travel Time", note: "Proximity at time of match" },
              { field: "Status", note: "Initiated / Confirmed / Completed / Failed" },
              { field: "Outcome Notes", note: "Outreach log (calls, voicemails, etc.)" },
              { field: "Timestamps", note: "Created, updated, completed" },
            ].map((row, i) => (
              <div key={i} className="px-5 py-2.5 flex justify-between items-start gap-4">
                <span className="text-xs font-semibold text-slate-200 shrink-0">{row.field}</span>
                <span className="text-[10px] text-slate-500 text-right">{row.note}</span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-white/5 flex items-start gap-2 border-t border-white/10">
            <FileText size={12} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Tracks both the match decision and the real-world outreach process.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-5 bg-white/5 rounded-xl px-6 py-4 border border-white/10 flex items-start gap-3">
        <div className="p-1.5 bg-blue-500 rounded-lg shrink-0 mt-0.5"><Zap size={14} fill="currentColor" className="text-white" /></div>
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="text-white font-bold">The goal: </span>
          Not just to find matching nurses — but to help teams track the real-world outreach and execution process.
        </p>
      </div>
    </div>

  </div>
);

// V2 Design Principles
const V2DesignPrinciples = () => (
  <div className="space-y-12">
    <SectionTitle 
      icon={ShieldCheck} 
      title="Core Design Principles" 
      subtitle="Guiding philosophy for the text-driven matching system." 
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PrincipleCard 
        icon={Gauge} 
        title="Simplicity First" 
        description="Keep workflows lightweight and frictionless, especially for time-constrained healthcare professionals."
      />
      <PrincipleCard 
        icon={Blocks} 
        title="Modular & Integratable" 
        description="Build components that can plug into external systems (scheduling, training, CRM) without tight coupling."
      />
      <PrincipleCard 
        icon={Lock} 
        title="Security by Design" 
        description="Incorporate privacy, access control, and compliance considerations from the outset — not as an afterthought."
      />
      <PrincipleCard 
        icon={Zap} 
        title="Scalable Automation" 
        description="Automate matching and notifications to handle increasing volume without proportional manual effort."
      />
    </div>
  </div>
);

// Design Principles View
const DesignPrinciples = () => (
  <div className="space-y-12">
    <SectionTitle 
      icon={ShieldCheck} 
      title="Core Competitive Moat" 
      subtitle="Fundamental design principles ensuring regulatory safety and efficiency." 
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PrincipleCard 
        icon={Lock} 
        title="Confirm ≠ Notify" 
        description="Frozen matching plans are physically isolated from notification triggers. This prevents accidental contact before final audit."
      />
      <PrincipleCard 
        icon={Zap} 
        title="Hybrid Intelligence" 
        description="AI acts as a recommendation tool, not a decision-maker. Humans 'Lock' critical paths; AI fills gaps based on spatial optimization."
      />
      <PrincipleCard 
        icon={MapIcon} 
        title="Map-First Interface" 
        description="Geography is not just an attribute; it is the primary interface. Proximity, overlap, and density are first-class citizens."
      />
      <PrincipleCard 
        icon={History} 
        title="End-to-End Auditability" 
        description="Every assignment, manual override, and notification batch generates a snapshot. Fully compliant with FDA/HIPAA requirements."
      />
    </div>

    {/* Data Architecture Preview */}
    <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
      <Globe className="absolute -right-10 -bottom-10 text-white/5" size={240} />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Layers className="text-blue-500" /> Core Data Architecture
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-white/40 font-bold uppercase tracking-widest border-b border-white/10">
              <tr>
                <th className="pb-4">Entity</th>
                <th className="pb-4">Key Attributes</th>
                <th className="pb-4">System Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: "Trial", attr: "address_array, requirements, status", logic: "Multi-point entity containing sites and patient homes." },
                { name: "Nurse", attr: "lat/lng, coverage_radius, excluded_zips", logic: "Spatial profile used for proximity-based matching." },
                { name: "Assignment", attr: "trial_id, nurse_id, is_locked", logic: "Atomic unit supporting manual overrides and AI flags." },
                { name: "AuditLog", attr: "timestamp, operator, snapshot_id", logic: "Immutable record of all state transitions." },
              ].map((row, i) => (
                <tr key={i} className="group">
                  <td className="py-4 font-bold text-blue-400">{String(row.name)}</td>
                  <td className="py-4 font-mono opacity-70">{String(row.attr)}</td>
                  <td className="py-4 opacity-70">{String(row.logic)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [version, setVersion] = useState('v2');
  const [activeTab, setActiveTab] = useState('architecture');
  const [activeSection, setActiveSection] = useState('roadmap');

  useEffect(() => {
    // Only set up intersection observers if v2 and architecture tab are active
    if (version !== 'v2' || activeTab !== 'architecture') {
      return;
    }

    const ids = ['roadmap', 'workflow', 'schema'];
    const observers: (IntersectionObserver | null)[] = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach(o => {
        if (o) o.disconnect();
      });
    };
  }, [version, activeTab]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 select-none">
      <header className="h-16 border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Zap size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Nurse<span className="text-blue-600">Match</span>
            </h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['v1', 'v2'].map((ver) => (
              <button 
                key={ver}
                onClick={() => setVersion(ver)}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all uppercase ${
                  version === ver 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {ver}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={version === 'v1' ? '/nurse-match/app/admin' : '/nurse-match/app/admin_v2'}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg shadow-blue-100/50 hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            ADMIN DEMO <span className="text-[9px] opacity-70 font-medium">{version}</span>
            <ArrowRight size={14} />
          </a>
          <a 
            href={version === 'v1' ? '/nurse-match/app/nurse' : '/nurse-match/app/nurse_v2'}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase shadow-lg shadow-slate-200/50 hover:bg-slate-900 transition-colors flex items-center gap-2"
          >
            NURSE DEMO <span className="text-[9px] opacity-70 font-medium">{version}</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <nav className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['architecture', 'principles'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all uppercase ${
                  activeTab === tab 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Floating TOC — v2 architecture only */}
        {version === 'v2' && activeTab === 'architecture' && (
          <TableOfContents activeSection={activeSection} />
        )}

        {/* Content based on version and tab */}
        {version === 'v1' ? (
          activeTab === 'architecture' ? <ArchitectureOverview /> : <DesignPrinciples />
        ) : (
          activeTab === 'architecture' ? <V2ArchitectureOverview /> : <V2DesignPrinciples />
        )}
      </main>

      {/* Footer Area */}
      <footer className="border-t border-slate-100 py-12 px-10 mt-12 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 opacity-40 grayscale">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white font-black text-xs">CMP</div>
            <p className="text-xs font-bold tracking-tight">Internal Dev Resource · Confidential</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Tech Docs</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">API Keys</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Audit Export</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}