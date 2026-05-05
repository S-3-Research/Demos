'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

// Requests go to the Next.js proxy at /api/pay-lens/* which forwards to AWS server-side.
// This avoids CORS — the browser never contacts API Gateway directly.
const API_BASE = '/api/pay-lens'

function apiFetch(url: string, init?: RequestInit) {
  return fetch(url, init)
}

type JobStatus = 'SUBMITTED' | 'PENDING' | 'RUNNABLE' | 'STARTING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'

interface Job {
  jobId: string
  url?: string
  status: JobStatus
  submittedAt?: number
  completedAt?: number
  stoppedAt?: number
  entityCount?: number
  signalCount?: number
  entities?: { name: string; category: string; available: boolean; confidence: string }[]
  gateways?: { name: string; confidence: string; available?: boolean }[]
  wallets?: { name: string }[]
  bnpl?: { name: string }[]
  s3Paths?: Record<string, string>
  // from Batch describe-jobs
  jobName?: string
  createdAt?: number
  startedAt?: number
  // from summary API
  logStreamName?: string
  batchDetail?: { status: string; logStreamName?: string; statusReason?: string } | null
}

type TimeRange = '24h' | '7d' | '30d' | '90d' | 'custom'

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  SUBMITTED: { label: 'Submitted', color: '#8e6000', bg: '#fffbeb', dot: '#f59e0b' },
  PENDING:   { label: 'Pending',   color: '#8e6000', bg: '#fffbeb', dot: '#f59e0b' },
  RUNNABLE:  { label: 'Runnable',  color: '#0071e3', bg: 'rgba(0,113,227,.07)', dot: '#0071e3' },
  STARTING:  { label: 'Starting',  color: '#0071e3', bg: 'rgba(0,113,227,.07)', dot: '#0071e3' },
  RUNNING:   { label: 'Running',   color: '#1d7d45', bg: '#f0faf4', dot: '#22c55e' },
  SUCCEEDED: { label: 'Succeeded', color: '#1d7d45', bg: '#f0faf4', dot: '#1d7d45' },
  FAILED:    { label: 'Failed',    color: '#b52a1c', bg: '#fff5f5', dot: '#ef4444' },
}

function StatusBadge({ status }: { status: JobStatus }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.SUBMITTED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 9px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0,
        animation: (status === 'RUNNING' || status === 'STARTING') ? 'pulse 1.4s infinite' : undefined }} />
      {c.label}
    </span>
  )
}

function StatCard({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14,
      padding: '18px 22px', boxShadow: '0 1px 4px rgba(0,0,0,.06)', minWidth: 110,
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{count}</div>
      <div style={{ fontSize: 12, color: '#86868b', marginTop: 3 }}>{label}</div>
    </div>
  )
}

