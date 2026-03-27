'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  Bell, 
  Database, 
  ArrowRight,
  ShieldCheck,
  Code,
  FileText,
  MousePointer2,
  XCircle,
  Zap,
  HelpCircle,
  Calendar,
  MoreVertical,
  LogOut,
  Terminal,
  Filter,
  Download,
  Plus,
  RefreshCcw,
  LayoutGrid,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileJson,
  FileText as FileCsv,
  ChevronDown,
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

// --- Mock Data ---
const DOMAINS_DATA = [
  { id: 1, domain: 'pharmacy-now.com', category: 'Pharma', paypal: 'Yes', confidence: 98, signals: 12, risk: 'High', lastSeen: '2h ago', amount: '1,204' },
  { id: 2, domain: 'best-peptides.net', category: 'Peptides', paypal: 'Yes', confidence: 85, signals: 8, risk: 'High', lastSeen: '5h ago', amount: '342' },
  { id: 3, domain: 'health-supplements.biz', category: 'Supplements', paypal: 'Weak', confidence: 45, signals: 3, risk: 'Medium', lastSeen: '1d ago', amount: '89' },
  { id: 4, domain: 'global-meds.org', category: 'Pharma', paypal: 'No', confidence: 12, signals: 1, risk: 'Low', lastSeen: '2d ago', amount: '12' },
  { id: 5, domain: 'quick-relief-shop.com', category: 'Pharma', paypal: 'Yes', confidence: 92, signals: 15, risk: 'High', lastSeen: '1h ago', amount: '450' },
];

const FUNNEL_DATA = [
  { name: 'Keywords Input', value: 12000, fill: '#cbd5e1' },
  { name: 'Domains Crawled', value: 6200, fill: '#94a3b8' },
  { name: 'Signals Detected', value: 1200, fill: '#009cde' }, 
  { name: 'High Risk Flagged', value: 450, fill: '#003087' }, 
];

type KeywordItem = { id: number; keyword: string; source: string; status: string; count: number; isNew?: boolean };

const KEYWORDS_DATA: KeywordItem[] = [
  { id: 1, keyword: 'generic viagra free shipping', source: 'User Input', status: 'Active', count: 450 },
  { id: 2, keyword: 'buy peptides paypal', source: 'LLM Generated', status: 'Active', count: 280 },
  { id: 3, keyword: 'no prescription needed', source: 'User Input', status: 'Active', count: 890 },
];

const SUGGESTIONS = [
  { keyword: 'research chemicals with paypal', relevance: 95, category: 'Research' },
  { keyword: 'cheap sildenafil fast delivery', relevance: 88, category: 'Pharma' },
  { keyword: 'bpc-157 peptide source', relevance: 82, category: 'Peptides' },
];

// --- API Helpers ---
const fetchWithRetry = async (url: string, options: RequestInit, retries = 5): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('fetchWithRetry: max retries exceeded');
};

// --- Utilities ---
const parseMarkdown = (text: string): { __html: string } => {
  if (!text) return { __html: '' };
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
  return { __html: html };
};

// --- Components ---

const StatItem = ({ label, value, unit, subValue }: { label: string; value: string; unit?: string; subValue?: string }) => (
  <div className="flex flex-col">
    <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider mb-1">{label}</span>
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</span>
      {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
      {subValue && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 border border-emerald-100/50">
          {subValue}
        </span>
      )}
    </div>
  </div>
);

const RiskSemicircle = ({ totalCount }: { totalCount: string }) => {
  const data = [
    { name: 'Pharma', value: 1205, color: '#003087' }, 
    { name: 'Peptides', value: 340, color: '#0079C1' },  
    { name: 'Supplements', value: 890, color: '#009cde' },  
    { name: 'Others', value: 112, color: '#e2e8f0' },  
  ];

  return (
    <div className="relative w-full h-40 flex items-end justify-center overflow-hidden">
      <div className="absolute inset-0 top-2">
        <ResponsiveContainer width="100%" height="200%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={65}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute bottom-2 flex flex-col items-center">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalCount}</span>
        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">Total Domains</span>
      </div>
    </div>
  );
};

