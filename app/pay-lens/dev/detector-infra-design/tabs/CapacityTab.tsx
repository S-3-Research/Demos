'use client'
import React, { useState } from 'react'
import { Ic } from '../components'

export function CapacityTab() {
  const [maxVcpus, setMaxVcpus] = useState(16)
  const [vcpuPerJob, setVcpuPerJob] = useState(2)
  const [coldStartS, setColdStartS] = useState(60)
  const [detectS, setDetectS] = useState(60)

  const concurrency = vcpuPerJob > 0 ? Math.floor(maxVcpus / vcpuPerJob) : 0
  const totalS = coldStartS + detectS
  const dailyJobs = totalS > 0 ? Math.floor(concurrency * 86400 / totalS) : 0

  const scenarios = [
    { label: 'Optimistic (simple site)', cold: 30,  detect: 30  },
    { label: 'Typical',                  cold: 60,  detect: 60  },
    { label: 'Pessimistic (deep nav)',   cold: 90,  detect: 120 },
  ]

  const numInput = (
    val: number,
    setter: (n: number) => void,
    min = 1,
    max = 256
  ) => (
    <input
      type="number"
      min={min}
      max={max}
      value={val}
      onChange={e => setter(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
      style={{
        width: 72, padding: '3px 6px', borderRadius: 6,
        border: '1px solid var(--border)', background: 'var(--bg-secondary)',
        color: 'var(--text-primary)', fontSize: 13, textAlign: 'right',
        fontFamily: 'ui-monospace,"SF Mono",monospace',
      }}
    />
  )

  return (
    <>
      <div className="section-title">Key Config &amp; Capacity Reference</div>
      <div className="section-sub">Static configuration values and an interactive throughput calculator.</div>

      {/* ── Static config table ── */}
      <div className="section-title" style={{ marginTop: 24, fontSize: 14 }}>Configuration Overview</div>
      <table className="data-table">
        <thead>
          <tr><th>Setting</th><th>Value</th><th>File</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td className="mono">maxvCpus</td><td><strong>16</strong></td><td className="mono">compute-stack.ts</td><td>Fargate compute env vCPU ceiling — determines max concurrency</td></tr>
          <tr><td className="mono">vCPU / job</td><td><strong>2</strong></td><td className="mono">compute-stack.ts</td><td>Per-job vCPU allocation; lower value = higher concurrency</td></tr>
          <tr><td className="mono">Memory / job</td><td><strong>4096 MB</strong></td><td className="mono">compute-stack.ts</td><td>Per-job memory allocation</td></tr>
          <tr><td className="mono">retryStrategy.attempts</td><td><strong>2</strong></td><td className="mono">compute-stack.ts</td><td>Max attempts including first run</td></tr>
          <tr><td className="mono">Job timeout</td><td><strong>600 s</strong></td><td className="mono">compute-stack.ts</td><td>Max duration per attempt; exceeded = FAILED</td></tr>
          <tr><td className="mono">DetectorLambda memory</td><td><strong>2048 MB</strong></td><td className="mono">compute-stack.ts</td><td>Lambda mode memory</td></tr>
          <tr><td className="mono">DetectorLambda timeout</td><td><strong>5 min</strong></td><td className="mono">compute-stack.ts</td><td>Lambda mode timeout ceiling</td></tr>
          <tr><td className="mono">API rateLimit</td><td><strong>100 rps</strong></td><td className="mono">api-stack.ts</td><td>API Gateway steady-state requests/sec</td></tr>
          <tr><td className="mono">API burstLimit</td><td><strong>200</strong></td><td className="mono">api-stack.ts</td><td>API Gateway token-bucket burst ceiling</td></tr>
          <tr><td className="mono">API daily quota</td><td><strong>10,000</strong></td><td className="mono">api-stack.ts</td><td>All endpoints combined; resets at midnight UTC</td></tr>
          <tr><td className="mono">submitFn timeout</td><td><strong>30 s</strong></td><td className="mono">api-stack.ts</td><td>Submit endpoint Lambda timeout</td></tr>
          <tr><td className="mono">summaryFn timeout</td><td><strong>30 s</strong></td><td className="mono">api-stack.ts</td><td>Aggregated query Lambda timeout</td></tr>
          <tr><td className="mono">DynamoDB TTL</td><td><strong>90 days</strong></td><td className="mono">storage-stack.ts</td><td>Auto-expire after this duration</td></tr>
          <tr><td className="mono">ECR image retention</td><td><strong>10</strong></td><td className="mono">storage-stack.ts</td><td>Older images auto-pruned beyond this count</td></tr>
        </tbody>
      </table>

      {/* ── Interactive calculator ── */}
      <div className="section-title" style={{ marginTop: 32, fontSize: 14 }}>Throughput Calculator</div>
      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          Adjust the parameters below — daily job capacity updates automatically.
        </div>

        <table className="data-table" style={{ marginBottom: 0 }}>
          <thead>
            <tr><th>Parameter</th><th style={{ width: 110 }}>Value</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><Ic>maxvCpus</Ic></td>
              <td>{numInput(maxVcpus, setMaxVcpus, 2, 512)}</td>
              <td>Fargate compute env vCPU ceiling</td>
            </tr>
            <tr>
              <td><Ic>vCPU / job</Ic></td>
              <td>{numInput(vcpuPerJob, setVcpuPerJob, 1, 64)}</td>
              <td>Per-job allocation (lower = more concurrency)</td>
            </tr>
            <tr>
              <td>Cold-start duration (s)</td>
              <td>{numInput(coldStartS, setColdStartS, 0, 600)}</td>
              <td>Container pull + init time</td>
            </tr>
            <tr>
              <td>Detection duration (s)</td>
              <td>{numInput(detectS, setDetectS, 1, 600)}</td>
              <td>Actual page navigation + detection</td>
            </tr>
          </tbody>
        </table>

        {/* Result */}
        <div style={{
          marginTop: 20, padding: '14px 18px', borderRadius: 10,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Max concurrency</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'ui-monospace,"SF Mono",monospace', color: 'var(--text-primary)' }}>
              {concurrency}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{maxVcpus} ÷ {vcpuPerJob} vCPU</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Time / job</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'ui-monospace,"SF Mono",monospace', color: 'var(--text-primary)' }}>
              {totalS} s
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{coldStartS} + {detectS}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Daily jobs</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'ui-monospace,"SF Mono",monospace', color: '#1d7d45' }}>
              ~{dailyJobs.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{concurrency} × 86400 ÷ {totalS}</div>
          </div>
        </div>
      </div>

      {/* ── Preset scenarios ── */}
      <div className="section-title" style={{ marginTop: 28, fontSize: 14 }}>Preset Scenarios (current concurrency: {concurrency})</div>
      <table className="data-table">
        <thead>
          <tr><th>Scenario</th><th>Cold-start</th><th>Detection</th><th>Total / job</th><th>Daily capacity</th></tr>
        </thead>
        <tbody>
          {scenarios.map(s => {
            const t = s.cold + s.detect
            const d = Math.floor(concurrency * 86400 / t)
            return (
              <tr key={s.label}>
                <td>{s.label}</td>
                <td>{s.cold} s</td>
                <td>{s.detect} s</td>
                <td>~{Math.round(t / 60)} min</td>
                <td><strong>~{d.toLocaleString()} jobs</strong></td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="info-box" style={{ marginTop: 16 }}>
        Current bottleneck is Batch concurrency (~5,760 / day at typical scenario), which is below the API Gateway daily quota of 10,000.
        To exceed 5,760: raise <Ic>maxvCpus</Ic> to 32+ or lower <Ic>vCPU/job</Ic> to 1 (verify memory is sufficient).
      </div>
    </>
  )
}
