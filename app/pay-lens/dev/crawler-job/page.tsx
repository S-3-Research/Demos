'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = '/api/site-crawler'

function apiFetch(url: string, init?: RequestInit) {
  return fetch(url, init)
}

type JobStatus = 'SUBMITTED' | 'PENDING' | 'RUNNABLE' | 'STARTING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'

interface CrawlJob {
  jobId: string
  hostname?: string
  url?: string
  status: JobStatus
  configKey?: string
  submittedAt?: number
  completedAt?: number
  stoppedAt?: number
  createdAt?: number
  startedAt?: number
  logStreamName?: string
  exitCode?: number | null
  statusReason?: string | null
  stoppedReason?: string | null
  errorSummary?: string | null
  visitedCount?: number
  discoveredCount?: number
  batchDetail?: { status: string; logStreamName?: string; statusReason?: string } | null
  s3Paths?: {
    result_json?: string
    result_excel?: string
    crawl_log?: string
    [key: string]: string | undefined
  }
  jobName?: string
}

interface ConfigItem {
  key: string
  name: string
  size?: number
  lastModified?: string
}

type TimeRange = '24h' | '7d' | '30d' | '90d' | 'custom'

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  SUBMITTED: { label: 'Submitted', color: '#8e6000', bg: '#fffbeb',              dot: '#f59e0b' },
  PENDING:   { label: 'Pending',   color: '#8e6000', bg: '#fffbeb',              dot: '#f59e0b' },
  RUNNABLE:  { label: 'Runnable',  color: '#0071e3', bg: 'rgba(0,113,227,.07)', dot: '#0071e3' },
  STARTING:  { label: 'Starting',  color: '#0071e3', bg: 'rgba(0,113,227,.07)', dot: '#0071e3' },
  RUNNING:   { label: 'Running',   color: '#1d7d45', bg: '#f0faf4',             dot: '#22c55e' },
  SUCCEEDED: { label: 'Succeeded', color: '#1d7d45', bg: '#f0faf4',             dot: '#1d7d45' },
  FAILED:    { label: 'Failed',    color: '#b52a1c', bg: '#fff5f5',             dot: '#ef4444' },
}

function StatusBadge({ status }: { status: JobStatus }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.SUBMITTED
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0,
        animation: (status === 'RUNNING' || status === 'STARTING') ? 'pulse 1.4s infinite' : undefined,
      }} />
      {c.label}
    </span>
  )
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
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

