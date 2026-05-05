import React from 'react'
import { Ic } from '../components'

export function LifecycleTab() {
  return (
    <>
      <div className="section-title">Job Lifecycle &amp; DynamoDB Write Points</div>
      <div className="section-sub">DynamoDB is written at multiple points. The two modes differ in who writes the terminal status.</div>
      <div className="lc-grid">
        <div className="lc-col lc-lambda">
          <div className="lc-header">⚡ Lambda mode</div>
          <div className="lc-step"><div className="lc-num">1</div><div className="lc-step-text"><strong>lambda-handler.ts starts</strong><br /><span className="lc-step-code">writeJobSubmitted()</span> → status: SUBMITTED</div></div>
          <div className="lc-step"><div className="lc-num">2</div><div className="lc-step-text"><strong>runDetection()</strong><br />Playwright full pipeline (~60 s)</div></div>
          <div className="lc-step"><div className="lc-num">3</div><div className="lc-step-text"><strong>Success</strong><br /><span className="lc-step-code">writeJobResult()</span> → status: SUCCEEDED + all result fields</div></div>
          <div className="lc-step"><div className="lc-num">4</div><div className="lc-step-text"><strong>Error (catch block)</strong><br /><span className="lc-step-code">updateJobStatus(&apos;FAILED&apos;)</span><br />No EventBridge — handled in-process</div></div>
        </div>
        <div className="lc-col lc-batch">
          <div className="lc-header">🐳 Batch mode</div>
          <div className="lc-step"><div className="lc-num">1</div><div className="lc-step-text"><strong>submit-handler.ts</strong><br /><span className="lc-step-code">batch.submitJob()</span> → returns jobId<br /><span className="lc-step-code">writeJobSubmitted()</span> → SUBMITTED</div></div>
          <div className="lc-step"><div className="lc-num">2</div><div className="lc-step-text"><strong>Fargate container starts</strong><br />batch-runner.ts · ~60–90 s cold start<br />runDetection()</div></div>
          <div className="lc-step"><div className="lc-num">3</div><div className="lc-step-text"><strong>Success</strong><br /><span className="lc-step-code">writeJobResult()</span> → SUCCEEDED + results</div></div>
          <div className="lc-step"><div className="lc-num">4</div><div className="lc-step-text"><strong>Failure</strong><br />Container exits 1 — does NOT write DynamoDB</div></div>
          <div className="lc-step"><div className="lc-num">5</div><div className="lc-step-text"><strong>EventBridge fires</strong><br />aws.batch FAILED/SUCCEEDED → status-sync Lambda<br /><span className="lc-step-code">updateJobStatus(jobId, status, stoppedAt, logStreamName)</span></div></div>
        </div>
      </div>
    </>
  )
}