function fmtTime(ms?: number | string) {
  if (!ms) return '—'
  const t = typeof ms === 'string' ? Number(new Date(ms)) : ms
  if (!t || isNaN(t)) return '—'
  return new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function elapsed(a?: number, b?: number) {
  if (!a || !b) return null
  const s = Math.round((b - a) / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

type Entity = { name: string; category: string; available: boolean; confidence: string }
const CONF_RANK: Record<string, number> = { high: 3, medium: 2, low: 1 }
const CAT_EMOJI: Record<string, string> = { gateway: '🏦', wallet: '💳', bnpl: '⏳', 'card-brand': '🎴', platform: '🛒' }
const CONF_DOT: Record<string, string> = { high: '🟢', medium: '🟡', low: '⚪' }

function EntityPill({ e }: { e: Entity }) {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  const pillClass = !e.available ? 'pill-low' : e.confidence === 'high' ? 'pill-high' : e.confidence === 'medium' ? 'pill-med' : 'pill-low'
  const catEmoji = CAT_EMOJI[e.category] ?? '💰'
  const confDot = CONF_DOT[e.confidence] ?? '⚪'
  return (
    <span
      className={`entity-pill ${pillClass}`}
      style={!e.available ? { opacity: 0.55 } : undefined}
      onMouseEnter={ev => {
        const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
        setTip({ x: Math.max(r.left + r.width / 2, 120), y: r.top })
      }}
      onMouseLeave={() => setTip(null)}
    >
      {tip && (
        <span style={{
          position: 'fixed', left: tip.x, top: tip.y - 8,
          transform: 'translateX(-50%) translateY(-100%)',
          background: '#1d1d1f', color: '#e8e8ed', fontSize: 10.5, lineHeight: 1.6,
          padding: '7px 12px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 9999,
          pointerEvents: 'none', boxShadow: '0 4px 14px rgba(0,0,0,.28)',
          fontFamily: '-apple-system,BlinkMacSystemFont,sans-serif', fontWeight: 400,
        }}>
          {catEmoji} {e.name} · {e.category} · {confDot} {e.confidence} confidence{!e.available ? ' · not available' : ''}
          <span style={{ position: 'absolute', top: '100%', left: tip.x < 140 ? 20 : '50%', transform: tip.x < 140 ? undefined : 'translateX(-50%)', borderWidth: 5, borderStyle: 'solid', borderColor: '#1d1d1f transparent transparent transparent' }} />
        </span>
      )}
      {e.available ? '✅' : '✗'} {e.name}
    </span>
  )
}

function getAllEntities(job: { entities?: Entity[]; gateways?: { name: string; confidence: string; available?: boolean }[]; wallets?: { name: string }[]; bnpl?: { name: string }[] }): Entity[] {
  let all: Entity[] = []
  if (job.entities?.length) {
    all = job.entities.map(e => ({ ...e, available: !!e.available }))
  } else {
    all = [
      ...(job.gateways ?? []).map(g => ({ name: g.name, category: 'gateway', available: !!g.available, confidence: g.confidence ?? 'low' })),
      ...(job.wallets ?? []).map(w => ({ name: w.name, category: 'wallet', available: true, confidence: 'high' })),
      ...(job.bnpl ?? []).map(b => ({ name: b.name, category: 'bnpl', available: true, confidence: 'medium' })),
    ]
  }
  // Dedup by name, keep highest confidence
  const map = new Map<string, Entity>()
  for (const e of all) {
    const existing = map.get(e.name)
    if (!existing || (CONF_RANK[e.confidence] ?? 0) > (CONF_RANK[existing.confidence] ?? 0)) map.set(e.name, e)
  }
  return Array.from(map.values())
}

function toMs(v?: number | string): number | undefined {
  if (!v) return undefined
  if (typeof v === 'string') { const n = Number(new Date(v)); return isNaN(n) ? undefined : n }
  // if unix seconds (10 digits), convert to ms
  return v < 1e12 ? v * 1000 : v
}

function jobDuration(job: { status: string; submittedAt?: number | string; createdAt?: number | string; completedAt?: number | string; stoppedAt?: number | string }): string | null {
  const start = toMs(job.submittedAt) ?? toMs(job.createdAt)
  if (!start) return null
  const inProg = ['SUBMITTED','PENDING','RUNNABLE','STARTING','RUNNING'].includes(job.status)
  const end = inProg ? Date.now() : (toMs(job.completedAt) ?? toMs(job.stoppedAt))
  if (!end) return null
  const s = Math.round((end - start) / 1000)
  if (s < 0) return null
  const str = s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
  return inProg ? `⏱ ${str}` : str
}

function cwLogUrl(logStreamName: string): string {
  const group = '$252Faws$252Fbatch$252Fjob'
  const stream = logStreamName.replace(/\//g, '$252F')
  return `https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logsV2:log-groups/log-group/${group}/log-events/${stream}`
}

export default function PayLensDevPage() {
  const [url, setUrl] = useState('https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [expandedJob, setExpandedJob] = useState<{ jobId: string; mode: 'detail' | 'hostname-history' } | null>(null)
  const [hostnameCache, setHostnameCache] = useState<Record<string, Job[]>>({})
  const [hostnameLoading, setHostnameLoading] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [artifactLoading, setArtifactLoading] = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── fetch summary (single call, replaces 7-parallel fetchJobs) ──────
  const fetchSummary = useCallback(async () => {
    setLoading(true)
    try {
      const now = Date.now()
      const fromMs: Record<Exclude<TimeRange, 'custom'>, number> = {
        '24h': now - 86400000,
        '7d':  now - 7 * 86400000,
        '30d': now - 30 * 86400000,
        '90d': now - 90 * 86400000,
      }
      const qs = new URLSearchParams({ limit: '100', includeBatchDetail: 'true' })
      if (timeRange !== 'custom') {
        qs.set('from', new Date(fromMs[timeRange]).toISOString())
      } else {
        if (customFrom) qs.set('from', customFrom)
        if (customTo)   qs.set('to',   customTo)
      }
      const r = await apiFetch(`${API_BASE}/detections/summary?${qs}`)
      const data = await r.json()
      const raw = data.items ?? data.jobs ?? data
      const list: Job[] = Array.isArray(raw) ? raw : []
      setJobs(list.sort((a, b) => (b.submittedAt ?? b.createdAt ?? 0) - (a.submittedAt ?? a.createdAt ?? 0)))
    } finally {
      setLoading(false)
    }
  }, [timeRange, customFrom, customTo])

  useEffect(() => { fetchSummary() }, [fetchSummary])

  useEffect(() => {
    if (autoRefresh) {
      pollingRef.current = setInterval(fetchSummary, 20000)
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [autoRefresh, fetchSummary])

  // ─── submit ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!url.trim()) return
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const res = await apiFetch(`${API_BASE}/jobs/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      // parse body safely — 202 may have empty or non-JSON body
      let data: Record<string, unknown> = {}
      try { data = await res.json() } catch { /* empty body is fine */ }

      if (res.ok) {
        const jobId = data.jobId ? String(data.jobId) : `(status ${res.status})`
        setSubmitMsg({ type: 'ok', text: `Batch job submitted ✓ — jobId: ${jobId}` })
        setTimeout(fetchSummary, 1500)
      } else {
        const msg = (data.message ?? data.error ?? `HTTP ${res.status}`) as string
        setSubmitMsg({ type: 'err', text: msg })
      }
    } catch (e: unknown) {
      setSubmitMsg({ type: 'err', text: e instanceof Error ? e.message : 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  // ─── toggle detail expand (uses summary data directly) ───────────────
  const toggleDetail = (jobId: string) => {
    setExpandedJob(prev =>
      prev?.jobId === jobId && prev.mode === 'detail' ? null : { jobId, mode: 'detail' }
    )
  }

  // ─── hostname history (lazy-loaded, cached by hostname) ───────────────
  const fetchHostnameHistory = async (jobId: string, jobUrl?: string) => {
    const isActive = expandedJob?.jobId === jobId && expandedJob?.mode === 'hostname-history'
    if (isActive) { setExpandedJob(null); return }
    setExpandedJob({ jobId, mode: 'hostname-history' })
    if (!jobUrl) return
    let hostname: string
    try { hostname = new URL(jobUrl).hostname } catch { return }
    if (hostnameCache[hostname]) return
    setHostnameLoading(hostname)
    try {
      const r = await apiFetch(`${API_BASE}/detections?hostname=${encodeURIComponent(hostname)}`)
      const data = await r.json()
      setHostnameCache(prev => ({ ...prev, [hostname]: data.items ?? data.detections ?? data ?? [] }))
    } finally {
      setHostnameLoading(null)
    }
  }

  // ─── export job as JSON ───────────────────────────────────────────────
  const exportJob = (job: Job) => {
    const blob = new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `detection-${job.jobId.slice(0, 8)}.json`
    a.click()
  }

  // ─── download artifact via presigned URL ─────────────────────────────
  const downloadArtifact = async (s3Uri: string, key: string) => {
    setArtifactLoading(key)
    try {
      const r = await apiFetch(`${API_BASE}/artifacts?s3Uri=${encodeURIComponent(s3Uri)}`)
      const data = await r.json()
      console.log('[artifact]', data)
      const presignedUrl: string = data.url ?? data.presignedUrl ?? data.signedUrl ?? data.downloadUrl ?? ''
      if (!presignedUrl) { console.error('[artifact] no url in response', data); return }
      const fileName = String(s3Uri).split('/').pop() ?? key
      // Fetch as blob to force download (cross-origin <a download> is ignored by browsers)
      try {
        const blob = await fetch(presignedUrl).then(res => res.blob())
        const objectUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
      } catch {
        // CORS fallback: open in new tab — user can save manually
        window.open(presignedUrl, '_blank')
      }
    } catch (e) {
      console.error('artifact download failed', e)
    } finally {
      setArtifactLoading(null)
    }
  }

  // ─── stats ────────────────────────────────────────────────────────────
  const stats = {
    total: jobs.length,
    running: jobs.filter(j => ['RUNNING', 'STARTING', 'RUNNABLE', 'PENDING', 'SUBMITTED'].includes(j.status)).length,
    succeeded: jobs.filter(j => j.status === 'SUCCEEDED').length,
    failed: jobs.filter(j => j.status === 'FAILED').length,
  }

  const filteredJobs = filterText.trim() ? (() => {
    const q = filterText.trim().toLowerCase()
    return jobs.filter(job => {
      if (job.url?.toLowerCase().includes(q)) return true
      try { if (new URL(job.url ?? '').hostname.toLowerCase().includes(q)) return true } catch { /* */ }
      if (getAllEntities(job).some(e => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))) return true
      return false
    })
  })() : jobs

  const css = `
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes spin { to { transform: rotate(360deg); } }
    .jt-page { background:#f5f5f7; min-height:100vh; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","Helvetica Neue",Arial,sans-serif; font-size:14px; color:#1d1d1f; -webkit-font-smoothing:antialiased; }
    .jt-header { background:rgba(255,255,255,.88); backdrop-filter:saturate(180%) blur(20px); border-bottom:1px solid rgba(0,0,0,.08); padding:28px 40px 20px; position:sticky; top:0; z-index:40; }
    .jt-header h1 { font-size:22px; font-weight:700; letter-spacing:-.4px; }
    .jt-header p { color:#86868b; font-size:13px; margin-top:3px; }
    .jt-body { padding:32px 40px 60px; max-width:1300px; }
    .section-label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.7px; color:#86868b; margin-bottom:10px; }
    .card { background:#fff; border:1px solid rgba(0,0,0,.08); border-radius:14px; padding:22px 26px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
    .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:9px; font-size:13px; font-weight:600; cursor:pointer; border:none; transition:opacity .15s,transform .12s; }
    .btn:active { transform:scale(.97); }
    .btn:disabled { opacity:.45; cursor:not-allowed; }
    .btn-primary { background:#0071e3; color:#fff; }
    .btn-primary:hover:not(:disabled) { background:#0077ed; }
    .btn-ghost { background:rgba(0,0,0,.06); color:#1d1d1f; }
    .btn-ghost:hover { background:rgba(0,0,0,.1); }
    .btn-sm { padding:5px 12px; font-size:11.5px; border-radius:7px; }
    .btn-dl { background:rgba(29,125,69,.1); color:#1d7d45; }
    .btn-dl:hover { background:rgba(29,125,69,.18); }
    .btn-detail { background:rgba(0,113,227,.08); color:#0071e3; }
    .btn-detail:hover { background:rgba(0,113,227,.15); }
    .input { width:100%; padding:10px 14px; border:1px solid rgba(0,0,0,.12); border-radius:9px; font-size:13px; font-family:inherit; outline:none; transition:border-color .15s; background:#fff; }
    .input:focus { border-color:#0071e3; box-shadow:0 0 0 3px rgba(0,113,227,.12); }

    table { width:100%; border-collapse:collapse; }
    thead tr { background:#f5f5f7; }
    th { padding:10px 14px; text-align:left; font-size:11px; font-weight:600; color:#86868b; text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid rgba(0,0,0,.08); white-space:nowrap; }
    td { padding:12px 14px; border-bottom:1px solid rgba(0,0,0,.06); font-size:12.5px; vertical-align:middle; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:rgba(0,113,227,.025); }
    .mono { font-family:ui-monospace,"SF Mono",monospace; font-size:11.5px; }
    .expand-row td { padding:0; border-bottom:1px solid rgba(0,0,0,.08); }
    .expand-inner { background:#f9f9fb; padding:18px 22px; font-size:12.5px; }
    .kv-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px 20px; }
    .kv { }
    .kv-label { font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; color:#86868b; margin-bottom:2px; font-weight:600; }
    .kv-val { font-size:12.5px; color:#1d1d1f; font-weight:500; }
    .entity-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:8px; font-size:11px; font-weight:500; margin:2px; position:relative; cursor:default; }
    .pill-high { background:#f0faf4; color:#1d7d45; border:1px solid rgba(29,125,69,.2); }
    .pill-med { background:#fffbeb; color:#8e6000; border:1px solid rgba(142,96,0,.2); }
    .pill-low { background:#f5f5f7; color:#86868b; border:1px solid rgba(0,0,0,.1); }
    .artifact-btn { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:8px; font-size:11px; font-family:ui-monospace,"SF Mono",monospace; background:#f0f0f5; border:1px solid rgba(0,0,0,.1); color:#3a3a3c; cursor:pointer; transition:background .15s,color .15s; }
    .artifact-btn:hover:not(:disabled) { background:#e2e2ef; color:#0071e3; border-color:rgba(0,113,227,.25); }
    .artifact-btn:disabled { opacity:.5; cursor:not-allowed; }
    .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
    .spinner-dark { border-color:rgba(0,0,0,.15); border-top-color:#0071e3; }
    .alert { padding:10px 14px; border-radius:9px; font-size:12.5px; font-weight:500; margin-top:12px; }
    .alert-ok { background:#f0faf4; color:#1d7d45; border:1px solid rgba(29,125,69,.2); }
    .alert-err { background:#fff5f5; color:#b52a1c; border:1px solid rgba(181,42,28,.2); }
    .refresh-btn { background:none; border:1px solid rgba(0,0,0,.12); border-radius:8px; padding:6px 12px; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; color:#3a3a3c; }
    .refresh-btn:hover { background:rgba(0,0,0,.04); }
    .toggle-auto { display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#86868b; cursor:pointer; }
    .toggle-track { width:32px; height:18px; border-radius:99px; background:#ccc; position:relative; transition:background .2s; flex-shrink:0; }
    .toggle-track.on { background:#0071e3; }
    .toggle-thumb { position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#fff; transition:left .2s; box-shadow:0 1px 3px rgba(0,0,0,.2); }
    .toggle-track.on .toggle-thumb { left:16px; }
    .empty-state { text-align:center; padding:48px 0; color:#86868b; font-size:13px; }
    .tab-bar { display:inline-flex; background:rgba(0,0,0,.06); border-radius:9px; padding:3px; gap:2px; }
    .tab { padding:5px 14px; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; border:none; background:transparent; color:#86868b; transition:all .15s; }
    .tab.active { background:#fff; color:#1d1d1f; box-shadow:0 1px 3px rgba(0,0,0,.12); }
    .tab:hover:not(.active) { color:#1d1d1f; }
    .query-result-card { background:#f9f9fb; border:1px solid rgba(0,0,0,.08); border-radius:10px; padding:14px 18px; margin-bottom:8px; }
  `

  return (
    <div className="jt-page">
      <style>{css}</style>

      {/* Header */}
      <div className="jt-header">
        <h1>🔍 Payment Detection — Job Tester</h1>
        <p>Submit, monitor and inspect detection jobs via the AWS API</p>
      </div>

      <div className="jt-body">

        {/* Stat cards */}
        <div className="section-label">Job Summary</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="Total Jobs" count={stats.total} color="#0071e3" bg="rgba(0,113,227,.07)" />
          <StatCard label="In Progress" count={stats.running} color="#8e6000" bg="#fffbeb" />
          <StatCard label="Succeeded" count={stats.succeeded} color="#1d7d45" bg="#f0faf4" />
          <StatCard label="Failed" count={stats.failed} color="#b52a1c" bg="#fff5f5" />
        </div>

        {/* Submit form */}
        <div className="section-label">Submit New Job</div>
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: '#86868b', display: 'block', marginBottom: 5 }}>PRODUCT URL</label>
              <input
                className="input"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/product-page/…"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !url.trim()}>
              {submitting ? <span className="spinner" /> : null}
              {submitting ? 'Submitting…' : 'Submit Job'}
            </button>
          </div>
          {submitMsg && (
            <div className={`alert ${submitMsg.type === 'ok' ? 'alert-ok' : 'alert-err'}`}>
              {submitMsg.type === 'ok' ? '✅' : '❌'} {submitMsg.text}
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 11.5, color: '#86868b' }}>
            Async Batch job via Fargate · cold-start ~60–90s · status updates via EventBridge
          </div>
        </div>

        {/* Jobs table */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>Detection History</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Time range selector */}
            <div className="tab-bar">
              {(['24h', '7d', '30d', '90d', 'custom'] as TimeRange[]).map(t => (
                <button key={t} className={`tab${timeRange === t ? ' active' : ''}`} onClick={() => setTimeRange(t)}>
                  {t === '24h' ? '24h' : t === '7d' ? '7d' : t === '30d' ? '30d' : t === '90d' ? '90d' : 'Custom'}
                </button>
              ))}
            </div>
            {timeRange === 'custom' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="datetime-local" className="input" style={{ width: 176, padding: '5px 9px', fontSize: 11.5 }}
                  value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                <span style={{ fontSize: 11, color: '#86868b' }}>→</span>
                <input type="datetime-local" className="input" style={{ width: 176, padding: '5px 9px', fontSize: 11.5 }}
                  value={customTo} onChange={e => setCustomTo(e.target.value)} />
                <button className="btn btn-ghost btn-sm" onClick={fetchSummary}>Apply</button>
              </div>
            )}
            <label className="toggle-auto" onClick={() => setAutoRefresh(v => !v)}>
              <div className={`toggle-track${autoRefresh ? ' on' : ''}`}>
                <div className="toggle-thumb" />
              </div>
              Auto (20s)
            </label>
            <button className="refresh-btn" onClick={fetchSummary} disabled={loading}>
              {loading ? <span className="spinner spinner-dark" /> : '↻'}
              Refresh
            </button>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 9, fontSize: 12, color: '#86868b', pointerEvents: 'none' }}>🔍</span>
              <input
                className="input"
                style={{ paddingLeft: 28, width: 200, padding: '6px 10px 6px 28px', fontSize: 12 }}
                placeholder="Filter hostname, URL, entity…"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
              {filterText && (
                <button onClick={() => setFilterText('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#86868b', lineHeight: 1, padding: 0 }}>✕</button>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'clip' }}>
          {jobs.length === 0 && !loading ? (
            <div className="empty-state">No jobs found. Submit one above to get started.</div>
          ) : (
            <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Hostname</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Duration</th>
                    <th>Entities</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map(job => {
                    const dur = jobDuration(job)
                    const inProgress = ['SUBMITTED','PENDING','RUNNABLE','STARTING','RUNNING'].includes(job.status)
                    const jobUrl = job.url
                    const isDetailOpen = expandedJob?.jobId === job.jobId && expandedJob?.mode === 'detail'
                    const isHistoryOpen = expandedJob?.jobId === job.jobId && expandedJob?.mode === 'hostname-history'
                    const hostname = jobUrl ? (() => { try { return new URL(jobUrl).hostname } catch { return null } })() : null
                    const historyLoading = hostnameLoading === hostname
                    return (
                      <React.Fragment key={job.jobId}>
                        <tr key={job.jobId}>
                          <td>
                            <span className="mono" style={{ color: '#0071e3' }}>{job.jobId.slice(0, 8)}…</span>
                          </td>
                          <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {hostname
                              ? <button className="btn btn-sm" onClick={() => fetchHostnameHistory(job.jobId, jobUrl)}
                                  style={{ background: isHistoryOpen ? 'rgba(142,96,0,.15)' : 'transparent', color: '#8e6000', border: 'none', padding: '1px 4px', fontFamily: 'monospace', fontSize: 11, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, display: 'block' }}
                                  title={`All scans for ${hostname}`}>
                                  {historyLoading ? <span className="spinner spinner-dark" style={{ borderTopColor: '#8e6000', marginRight: 4 }} /> : null}{hostname}
                                </button>
                              : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {jobUrl ? (
                              <a href={jobUrl} target="_blank" rel="noreferrer" style={{ color: '#1d1d1f', textDecoration: 'none' }}
                                title={jobUrl}>{new URL(jobUrl).pathname.slice(0, 35)}{new URL(jobUrl).pathname.length > 35 ? '…' : ''}</a>
                            ) : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td><StatusBadge status={job.status} /></td>
                          <td className="mono" style={{ whiteSpace: 'nowrap', fontSize: 11 }}>{fmtTime(job.submittedAt ?? job.createdAt)}</td>
                          <td className="mono" style={{ fontSize: 11, color: inProgress ? '#8e6000' : undefined }}>{dur ?? '—'}</td>
                          <td>
                            {job.entityCount != null
                              ? <span style={{ fontWeight: 600, color: '#1d7d45' }}>{job.entityCount}</span>
                              : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                              {/* Detail — uses summary data directly, instant */}
                              <button className="btn btn-sm btn-detail" onClick={() => toggleDetail(job.jobId)}
                                style={{ background: isDetailOpen ? 'rgba(0,113,227,.18)' : undefined }}>
                                {isDetailOpen ? 'Hide' : '▾ Detail'}
                              </button>
                              {/* Export — disabled, ZIP download coming */}
                              <button className="btn btn-sm btn-dl" disabled title="ZIP download coming soon" onClick={() => exportJob(job)}>
                                ↓ Export
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedJob?.jobId === job.jobId && (
                          <tr key={`${job.jobId}-expand`} className="expand-row">
                            <td colSpan={8}>
                              <div className="expand-inner">

                                {/* ── Detail mode — data from summary row, instant ── */}
                                {expandedJob.mode === 'detail' && (
                                  <>
                                    <div className="kv-grid" style={{ marginBottom: 14 }}>
                                      <div className="kv"><div className="kv-label">Full Job ID</div><div className="kv-val mono">{job.jobId}</div></div>
                                      <div className="kv"><div className="kv-label">Status</div><div className="kv-val"><StatusBadge status={job.status} /></div></div>
                                      <div className="kv"><div className="kv-label">Submitted</div><div className="kv-val">{fmtTime(job.submittedAt ?? job.createdAt)}</div></div>
                                      <div className="kv"><div className="kv-label">Completed</div><div className="kv-val">{fmtTime(job.completedAt ?? job.stoppedAt)}</div></div>
                                      <div className="kv"><div className="kv-label">Entities</div><div className="kv-val">{job.entityCount ?? '—'}</div></div>
                                      <div className="kv"><div className="kv-label">Signals</div><div className="kv-val">{job.signalCount ?? '—'}</div></div>
                                      {(job.logStreamName ?? job.batchDetail?.logStreamName) && (
                                        <div className="kv"><div className="kv-label">Log Stream</div><div className="kv-val">
                                          <a href={cwLogUrl(job.logStreamName ?? job.batchDetail!.logStreamName!)} target="_blank" rel="noreferrer"
                                            className="mono" title={job.logStreamName ?? job.batchDetail?.logStreamName}
                                            style={{ fontSize: 10.5, color: '#0071e3', textDecoration: 'none', wordBreak: 'break-all' }}>
                                            {(job.logStreamName ?? job.batchDetail?.logStreamName ?? '').split('/').pop()} ↗
                                          </a>
                                        </div></div>
                                      )}
                                      {job.batchDetail?.statusReason && (
                                        <div className="kv" style={{ gridColumn: '1 / -1' }}><div className="kv-label">Status Reason</div><div className="kv-val" style={{ color: '#b52a1c' }}>{job.batchDetail.statusReason}</div></div>
                                      )}
                                    </div>
                                    {(() => {
                                      const entities = getAllEntities(job)
                                      if (!entities.length) return null
                                      const avail = entities.filter(e => e.available)
                                      const unavail = entities.filter(e => !e.available)
                                      return (
                                        <div style={{ marginBottom: 10 }}>
                                          <div className="kv-label" style={{ marginBottom: 6 }}>
                                            Detected Payment Methods
                                            <span style={{ color: '#86868b', fontWeight: 400, textTransform: 'none', fontSize: 11, marginLeft: 5 }}>({avail.length} available · {unavail.length} detected)</span>
                                          </div>
                                          <div>
                                            {entities.map(e => <EntityPill key={e.name} e={e} />)}
                                          </div>
                                        </div>
                                      )
                                    })()}
                                    {job.s3Paths && Object.keys(job.s3Paths).length > 0 && (
                                      <div>
                                        <div className="kv-label" style={{ marginBottom: 7 }}>Artifacts</div>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                          {Object.entries(job.s3Paths).map(([key, s3Uri]) => {
                                            const fileName = String(s3Uri).split('/').pop() ?? key
                                            const isLoadingThis = artifactLoading === key
                                            return (
                                              <button
                                                key={key}
                                                className="artifact-btn"
                                                disabled={isLoadingThis}
                                                title={String(s3Uri)}
                                                onClick={() => downloadArtifact(String(s3Uri), key)}
                                              >
                                                {isLoadingThis
                                                  ? <span className="spinner spinner-dark" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                                                  : '↓'}
                                                {fileName}
                                              </button>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* ── Hostname history mode ── */}
                                {expandedJob.mode === 'hostname-history' && (() => {
                                  const cachedItems = hostname ? hostnameCache[hostname] : undefined
                                  return (
                                    <>
                                      <div style={{ fontSize: 11.5, color: '#86868b', marginBottom: 10 }}>
                                        🏠 All scans for <strong style={{ color: '#1d1d1f' }}>{hostname ?? '—'}</strong>
                                        {hostname && <span className="mono" style={{ marginLeft: 8 }}>{`GET /detections?hostname=${hostname}`}</span>}
                                      </div>
                                      {historyLoading ? (
                                        <div style={{ color: '#86868b', fontSize: 12 }}>Loading hostname history…</div>
                                      ) : !hostname ? (
                                        <div style={{ color: '#86868b', fontSize: 12 }}>No URL available for this job.</div>
                                      ) : cachedItems ? (
                                        cachedItems.length === 0 ? (
                                          <div style={{ color: '#86868b', fontSize: 12 }}>No records found for {hostname}.</div>
                                        ) : (
                                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                              <tr style={{ background: '#f0f0f5' }}>
                                                <th style={{ padding: '7px 10px', fontSize: 10.5, fontWeight: 600, color: '#86868b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.4px' }}>Job ID</th>
                                                <th style={{ padding: '7px 10px', fontSize: 10.5, fontWeight: 600, color: '#86868b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</th>
                                                <th style={{ padding: '7px 10px', fontSize: 10.5, fontWeight: 600, color: '#86868b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.4px' }}>Entities</th>
                                                <th style={{ padding: '7px 10px', fontSize: 10.5, fontWeight: 600, color: '#86868b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.4px' }}>Completed</th>
                                                <th style={{ padding: '7px 10px', fontSize: 10.5, fontWeight: 600, color: '#86868b', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '.4px' }}>Payment Methods</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {cachedItems.map((rec: Job, i: number) => (
                                                <tr key={rec.jobId ?? i} style={{ borderBottom: '1px solid rgba(0,0,0,.06)' }}>
                                                  <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace,SF Mono,monospace', fontSize: 11, color: '#0071e3' }}>{rec.jobId?.slice(0, 8)}…</td>
                                                  <td style={{ padding: '8px 10px' }}><StatusBadge status={rec.status} /></td>
                                                  <td style={{ padding: '8px 10px', fontWeight: 600, color: '#1d7d45', fontSize: 12 }}>{rec.entityCount ?? '—'}</td>
                                                  <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace,SF Mono,monospace', fontSize: 10.5, color: '#86868b', whiteSpace: 'nowrap' }}>{fmtTime(rec.completedAt ?? rec.submittedAt)}</td>
                                                  <td style={{ padding: '8px 10px', overflow: 'visible' }}>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                      {(() => {
                                                        const ents = getAllEntities(rec)
                                                        if (!ents.length) return <span style={{ color: '#86868b', fontSize: 11.5 }}>—</span>
                                                        return ents.map(e => <EntityPill key={e.name} e={e} />)
                                                      })()}
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        )
                                      ) : (
                                        <div style={{ color: '#86868b', fontSize: 12 }}>Click 🏠 Hostname to load history.</div>
                                      )}
                                    </>
                                  )
                                })()}

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 11.5, color: '#86868b' }}>
          {filterText ? `${filteredJobs.length} of ${jobs.length} jobs` : `${jobs.length} jobs`} · source: <span className="mono">/detections/summary</span> · DDB records expire after 90 days
        </div>


      </div>
    </div>
  )
}
