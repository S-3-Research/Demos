import React from 'react'
import { Ic } from '../components'

export function SrcTab() {
  return (
    <>
      <div className="section-title">Source Code Structure</div>
      <div className="section-sub">Core detection logic is AWS-agnostic. AWS runtime adapters and API handlers are separate layers.</div>
      <div className="dir-tree">
        <span className="folder">payment_detection/</span><br />
        &nbsp;&nbsp;<span className="folder">src/</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="folder">core/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Pure detection logic, no AWS deps</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">types.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← All TypeScript type definitions</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">signatures.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Payment gateway signature library</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">detector.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Network / HTML signal collection</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">actions.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Page interaction actions</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">checkout_nav.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Checkout flow navigation state machine</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">artifacts.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Local artifact write</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">runner.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Detection main flow (called by Lambda / Batch / test)</span><br />
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="folder">aws/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← AWS runtime entries &amp; storage</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">storage.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← S3 upload + DynamoDB read/write</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">lambda-handler.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Lambda entry (single URL)</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">batch-runner.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Batch / Fargate entry (batch)</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">status-sync-handler.ts</span>&nbsp;<span className="comment">← EventBridge → DynamoDB terminal state sync</span><br />
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="folder">api/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← API Gateway Lambda handlers</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">submit-handler.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← POST /jobs/submit</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">jobs-handler.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← GET /jobs/status  /jobs/&#123;jobId&#125;</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">query-handler.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← GET /detections  /detections/latest</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">summary-handler.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← GET /detections/summary (DynamoDB + Batch merge)</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">artifacts-handler.ts</span>&nbsp;&nbsp;&nbsp;<span className="comment">← GET /artifacts (S3 Presigned URL)</span><br />
        <br />
        &nbsp;&nbsp;<span className="folder">tests/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Playwright tests (local dev)</span><br />
        &nbsp;&nbsp;<span className="folder">infra/</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← CDK infrastructure</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="file">bin/app.ts</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="folder">lib/</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">storage-stack.ts</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">compute-stack.ts</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">api-stack.ts</span><br />
        &nbsp;&nbsp;<span className="file">Dockerfile</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Multi-stage: builder / batch / lambda-runtime</span><br />
        &nbsp;&nbsp;<span className="file">tsconfig.json</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Tests (includes test files)</span><br />
        &nbsp;&nbsp;<span className="file">tsconfig.build.json</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Production build (rootDir: src, outDir: dist)</span>
      </div>
      <div className="card-grid card-grid-3" style={{ marginTop: '24px' }}>
        <div className="card" style={{ marginBottom: 0, borderTop: '3px solid var(--accent)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>src/core/</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>Pure TypeScript — no AWS SDK. Runs identically in Lambda, Batch, local Playwright, and Docker. <Ic>runner.ts</Ic> is the single entry point called by all execution modes.</div>
        </div>
        <div className="card" style={{ marginBottom: 0, borderTop: '3px solid var(--orange)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--orange)' }}>src/aws/</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>AWS runtime adapters. <Ic>storage.ts</Ic> centralises all S3 + DynamoDB I/O. Entry points (<Ic>lambda-handler.ts</Ic>, <Ic>batch-runner.ts</Ic>) call <Ic>core/runner.ts</Ic> then delegate writes to <Ic>storage.ts</Ic>.</div>
        </div>
        <div className="card" style={{ marginBottom: 0, borderTop: '3px solid var(--purple)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--purple)' }}>src/api/</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>Thin API Gateway handlers. Each handler maps to one API route group. <Ic>summary-handler.ts</Ic> is the only handler that calls both DynamoDB and Batch API. <Ic>artifacts-handler.ts</Ic> only generates Presigned URLs.</div>
        </div>
      </div>
    </>
  )
}
