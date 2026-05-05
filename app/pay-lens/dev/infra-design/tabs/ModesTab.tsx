import React from 'react'
import { Ic } from '../components'

export function ModesTab() {
  return (
    <>
      <div className="section-title">Execution Modes</div>
      <div className="section-sub">Two production modes plus two local development modes. All share the same <Ic>src/core/runner.ts</Ic> detection logic.</div>
      <div className="card-grid card-grid-2" style={{ marginBottom: '28px' }}>
        <div className="mode-card mode-lmb">
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>⚡</div>
          <div className="mode-name">Lambda — Direct Invoke</div>
          <span className="mode-badge mbadge-lmb">Synchronous · max 5 min</span>
          <div className="mode-desc">Triggered by direct invoke or API Gateway. Runs full detection in a single Lambda execution. Writes results directly to DynamoDB and S3. No EventBridge needed — errors handled in-process.</div>
          <div className="mode-tags">
            <span className="tag tag-orange">lambda-handler.ts</span>
            <span className="tag tag-gray">jobId = awsRequestId</span>
            <span className="tag tag-gray">2 GB RAM</span>
          </div>
        </div>
        <div className="mode-card mode-btch">
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🐳</div>
          <div className="mode-name">Batch — Async Job Queue</div>
          <span className="mode-badge mbadge-btch">Async · max 10 min · Fargate</span>
          <div className="mode-desc">Submitted via POST /jobs/submit. Batch provisions a Fargate task. Returns jobId immediately. Container starts within ~60–90 s. Status synced via EventBridge on completion/failure.</div>
          <div className="mode-tags">
            <span className="tag tag-purple">batch-runner.ts</span>
            <span className="tag tag-gray">jobId = AWS_BATCH_JOB_ID</span>
            <span className="tag tag-gray">2 vCPU / 4 GB</span>
          </div>
        </div>
        <div className="mode-card mode-local">
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🧪</div>
          <div className="mode-name">Local — Playwright Test</div>
          <span className="mode-badge mbadge-local">Fastest · no Docker needed</span>
          <div className="mode-desc">Run directly with <Ic>npx playwright test</Ic>. Uses headless Chromium on your machine. Best for rapid iteration on detection logic. No S3/DynamoDB writes (S3_BUCKET not set).</div>
          <div className="mode-tags">
            <span className="tag tag-blue">npx playwright test</span>
            <span className="tag tag-green">artifacts → test-results/</span>
          </div>
        </div>
        <div className="mode-card mode-docker">
          <div style={{ fontSize: '28px', marginBottom: '10px' }}>🐋</div>
          <div className="mode-name">Local Docker — Lambda RIE</div>
          <span className="mode-badge mbadge-local">Closest to cloud</span>
          <div className="mode-desc">Runs the lambda-runtime image locally with the Lambda Runtime Interface Emulator. Identical to AWS — same Chromium flags, same AL2023 environment. Validate before deploying.</div>
          <div className="mode-tags">
            <span className="tag tag-green">docker run -p 9000:8080</span>
            <span className="tag tag-blue">curl localhost:9000/…invocations</span>
          </div>
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Mode comparison</div>
        <table className="data-table">
          <thead><tr><th>Mode</th><th>Entry file</th><th>jobId source</th><th>Start latency</th><th>Max runtime</th><th>S3 / DDB writes</th></tr></thead>
          <tbody>
            <tr><td><strong>Lambda</strong></td><td className="mono">lambda-handler.ts</td><td className="mono">awsRequestId</td><td>&lt; 2 s (warm)</td><td>5 min</td><td>✅ Yes</td></tr>
            <tr><td><strong>Batch</strong></td><td className="mono">batch-runner.ts</td><td className="mono">AWS_BATCH_JOB_ID</td><td>60–90 s</td><td>10 min</td><td>✅ Yes</td></tr>
            <tr><td><strong>Playwright local</strong></td><td className="mono">tests/*.spec.ts</td><td>—</td><td>&lt; 1 s</td><td>unlimited</td><td>❌ skipped</td></tr>
            <tr><td><strong>Docker Lambda RIE</strong></td><td className="mono">lambda-handler.ts</td><td>mock UUID</td><td>&lt; 2 s</td><td>unlimited</td><td>❌ skipped</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
