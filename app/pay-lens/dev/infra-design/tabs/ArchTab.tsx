import React from 'react'

export function ArchTab() {
  return (
    <>
      <div className="section-title">Overall Architecture</div>
      <div className="section-sub">API Gateway routes requests to Lambda handlers; Batch runs long-lived detection containers; EventBridge syncs final job status.</div>
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', minWidth: '580px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
            <div className="arch-box apigw" style={{ maxWidth: '520px' }}>
              <div className="box-title">🌐 API Gateway (REST) — stage v1</div>
              <div className="box-sub">POST /jobs/submit &nbsp;·&nbsp; GET /jobs/status &nbsp;·&nbsp; GET /jobs/&#123;jobId&#125; &nbsp;·&nbsp; GET /detections &nbsp;·&nbsp; GET /detections/latest &nbsp;·&nbsp; GET /detections/summary</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#c7c7cc', fontSize: '22px', padding: '6px 0' }}>↓</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ submit-handler</div>
              <div className="box-sub">POST /jobs/submit<br />writeJobSubmitted() → SUBMITTED</div>
            </div>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ jobs-handler</div>
              <div className="box-sub">GET /jobs/status<br />GET /jobs/&#123;jobId&#125; → Batch API</div>
            </div>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ query-handler</div>
              <div className="box-sub">GET /detections<br />GET /detections/latest → DDB</div>
            </div>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ summary-handler</div>
              <div className="box-sub">GET /detections/summary<br />DynamoDB + Batch.describeJobs()</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#c7c7cc', fontSize: '22px', padding: '6px 0' }}>↓ submitJob()</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="arch-box btch" style={{ flex: '1.2' }}>
              <div className="box-title">🐳 AWS Batch / Fargate</div>
              <div className="box-sub">payment-detection-job<br />2 vCPU / 4 GB · retry 2 · 10 min<br /><em>batch-runner.ts</em></div>
            </div>
            <div style={{ color: '#c7c7cc', fontSize: '13px', padding: '0 4px' }}>OR</div>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ DetectorLambda</div>
              <div className="box-sub">Direct invoke · 2 GB · 5 min<br /><em>lambda-handler.ts</em></div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: '#c7c7cc', fontSize: '22px', padding: '6px 0' }}>↓ runDetection()</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="arch-box stor" style={{ flex: 1 }}>
              <div className="box-title">🪣 S3 Artifacts</div>
              <div className="box-sub">payment-detection-artifacts-&lt;acct&gt;<br />results/ prefix · 90-day expiry</div>
            </div>
            <div className="arch-box stor" style={{ flex: 1 }}>
              <div className="box-title">🗄 DynamoDB</div>
              <div className="box-sub">payment-detection-jobs<br />PK: hostname · SK: job#&lt;id&gt; · TTL 90d</div>
            </div>
            <div className="arch-box" style={{ flex: 1, borderTop: '3px solid #c7c7cc' }}>
              <div className="box-title">🖼 ECR</div>
              <div className="box-sub">payment-detection<br />:batch · :lambda · keep 10</div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="arch-box evtb" style={{ flex: 1 }}>
              <div className="box-title">📡 EventBridge Rule</div>
              <div className="box-sub">aws.batch · FAILED / SUCCEEDED → status-sync Lambda</div>
            </div>
            <div style={{ color: '#c7c7cc', fontSize: '18px' }}>→</div>
            <div className="arch-box lmb" style={{ flex: 1 }}>
              <div className="box-title">⚡ status-sync Lambda</div>
              <div className="box-sub">updateJobStatus(jobId, status, stoppedAt, logStreamName)<br />Batch mode only · writes logStreamName to DynamoDB</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
