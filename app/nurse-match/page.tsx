"use client";

import React, { useState } from 'react';
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

// V2 Architecture Overview
const V2ArchitectureOverview = () => (
  <div className="space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div>
        <SectionTitle 
          icon={Users} 
          title="Nurse Workflow" 
          subtitle="Maintain profile and receive assignments." 
        />
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <FlowStep number={1} title="Receive Invite & Sign Up" details={["Receive invite from admin and sign up"]} />
          <FlowStep number={2} title="Complete Profile" details={["Complete profile, credentials, and capabilities"]} />
          <FlowStep number={3} title="Set Availability" details={["Toggle availability status as needed"]} />
          <FlowStep number={4} title="Keep Info Up to Date" details={["Update location, credentials, or availability when needed"]} />
        </div>
      </div>

      <div>
        <SectionTitle 
          icon={LayoutDashboard} 
          title="Admin Workflow" 
          subtitle="Manage nurses, match, and drive execution." 
        />
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <FlowStep number={1} title="Sync Eligible Nurses" details={["Sync nurse roster from Google Sheet"]} />
          <FlowStep number={2} title="Invite Nurses" details={["Send invites for nurses to join the platform"]} />
          <FlowStep number={3} title="Create Trial" details={["Define trial requirements and site location"]} />
          <FlowStep number={4} title="Run Matching" details={["Manually assign nurses or run AI matching to fill gaps"]} />
          <FlowStep number={5} title="Create Match Records" details={["A match record is created per assigned nurse"]} />
          <FlowStep number={6} title="Advance Match Status" details={["Draft → Contacting → Confirmed / Failed", "Reassign and create new match record if a match fails"]} />
        </div>
      </div>

      <div>
        <SectionTitle 
          icon={Globe} 
          title="Client / Sponsor Workflow" 
          subtitle="View coverage and track execution." 
        />
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <FlowStep number={1} title="View Active Nurse Network" details={["Browse available nurse distribution on the map"]} />
          <FlowStep number={2} title="Check Coverage" details={["Enter a site address to assess nearby nurse coverage"]} />
          <FlowStep number={3} title="View Match History" details={["Review past matching records and outcomes"]} />
        </div>
      </div>
    </div>

    {/* Nurse Data Overview */}
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Database size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nurse Data Overview</h2>
        </div>
        <p className="text-slate-500 font-medium ml-12">How nurse data is structured — and who controls what.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Block 1: Training Source */}
        <div className="rounded-[2rem] border-2 border-green-200 bg-green-50/40 overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-green-100 mb-1">Part 1</p>
            <h3 className="text-white font-bold text-base">Training Source</h3>
            <p className="text-green-100 text-xs mt-0.5">Managed by your team via Google Sheet</p>
          </div>
          <div className="divide-y divide-green-100">
            {[
              { field: "Name / Email", note: "Basic nurse identification" },
              { field: "Training Status", note: "Whether training is completed" },
              { field: "Approval Status", note: "Whether the nurse is approved" },
              { field: "License Info", note: "Credentials (optional)" },
              { field: "Last Updated", note: "Most recent sync timestamp" },
            ].map((row, i) => (
              <div key={i} className="px-6 py-3 flex justify-between items-start gap-4">
                <span className="text-sm font-semibold text-slate-700 shrink-0">{row.field}</span>
                <span className="text-xs text-slate-400 text-right">{row.note}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-green-100/60 flex items-start gap-2">
            <CheckCircle size={14} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-xs text-green-800 font-semibold leading-relaxed">This data is fully managed by your team via Google Sheet. The system only reads it.</p>
          </div>
        </div>

        {/* Block 2: Nurse Profile */}
        <div className="rounded-[2rem] border-2 border-blue-200 bg-blue-50/40 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1">Part 2</p>
            <h3 className="text-white font-bold text-base">Nurse Profile</h3>
            <p className="text-blue-100 text-xs mt-0.5">Maintained by nurses in the system</p>
          </div>
          <div className="divide-y divide-blue-100">
            {[
              { field: "Account Status", note: "Registered / activated" },
              { field: "Address", note: "Location used for matching" },
              { field: "Availability", note: "Currently accepting assignments" },
              { field: "Capability", note: "Types of tasks the nurse can perform" },
            ].map((row, i) => (
              <div key={i} className="px-6 py-3 flex justify-between items-start gap-4">
                <span className="text-sm font-semibold text-slate-700 shrink-0">{row.field}</span>
                <span className="text-xs text-slate-400 text-right">{row.note}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-blue-100/60 flex items-start gap-2">
            <Activity size={14} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-800 font-semibold leading-relaxed">Used by the system to make matching decisions.</p>
          </div>
        </div>

        {/* Block 3: Match Record */}
        <div className="rounded-[2rem] border-2 border-slate-200 bg-slate-50/40 overflow-hidden">
          <div className="bg-slate-800 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Part 3</p>
            <h3 className="text-white font-bold text-base">Match Record</h3>
            <p className="text-slate-300 text-xs mt-0.5">Generated per assignment</p>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { field: "Trial", note: "Which trial this belongs to" },
              { field: "Nurse", note: "The assigned nurse" },
              { field: "Distance / Travel Time", note: "Proximity to site" },
              { field: "Status", note: "Contacting / Confirmed / Failed" },
              { field: "Contact Notes", note: "Manual outreach log" },
            ].map((row, i) => (
              <div key={i} className="px-6 py-3 flex justify-between items-start gap-4">
                <span className="text-sm font-semibold text-slate-700 shrink-0">{row.field}</span>
                <span className="text-xs text-slate-400 text-right">{row.note}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-100/60 flex items-start gap-2">
            <FileText size={14} className="text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">Each assignment is tracked as a record with a full status history.</p>
          </div>
        </div>
      </div>

      {/* Summary callout */}
      <div className="mt-6 bg-slate-900 rounded-[2rem] px-8 py-6 text-white flex items-start gap-4">
        <div className="p-2 bg-blue-500 rounded-xl shrink-0 mt-0.5">
          <Zap size={16} fill="currentColor" />
        </div>
        <p className="text-sm leading-relaxed text-slate-200">
          <span className="text-white font-bold">In short: </span>
          Training and approval are fully managed by your team via Google Sheet — the system only reads that data. Nurses maintain their own profiles for matching. Every assignment is tracked as an individual record with a full status trail.
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

      {/* Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-10 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-6 tracking-widest">
              <Activity size={12} /> Strategic Roadmap
            </div>
            {version === 'v1' ? (
              <>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-none">
                  Engineering Hybrid <br /> 
                  <span className="text-blue-600">Spatial Coordination.</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Clinical Match Pro is a map-first operations platform designed to safely match certified nurses with clinical sites, combining AI recommendations with human oversight and full auditability.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase mb-4 tracking-widest border border-amber-200/60">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span></span>
                  Design In Progress · Temporary
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 leading-none">
                  Rapid Prototype <br /> 
                  <span className="text-blue-600">Nurse Coordination.</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  Experimental matching interface for quick iteration. This view is a work-in-progress scaffold — layout, data, and interactions are subject to change as we refine the workflow.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-10 py-16">
        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
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