function fmtTime(ms?: number | string | null) {
  if (!ms) return '—'
  const t = typeof ms === 'string' ? Number(new Date(ms)) : ms
  if (!t || isNaN(t)) return '—'
  return new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function toMs(v?: number | string | null): number | undefined {
  if (!v) return undefined
  if (typeof v === 'string') { const n = Number(new Date(v)); return isNaN(n) ? undefined : n }
  return v < 1e12 ? v * 1000 : v
}

function jobDuration(job: CrawlJob): string | null {
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

function configShortName(key?: string) {
  if (!key) return '—'
  return key.split('/').pop()?.replace(/\.yaml$/, '') ?? key
}

const css = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .sc-page { background:#f5f5f7; min-height:100vh; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter","Helvetica Neue",Arial,sans-serif; font-size:14px; color:#1d1d1f; -webkit-font-smoothing:antialiased; }
  .sc-header { background:rgba(255,255,255,.88); backdrop-filter:saturate(180%) blur(20px); border-bottom:1px solid rgba(0,0,0,.08); padding:28px 40px 20px; position:sticky; top:0; z-index:40; }
  .sc-header h1 { font-size:22px; font-weight:700; letter-spacing:-.4px; }
  .sc-header p { color:#86868b; font-size:13px; margin-top:3px; }
  .sc-body { padding:32px 40px 60px; max-width:1340px; }
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
  .btn-detail { background:rgba(0,113,227,.08); color:#0071e3; }
  .btn-detail:hover { background:rgba(0,113,227,.15); }
  .input { width:100%; padding:10px 14px; border:1px solid rgba(0,0,0,.12); border-radius:9px; font-size:13px; font-family:inherit; outline:none; transition:border-color .15s; background:#fff; }
  .input:focus { border-color:#0071e3; box-shadow:0 0 0 3px rgba(0,113,227,.12); }
  .select { padding:8px 12px; border:1px solid rgba(0,0,0,.12); border-radius:9px; font-size:12.5px; font-family:inherit; outline:none; background:#fff; color:#1d1d1f; cursor:pointer; }
  .select:focus { border-color:#0071e3; }
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
  .kv-label { font-size:10.5px; text-transform:uppercase; letter-spacing:.5px; color:#86868b; margin-bottom:2px; font-weight:600; }
  .kv-val { font-size:12.5px; color:#1d1d1f; font-weight:500; }
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
  .config-tag { display:inline-flex; align-items:center; padding:2px 8px; border-radius:6px; font-size:10.5px; font-weight:600; font-family:ui-monospace,"SF Mono",monospace; background:rgba(0,113,227,.08); color:#0071e3; border:1px solid rgba(0,113,227,.15); white-space:nowrap; max-width:180px; overflow:hidden; text-overflow:ellipsis; }
`

export default function CrawlerJobPage() {
  const [submitUrl, setSubmitUrl] = useState('https://primepeptides.co/')
  const [configKey, setConfigKey] = useState('')
  const [maxPages, setMaxPages] = useState('50')
  const [maxDepth, setMaxDepth] = useState('')
  const [configs, setConfigs] = useState<ConfigItem[]>([])
  const [configsLoading, setConfigsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [jobs, setJobs] = useState<CrawlJob[]>([])
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [filterText, setFilterText] = useState('')
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [artifactLoading, setArtifactLoading] = useState<string | null>(null)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setConfigsLoading(true)
    apiFetch(`${API_BASE}/configs`)
      .then(r => r.json())
      .then(data => {
        const list: ConfigItem[] = data.configs ?? []
        setConfigs(list)
        if (list.length > 0) setConfigKey(list[0].key)
      })
      .catch(() => {})
      .finally(() => setConfigsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        qs.set('from', new Date(fromMs[timeRange]).toISOString().slice(0, 10))
      } else {
        if (customFrom) qs.set('from', customFrom)
        if (customTo)   qs.set('to',   customTo)
      }
      const r = await apiFetch(`${API_BASE}/results/summary?${qs}`)
      const data = await r.json()
      const raw: CrawlJob[] = data.jobs ?? data.items ?? (Array.isArray(data) ? data : [])
      setJobs(raw.sort((a, b) => (b.submittedAt ?? b.createdAt ?? 0) - (a.submittedAt ?? a.createdAt ?? 0)))
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

  const handleSubmit = async () => {
    if (!submitUrl.trim() || !configKey) return
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      const body: Record<string, unknown> = { url: submitUrl.trim(), configKey }
      const opts: Record<string, number> = {}
      if (maxPages.trim()) opts.maxPages = Number(maxPages)
      if (maxDepth.trim()) opts.maxDepth = Number(maxDepth)
      if (Object.keys(opts).length) body.options = opts
      const res = await apiFetch(`${API_BASE}/jobs/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      let data: Record<string, unknown> = {}
      try { data = await res.json() } catch { /* empty body */ }
      if (res.ok) {
        const jobId = data.jobId ? String(data.jobId) : `(status ${res.status})`
        setSubmitMsg({ type: 'ok', text: `Crawl job submitted ✓ — jobId: ${jobId}` })
        setTimeout(fetchSummary, 1500)
      } else {
        setSubmitMsg({ type: 'err', text: String(data.error ?? data.message ?? `HTTP ${res.status}`) })
      }
    } catch (e) {
      setSubmitMsg({ type: 'err', text: e instanceof Error ? e.message : 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  const downloadArtifact = async (presignedUrl: string, labelKey: string) => {
    setArtifactLoading(labelKey)
    try {
      // s3Paths now contains presigned URLs directly (valid 15 min)
      const fileName = presignedUrl.split('/').pop()?.split('?')[0] ?? labelKey
      try {
        const blob = await fetch(presignedUrl).then(res => res.blob())
        const objUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objUrl; a.download = fileName; a.style.display = 'none'
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(objUrl), 10000)
      } catch {
        window.open(presignedUrl, '_blank')
      }
    } catch (e) {
      console.error('artifact download failed', e)
    } finally {
      setArtifactLoading(null)
    }
  }

  const stats = {
    total: jobs.length,
    running: jobs.filter(j => ['RUNNING','STARTING','RUNNABLE','PENDING','SUBMITTED'].includes(j.status)).length,
    succeeded: jobs.filter(j => j.status === 'SUCCEEDED').length,
    failed: jobs.filter(j => j.status === 'FAILED').length,
  }

  const filteredJobs = filterText.trim()
    ? (() => {
        const q = filterText.toLowerCase()
        return jobs.filter(j =>
          j.url?.toLowerCase().includes(q) ||
          j.hostname?.toLowerCase().includes(q) ||
          j.configKey?.toLowerCase().includes(q) ||
          j.jobId?.toLowerCase().includes(q)
        )
      })()
    : jobs

  return (
    <div className="sc-page">
      <style>{css}</style>

      <div className="sc-header">
        <h1>🕷️ Site Crawler — Job Manager</h1>
        <p>Submit and monitor web crawl jobs via the SiteCrawler AWS API</p>
      </div>

      <div className="sc-body">

        <div className="section-label">Overview</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="Total Jobs"  count={stats.total}     color="#0071e3" />
          <StatCard label="In Progress" count={stats.running}   color="#f59e0b" />
          <StatCard label="Succeeded"   count={stats.succeeded} color="#1d7d45" />
          <StatCard label="Failed"      count={stats.failed}    color="#b52a1c" />
        </div>

        <div className="section-label">Submit New Crawl Job</div>
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#86868b', display: 'block', marginBottom: 5 }}>TARGET URL</label>
              <input className="input" value={submitUrl} onChange={e => setSubmitUrl(e.target.value)}
                placeholder="https://example.com/" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div style={{ flex: 1.5, minWidth: 200 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#86868b', display: 'block', marginBottom: 5 }}>CONFIG</label>
              {configsLoading ? (
                <div style={{ fontSize: 12, color: '#86868b', padding: '10px 0' }}>
                  <span className="spinner spinner-dark" style={{ marginRight: 6 }} />Loading configs…
                </div>
              ) : configs.length > 0 ? (
                <select className="select" style={{ width: '100%' }} value={configKey} onChange={e => setConfigKey(e.target.value)}>
                  {configs.map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
                </select>
              ) : (
                <input className="input" value={configKey} onChange={e => setConfigKey(e.target.value)}
                  placeholder="configs/run_prebuild_config_1.yaml" />
              )}
            </div>
            <div style={{ width: 90 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#86868b', display: 'block', marginBottom: 5 }}>MAX PAGES</label>
              <input className="input" style={{ padding: '10px 10px' }} type="number" min={1}
                value={maxPages} onChange={e => setMaxPages(e.target.value)} placeholder="50" />
            </div>
            <div style={{ width: 90 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#86868b', display: 'block', marginBottom: 5 }}>MAX DEPTH</label>
              <input className="input" style={{ padding: '10px 10px' }} type="number" min={1}
                value={maxDepth} onChange={e => setMaxDepth(e.target.value)} placeholder="5" />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !submitUrl.trim() || !configKey}>
              {submitting ? <span className="spinner" /> : '🕷️'}
              {submitting ? 'Submitting…' : 'Submit Crawl'}
            </button>
          </div>
          {submitMsg && (
            <div className={`alert ${submitMsg.type === 'ok' ? 'alert-ok' : 'alert-err'}`}>
              {submitMsg.type === 'ok' ? '✅' : '❌'} {submitMsg.text}
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 11.5, color: '#86868b' }}>
            Async AWS Batch job via Fargate · cold-start ~60–90 s · results stored in S3
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>Crawl History</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="tab-bar">
              {(['24h','7d','30d','90d','custom'] as TimeRange[]).map(t => (
                <button key={t} className={`tab${timeRange === t ? ' active' : ''}`} onClick={() => setTimeRange(t)}>
                  {t === 'custom' ? 'Custom' : t}
                </button>
              ))}
            </div>
            {timeRange === 'custom' && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="date" className="input" style={{ width: 140, padding: '5px 9px', fontSize: 11.5 }}
                  value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                <span style={{ fontSize: 11, color: '#86868b' }}>→</span>
                <input type="date" className="input" style={{ width: 140, padding: '5px 9px', fontSize: 11.5 }}
                  value={customTo} onChange={e => setCustomTo(e.target.value)} />
                <button className="btn btn-ghost btn-sm" onClick={fetchSummary}>Apply</button>
              </div>
            )}
            <label className="toggle-auto" onClick={() => setAutoRefresh(v => !v)}>
              <div className={`toggle-track${autoRefresh ? ' on' : ''}`}><div className="toggle-thumb" /></div>
              Auto (20s)
            </label>
            <button className="refresh-btn" onClick={fetchSummary} disabled={loading}>
              {loading ? <span className="spinner spinner-dark" /> : '↻'} Refresh
            </button>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 9, fontSize: 12, color: '#86868b', pointerEvents: 'none' }}>🔍</span>
              <input className="input" style={{ paddingLeft: 28, width: 200, padding: '6px 10px 6px 28px', fontSize: 12 }}
                placeholder="Filter hostname, URL, config…" value={filterText} onChange={e => setFilterText(e.target.value)} />
              {filterText && (
                <button onClick={() => setFilterText('')} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#86868b', lineHeight: 1, padding: 0 }}>✕</button>
              )}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'clip' }}>
          {filteredJobs.length === 0 && !loading ? (
            <div className="empty-state">
              {jobs.length === 0 ? 'No crawl jobs found. Submit one above to get started.' : 'No jobs match your filter.'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Hostname</th>
                    <th>URL</th>
                    <th>Config</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Duration</th>
                    <th style={{ textAlign: 'right' }}>Visited</th>
                    <th style={{ textAlign: 'right' }}>Discovered</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map(job => {
                    const dur = jobDuration(job)
                    const inProgress = ['SUBMITTED','PENDING','RUNNABLE','STARTING','RUNNING'].includes(job.status)
                    const isOpen = expandedJob === job.jobId
                    const hostname = job.hostname ?? (() => { try { return new URL(job.url ?? '').hostname } catch { return null } })()
                    return (
                      <React.Fragment key={job.jobId}>
                        <tr>
                          <td><span className="mono" style={{ color: '#0071e3' }}>{job.jobId.slice(0, 8)}…</span></td>
                          <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {hostname ? <span className="mono" style={{ fontSize: 11, color: '#3a3a3c' }}>{hostname}</span>
                              : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.url
                              ? <a href={job.url} target="_blank" rel="noreferrer" style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: 11.5 }} title={job.url}>
                                  {job.url.replace(/^https?:\/\//, '').slice(0, 40)}{job.url.replace(/^https?:\/\//, '').length > 40 ? '…' : ''}
                                </a>
                              : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td>
                            {job.configKey
                              ? <span className="config-tag" title={job.configKey}>{configShortName(job.configKey)}</span>
                              : <span style={{ color: '#86868b' }}>—</span>}
                          </td>
                          <td><StatusBadge status={job.status} /></td>
                          <td className="mono" style={{ whiteSpace: 'nowrap', fontSize: 11 }}>{fmtTime(job.submittedAt ?? job.createdAt)}</td>
                          <td className="mono" style={{ fontSize: 11, color: inProgress ? '#8e6000' : undefined }}>{dur ?? '—'}</td>
                          <td className="mono" style={{ fontSize: 11, textAlign: 'right' }}>{job.visitedCount != null ? job.visitedCount.toLocaleString() : '—'}</td>
                          <td className="mono" style={{ fontSize: 11, textAlign: 'right' }}>{job.discoveredCount != null ? job.discoveredCount.toLocaleString() : '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button className="btn btn-sm btn-detail"
                                onClick={() => setExpandedJob(isOpen ? null : job.jobId)}
                                style={{ background: isOpen ? 'rgba(0,113,227,.18)' : undefined }}>
                                {isOpen ? 'Hide' : '▾ Detail'}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="expand-row">
                            <td colSpan={10}>
                              <div className="expand-inner">
                                <div className="kv-grid" style={{ marginBottom: 14 }}>
                                  <div className="kv"><div className="kv-label">Full Job ID</div><div className="kv-val mono">{job.jobId}</div></div>
                                  <div className="kv"><div className="kv-label">Status</div><div className="kv-val"><StatusBadge status={job.status} /></div></div>
                                  <div className="kv"><div className="kv-label">Submitted</div><div className="kv-val">{fmtTime(job.submittedAt ?? job.createdAt)}</div></div>
                                  <div className="kv"><div className="kv-label">Completed</div><div className="kv-val">{fmtTime(job.completedAt ?? job.stoppedAt)}</div></div>
                                  <div className="kv"><div className="kv-label">Duration</div><div className="kv-val mono">{jobDuration(job) ?? '—'}</div></div>
                                  {job.configKey && (
                                    <div className="kv"><div className="kv-label">Config Key</div><div className="kv-val mono" style={{ fontSize: 11, wordBreak: 'break-all' }}>{job.configKey}</div></div>
                                  )}
                                  {job.exitCode != null && (
                                    <div className="kv"><div className="kv-label">Exit Code</div><div className="kv-val mono" style={{ color: job.exitCode === 0 ? '#1d7d45' : '#b52a1c' }}>{job.exitCode}</div></div>
                                  )}
                                  {(job.logStreamName ?? job.batchDetail?.logStreamName) && (
                                    <div className="kv">
                                      <div className="kv-label">Log Stream</div>
                                      <div className="kv-val">
                                        <a href={cwLogUrl(job.logStreamName ?? job.batchDetail!.logStreamName!)} target="_blank" rel="noreferrer"
                                          className="mono" style={{ fontSize: 10.5, color: '#0071e3', textDecoration: 'none', wordBreak: 'break-all' }}>
                                          {(job.logStreamName ?? job.batchDetail?.logStreamName ?? '').split('/').pop()} ↗
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                  {job.visitedCount != null && (
                                    <div className="kv"><div className="kv-label">Pages Visited</div><div className="kv-val mono">{job.visitedCount.toLocaleString()}</div></div>
                                  )}
                                  {job.discoveredCount != null && (
                                    <div className="kv"><div className="kv-label">Pages Discovered</div><div className="kv-val mono">{job.discoveredCount.toLocaleString()}</div></div>
                                  )}
                                  {(job.statusReason ?? job.batchDetail?.statusReason) && (
                                    <div className="kv" style={{ gridColumn: '1 / -1' }}>
                                      <div className="kv-label">Status Reason</div>
                                      <div className="kv-val" style={{ color: '#b52a1c' }}>{job.statusReason ?? job.batchDetail?.statusReason}</div>
                                    </div>
                                  )}
                                  {job.stoppedReason && (
                                    <div className="kv" style={{ gridColumn: '1 / -1' }}>
                                      <div className="kv-label">Stopped Reason</div>
                                      <div className="kv-val" style={{ color: '#8e6000' }}>{job.stoppedReason}</div>
                                    </div>
                                  )}
                                  {job.errorSummary && (
                                    <div className="kv" style={{ gridColumn: '1 / -1' }}>
                                      <div className="kv-label">Error Summary</div>
                                      <div className="kv-val mono" style={{ color: '#b52a1c', fontSize: 11, wordBreak: 'break-all' }}>{job.errorSummary}</div>
                                    </div>
                                  )}
                                </div>

                                {job.s3Paths && Object.keys(job.s3Paths).length > 0 && (
                                  <div>
                                    <div className="kv-label" style={{ marginBottom: 8 }}>Artifacts</div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                      {(['result_json', 'result_excel', 'crawl_log'] as const)
                                        .filter(k => job.s3Paths![k])
                                        .map(k => {
                                          const url = job.s3Paths![k]!
                                          const loadKey = `${job.jobId}:${k}`
                                          const isLoadingThis = artifactLoading === loadKey
                                          const label = k === 'result_json' ? '📄 result.json' : k === 'result_excel' ? '📊 result.xlsx' : '📋 crawl.log'
                                          return (
                                            <button key={k} className="artifact-btn" disabled={!!isLoadingThis} title={url}
                                              onClick={() => downloadArtifact(url, loadKey)}>
                                              {isLoadingThis ? <span className="spinner spinner-dark" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> : '↓'}
                                              {label}
                                            </button>
                                          )
                                        })}
                                      {Object.entries(job.s3Paths)
                                        .filter(([k]) => !['result_json','result_excel','crawl_log'].includes(k))
                                        .map(([k, url]) => {
                                          if (!url) return null
                                          const loadKey = `${job.jobId}:${k}`
                                          const isLoadingThis = artifactLoading === loadKey
                                          return (
                                            <button key={k} className="artifact-btn" disabled={!!isLoadingThis} title={url}
                                              onClick={() => downloadArtifact(url, loadKey)}>
                                              {isLoadingThis ? <span className="spinner spinner-dark" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> : '↓'}
                                              {k}
                                            </button>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}
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
          {filterText ? `${filteredJobs.length} of ${jobs.length} jobs` : `${jobs.length} jobs`}
          {' '}· source: <span className="mono">/results/summary</span>
          {' '}· results stored in S3 · DDB records expire after 90 days
        </div>

      </div>
    </div>
  )
}