const DetailPanel = ({ domain, onClose }: { domain: typeof DOMAINS_DATA[0] | null; onClose: () => void }) => {
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  React.useEffect(() => {
    setAnalysis("");
  }, [domain]);

  const handleAnalyzeRisk = async () => {
    if (!domain) return;
    setIsAnalyzing(true);
    try {
      const apiKey = "";
      const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const prompt = `As a payment compliance expert, briefly analyze this domain for payment risk:
      Domain: ${domain.domain}
      Category: ${domain.category}
      Confidence Score: ${domain.confidence}%
      Signals detected: ${domain.signals}
      
      Provide a concise, 2-sentence executive summary of the risk and one short recommended action for the compliance team. Make it professional.`;
      
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const res = await fetchWithRetry(MODEL_URL, { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        setAnalysis(data.candidates[0].content.parts[0].text);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAnalysis("Failed to generate analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!domain) return null;
  return (
    <div className="fixed inset-y-4 right-4 w-[400px] bg-white shadow-[0_20px_60px_rgb(0,0,0,0.15)] rounded-[2rem] border border-slate-100 z-40 overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300 p-6 custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Detail Preview</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
          <XCircle className="text-slate-400" size={18} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">{domain.domain}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">{domain.category}</p>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-wider">{domain.risk} Risk</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confidence</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{domain.confidence}%</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signals</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{domain.signals}</p>
            </div>
          </div>
        </section>

        {/* Breakdown */}
        <section>
          <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Zap size={14} className="text-[#009cde]" /> Detection Breakdown
          </h4>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, label: 'Static Signals', color: 'text-emerald-500', desc: 'PayPal SDK v3.2.1 detected' },
              { icon: MousePointer2, label: 'Behavioral Signals', color: 'text-blue-500', desc: 'api.paypal.com calls observed' },
              { icon: FileText, label: 'Semantic Signals', color: 'text-purple-500', desc: '"Checkout with PayPal" phrase found' }
            ].map((sig, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 ${sig.color}`}>
                  <sig.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{sig.label}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{sig.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Risk Analysis */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100/60 shadow-sm relative overflow-hidden">
          <Sparkles className="absolute -top-3 -right-3 text-indigo-500/10 w-24 h-24" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={12} className="text-indigo-600" /> AI Risk Analysis
              </h4>
              {!analysis && (
                <button 
                  onClick={handleAnalyzeRisk}
                  disabled={isAnalyzing}
                  className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {isAnalyzing ? "Analyzing..." : "Analyze Risk"}
                </button>
              )}
            </div>
            {analysis ? (
              <div 
                className="text-xs font-medium text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-indigo-100/50"
                dangerouslySetInnerHTML={parseMarkdown(analysis)}
              />
            ) : (
              !isAnalyzing && (
                <p className="text-[11px] text-indigo-600/70 font-semibold mt-1">
                  Click to generate an AI-powered executive summary and compliance action plan for this domain.
                </p>
              )
            )}
          </div>
        </section>

        {/* Evidence Viewer */}
        <section>
          <div className="bg-[#0f172a] rounded-xl p-5 text-slate-300 font-mono text-xs overflow-hidden shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
              <Code size={14} /> <span>Code Evidence</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-emerald-400">{'<script src="https://www.paypal.com/sdk/js"></script>'}</p>
              <p className="text-indigo-400 mt-3">// Trigger condition met</p>
              <p>{'fetch("https://api.paypal.com/v1/payments")'}</p>
            </div>
          </div>
        </section>

        {/* Product Intelligence */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
          <h4 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <LayoutDashboard size={12} className="text-slate-400" /> Product Intelligence
          </h4>
          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <span className="text-slate-500 font-semibold">Related Product:</span> 
            <span className="text-slate-900 font-bold text-right">Generic Viagra</span>
            
            <span className="text-slate-500 font-semibold">Crawled Price:</span> 
            <span className="text-slate-900 font-bold text-right">$45.00</span>
            
            <span className="text-slate-500 font-semibold">Risk Tags:</span> 
            <span className="text-rose-600 font-bold text-right bg-rose-50 px-2 py-0.5 rounded-md self-end w-max ml-auto text-[10px] uppercase tracking-wide">No Rx</span>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Add Modal Popup ---
const AddModal = ({ isOpen, onClose, onAddKeyword }: { isOpen: boolean; onClose: () => void; onAddKeyword: (keyword: string) => void }) => {
  const [targetType, setTargetType] = useState<'Keyword' | 'Domain'>('Keyword');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClose = () => {
    setInputValue('');
    setStatus('idle');
    onClose();
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || status !== 'idle') return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    onAddKeyword(inputValue.trim());
    setStatus('success');
    await new Promise(r => setTimeout(r, 1000));
    handleClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[400px] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Add Target</h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 animate-in zoom-in-50 duration-300">
              <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">Keyword Added</p>
            <p className="text-xs text-slate-400 font-medium">&ldquo;{inputValue}&rdquo;</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Target Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTargetType('Keyword')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                      targetType === 'Keyword' ? 'bg-[#003087] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >Keyword</button>
                  <button
                    onClick={() => setTargetType('Domain')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                      targetType === 'Domain' ? 'bg-[#003087] text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >Domain</button>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Input Value</label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder={targetType === 'Keyword' ? "e.g. 'buy peptides online'" : "e.g. 'pharmacy-now.com'"}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-900 outline-none focus:border-[#009cde] transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={handleClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || status === 'loading'}
                className="px-5 py-2 text-xs font-bold bg-[#003087] text-white rounded-lg shadow-md hover:bg-[#002050] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors min-w-[80px] justify-center"
              >
                {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : null}
                {status === 'loading' ? 'Adding…' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Export Modal ---
const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last month', days: 30 },
  { label: 'Last 3 months', days: 90 },
];

const ExportModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [format, setFormat] = useState<'json' | 'csv'>('csv');
  const [preset, setPreset] = useState<number | null>(7);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const today = new Date();
  const fromDate = preset
    ? new Date(today.getTime() - preset * 86400000).toISOString().slice(0, 10)
    : '';
  const toDate = today.toISOString().slice(0, 10);

  const handleClose = () => {
    setStatus('idle');
    setFormat('csv');
    setPreset(7);
    onClose();
  };

  const handleExport = async () => {
    if (status !== 'idle') return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1800));
    setStatus('success');
    await new Promise(r => setTimeout(r, 1200));
    handleClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[420px] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Export Data</h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
        </div>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold text-slate-800">Export Ready</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{format.toUpperCase()} · {fromDate} → {toDate}</p>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-3 py-1.5 mt-1">
              <span className="text-[13px] font-black text-slate-800">25</span>
              <span className="text-[11px] font-semibold text-slate-400">domains exported</span>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {/* Time Frame */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">Time Frame</label>
                <div className="flex gap-2 mb-3">
                  {PRESETS.map(p => (
                    <button
                      key={p.days}
                      onClick={() => setPreset(p.days)}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                        preset === p.days
                          ? 'bg-[#003087] text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >{p.label}</button>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={() => setPreset(null)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#009cde] transition-colors appearance-none"
                    />
                  </div>
                  <span className="text-slate-300 font-bold text-sm">→</span>
                  <div className="flex-1 relative">
                    <input
                      type="date"
                      value={toDate}
                      onChange={() => setPreset(null)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-[#009cde] transition-colors appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">Format</label>
                <div className="flex gap-3">
                  {(['csv', 'json'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                        format === f
                          ? 'border-[#003087] bg-[#003087]/5 text-[#003087] shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {f === 'csv' ? <FileCsv size={15} /> : <FileJson size={15} />}
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={handleClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button
                onClick={handleExport}
                disabled={status === 'loading'}
                className="px-5 py-2 text-xs font-bold bg-[#003087] text-white rounded-lg shadow-md hover:bg-[#002050] disabled:opacity-60 flex items-center gap-2 min-w-[100px] justify-center transition-colors"
              >
                {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {status === 'loading' ? 'Exporting…' : 'Export'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Page Content: Overview ---

const OverviewPage = ({ onSelectDomain, onExport }: { onSelectDomain: (domain: typeof DOMAINS_DATA[0]) => void; onExport: () => void }) => {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-end items-center gap-3 w-full">
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter size={14} /> Filters
         </button>
         <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-[#003087] text-white rounded-full text-xs font-bold shadow-md hover:bg-[#002050] transition-colors">
            <Download size={14} /> Export
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Risk by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Risk by Category</h3>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                <Calendar size={12}/> This month
              </button>
              <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
                <MoreVertical size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-2 flex-1">
            <div className="flex-shrink-0 w-48">
              <RiskSemicircle totalCount="2,547" />
            </div>
            <div className="flex-1 space-y-4">
              {[
                { label: 'Pharma', val: '1,205', color: 'bg-[#003087]' },
                { label: 'Peptides', val: '340', color: 'bg-[#0079C1]' },
                { label: 'Supplements', val: '890', color: 'bg-[#009cde]' },
                { label: 'Others', val: '112', color: 'bg-[#e2e8f0]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center group cursor-default w-full">
                  <div className="flex items-center gap-3 w-28">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                  </div>
                  <div className="flex-1 border-b-[2px] border-dotted border-slate-200 mx-2 translate-y-[1px]"></div>
                  <span className="text-xs font-bold text-slate-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Pipeline Funnel (Replaced Trend) */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Detection Funnel</h3>
            <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
              <MoreVertical size={14} />
            </button>
          </div>
          <div className="flex-1 min-h-[180px] w-full mt-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Funnel
                  dataKey="value"
                  data={FUNNEL_DATA}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" fontSize={11} fontWeight="bold" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Domain List */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Flagged Domains</h3>
          <button className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100">
            <MoreVertical size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
                <th className="pb-4 px-4">Domain</th>
                <th className="pb-4 px-4">Category</th>
                <th className="pb-4 px-4">PayPal</th>
                <th className="pb-4 px-4">Confidence Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DOMAINS_DATA.map((item) => (
                <tr 
                  key={item.id} 
                  className="group hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onSelectDomain(item)}
                >
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#003087] transition-colors">{item.domain}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.paypal === 'Yes' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <span className="text-xs font-semibold text-slate-700">{item.paypal}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.confidence > 80 ? 'bg-[#003087]' : 'bg-slate-400'}`}
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Page Content: Keywords ---
const KeywordsPage = ({ keywords }: { keywords: KeywordItem[] }) => {
  const [suggestions, setSuggestions] = useState(SUGGESTIONS);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const apiKey = "";
      const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const prompt = `As a payment risk intelligence system, suggest 3 new, highly specific search keywords used by illicit sellers to sell restricted products (like pharma, peptides, weapons, counterfeit goods) that might illicitly use PayPal.
      Respond strictly as a JSON array of objects. Do not use markdown blocks. Each object must have:
      - keyword (string)
      - relevance (integer between 75 and 99)
      - category (string, e.g., "Pharma", "Weapons", "Counterfeit")`;
      
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                keyword: { type: "STRING" },
                relevance: { type: "INTEGER" },
                category: { type: "STRING" }
              }
            }
          }
        }
      };

      const res = await fetchWithRetry(MODEL_URL, { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const newSuggestions = JSON.parse(data.candidates[0].content.parts[0].text);
        setSuggestions(newSuggestions);
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Active Keywords</h3>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
              <th className="pb-4 px-4">Keyword Input</th>
              <th className="pb-4 px-4">Source</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4 text-right">Yield</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {keywords.map((k) => (
              <tr key={k.id} className={`group transition-colors ${
                k.isNew ? 'bg-emerald-100 hover:bg-emerald-100/80' : 'hover:bg-slate-50'
              }`}>
                <td className="py-4 px-4 font-bold text-xs text-slate-900">{k.keyword}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${k.source === 'User Input' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'}`}>
                    {k.source}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {k.status === 'Deploying' ? (
                    <span className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div> Deploying
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-right font-bold text-xs text-slate-700">{k.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6">
        <div className="bg-[#003087] rounded-2xl p-6 shadow-xl relative overflow-hidden border border-[#0040a0]">
          <Zap className="absolute top-4 right-4 text-white/5" size={100} />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
              <Zap size={14} className="text-[#009cde]" /> Keyword Suggestions
            </h3>
            <p className="text-blue-200 text-[11px] font-medium mb-6">Generated based on recent crawl and yields.</p>
            
            <div className="space-y-3">
              {suggestions.map((s, idx) => (
                <div key={idx} className="bg-white/10 p-3 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-xs text-white leading-tight pr-3">{s.keyword}</span>
                    <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">{s.relevance}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider">{s.category}</span>
                    <button className="text-[10px] font-bold bg-white text-[#003087] px-3 py-1 rounded-full hover:bg-slate-100 transition-colors">APPROVE</button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="w-full mt-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-[11px] uppercase tracking-wider font-bold text-white hover:bg-white/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isGenerating ? "GENERATING..." : "REGENERATE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

export default function PayLensPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedDomain, setSelectedDomain] = useState<typeof DOMAINS_DATA[0] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [keywords, setKeywords] = useState<KeywordItem[]>(KEYWORDS_DATA);

  const handleAddKeyword = (keyword: string) => {
    const newItem: KeywordItem = {
      id: Date.now(),
      keyword,
      source: 'User Input',
      status: 'Deploying',
      count: 0,
      isNew: true,
    };
    setKeywords(prev => [newItem, ...prev]);
    setActiveTab('Keywords');
    setTimeout(() => {
      setKeywords(prev => prev.map(k => k.id === newItem.id ? { ...k, isNew: false } : k));
    }, 3000);
  };

  const navItems = [
    { id: 'Overview', icon: LayoutGrid },
    { id: 'Keywords', icon: Database },
    { id: 'Alerts', icon: Bell },
    { id: 'API', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#020617] via-[#001845] to-[#003087] font-sans p-4 md:p-6 overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      <div className="flex flex-1 bg-[#f8fafc] rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.3)] border border-white/10 relative">
        
        {/* Sidebar */}
        <aside className="w-20 flex flex-col items-center py-10 shrink-0 z-10 border-r border-slate-200/60 bg-white">
          {/* <div className="flex items-center gap-1.5 mb-8 pt-2">
            <span className="text-cyan-400 font-black text-xl leading-none select-none">/</span>
            <div className="leading-none">
              <span className="text-[10px] font-black text-slate-800 tracking-tight block">S-3</span>
              <span className="text-[10px] font-black text-slate-800 tracking-tight block -mt-0.5">Research</span>
            </div>
          </div> */}
          
          <div className="mb-6 w-full flex justify-center">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-blue-50 text-[#003087] hover:bg-[#003087] hover:text-white border border-blue-100 transition-all shadow-sm group"
              title="Add New"
            >
              <Plus size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="w-8 h-px bg-slate-100 mb-6"></div>
          
          <nav className="flex-1 space-y-3 w-full flex flex-col items-center">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-[40px] h-[40px] flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#003087] text-white shadow-md' 
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                  title={item.id}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </button>
              );
            })}
          </nav>

          <button className="w-[40px] h-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 transition-all mt-auto mb-2">
            <LogOut size={18} strokeWidth={2} />
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          
          <header className="px-10 pt-8 pb-6 flex justify-between items-start">
            <div className="pt-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">
                {activeTab === 'Overview' ? 'System Overview' : activeTab}
              </h1>
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
                {activeTab === 'Overview' && 'Real-time PayLens Statistics'}
                {activeTab === 'Keywords' && 'Detection Input Management'}
                {activeTab === 'Alerts' && 'Active Monitoring Center'}
                {activeTab === 'API' && 'Integration & Exports'}
              </p>
              
              <div className="flex items-center gap-2 mt-8 text-slate-400 border-b border-slate-300 pb-2 w-[280px] focus-within:border-[#003087] transition-colors">
                <Search size={16} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search domains, IPs..." 
                  className="bg-transparent outline-none text-xs font-semibold w-full placeholder-slate-400 text-slate-900"
                />
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <Settings size={18} strokeWidth={2} />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <HelpCircle size={18} strokeWidth={2} />
                </button>
                <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden cursor-pointer ml-2 bg-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {activeTab === 'Overview' && (
                <div className="flex gap-10 mt-10 pr-2">
                  <StatItem label="Scanned" value="12K" unit="" subValue="+12%" />
                  <StatItem label="Detected" value="1.2K" unit="" subValue="+5.2%" />
                  <StatItem label="Flagged" value="452" unit="" subValue="Review" />
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar relative z-0">
            {activeTab === 'Overview' && <OverviewPage onSelectDomain={setSelectedDomain} onExport={() => setIsExportModalOpen(true)} />}
            {activeTab === 'Keywords' && <KeywordsPage keywords={keywords} />}
            {activeTab === 'Alerts' && (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                 <Bell className="text-slate-300 mb-5" size={48} strokeWidth={1.5} />
                 <h2 className="text-lg font-bold text-slate-800 mb-2">Monitoring Alerts</h2>
                 <p className="text-slate-500 font-medium text-xs">Real-time alerts for new high-risk detections will appear here.</p>
              </div>
            )}
            {activeTab === 'API' && (
               <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl">
                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2"><Terminal size={16}/> API Access</h2>
                 <div className="bg-[#0f172a] p-5 rounded-xl font-mono text-xs text-slate-300 mb-6 shadow-inner">
                   <span className="text-emerald-400 font-bold">GET</span> /v1/domains/high-risk
                 </div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Authentication Token</label>
                 <div className="flex gap-2">
                   <input readOnly value="pk_live_51M0xWfK9..." className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-xs font-mono font-bold text-slate-700 outline-none" />
                   <button className="px-5 py-2.5 bg-[#003087] text-white rounded-lg text-xs font-bold hover:bg-[#002050] transition-colors">Rotate Key</button>
                 </div>
               </div>
            )}
          </div>
        </main>
      </div>

      <DetailPanel 
        domain={selectedDomain} 
        onClose={() => setSelectedDomain(null)} 
      />
      
      <AddModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAddKeyword={handleAddKeyword}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  );
}