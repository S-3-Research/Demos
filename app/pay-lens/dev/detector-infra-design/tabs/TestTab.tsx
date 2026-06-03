import React from 'react'
import { Ic, CodeBlock } from '../components'
import { CODE } from '../data'

export function TestTab() {
  return (
    <>
      <div className="section-title">Testing Guide</div>
      <div className="section-sub">Four levels of testing, from fastest local iteration to full cloud validation. Run in order when making changes.</div>
      <div className="info-box">
        <strong>Reference URL:</strong> <Ic>https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit</Ic><br />
        <strong>Expected:</strong> entities=5 · Square (high ✓) · Afterpay (high ✓) · PayPal (low) · 2Checkout (low) · Apple Pay (low)
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>1️⃣</span>
          <div><div style={{ fontSize: '14px', fontWeight: 700 }}>Local Playwright (no Docker)</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fastest · best for iterating on detection logic</div></div>
          <span className="tag tag-green" style={{ marginLeft: 'auto' }}>~60–90s</span>
        </div>
        <CodeBlock code={CODE.testPlaywright} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>2️⃣</span>
          <div><div style={{ fontSize: '14px', fontWeight: 700 }}>Local Docker — Batch mode</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tests the container environment, no Lambda overhead</div></div>
          <span className="tag tag-purple" style={{ marginLeft: 'auto' }}>~90s</span>
        </div>
        <CodeBlock code={CODE.testDockerBatch} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>3️⃣</span>
          <div><div style={{ fontSize: '14px', fontWeight: 700 }}>Local Docker — Lambda RIE</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Closest to production Lambda. Same AL2023, same Chromium flags.</div></div>
          <span className="tag tag-orange" style={{ marginLeft: 'auto' }}>~90s</span>
        </div>
        <CodeBlock code={CODE.testDockerLambda} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>4️⃣</span>
          <div><div style={{ fontSize: '14px', fontWeight: 700 }}>End-to-End — Lambda (AWS)</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}><strong>--cli-read-timeout 120 required</strong> — detection takes ~60s, default CLI timeout is 60s</div></div>
          <span className="tag tag-orange" style={{ marginLeft: 'auto' }}>~70s</span>
        </div>
        <CodeBlock code={CODE.testE2eLambda} />
      </div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>4️⃣</span>
          <div><div style={{ fontSize: '14px', fontWeight: 700 }}>End-to-End — Batch (AWS)</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fargate cold-start adds ~60–90s on top of detection time</div></div>
          <span className="tag tag-purple" style={{ marginLeft: 'auto' }}>~3–4 min</span>
        </div>
        <CodeBlock code={CODE.testE2eBatch} />
      </div>
    </>
  )
}
