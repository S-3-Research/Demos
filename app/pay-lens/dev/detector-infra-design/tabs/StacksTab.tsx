import React from 'react'
import { Ic } from '../components'

export function StacksTab() {
  return (
    <>
      <div className="section-title">CDK Stack Layers</div>
      <div className="section-sub">Three stacks deployed in dependency order: Storage → Compute → API. Each exports references consumed by the next.</div>
      <div className="dir-tree" style={{ marginBottom: '24px' }}>
        <span className="folder">infra/</span><br />
        &nbsp;&nbsp;<span className="folder">bin/app.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← CDK App entry, wires 3 stacks</span><br />
        &nbsp;&nbsp;<span className="folder">lib/</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="file">storage-stack.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← S3 + DynamoDB + ECR  (deploy first)</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="file">compute-stack.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← Lambda + Batch + EventBridge</span><br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="file">api-stack.ts</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">← API Gateway handlers (depends on both)</span>
      </div>
      <div className="card">
        <div className="stack-title">🗄 StorageStack</div>
        <div className="stack-sub">Persistent resources. Deployed first. Exports bucket / table / ecrRepo.</div>
        <ul className="resource-list">
          <li><span className="res-icon">🪣</span><div><div className="res-name">S3 Bucket</div><div className="res-desc">payment-detection-artifacts-&lt;account&gt; · results/ lifecycle 90d expiry</div></div></li>
          <li><span className="res-icon">🗃</span><div><div className="res-name">DynamoDB Table</div><div className="res-desc">payment-detection-jobs · PAY_PER_REQUEST · TTL field: ttl · PK: hostname · SK: job#&lt;id&gt;</div></div></li>
          <li><span className="res-icon">🖼</span><div><div className="res-name">ECR Repository</div><div className="res-desc">payment-detection · keep last 10 images · scan on push</div></div></li>
        </ul>
      </div>
      <div className="card">
        <div className="stack-title">⚙️ ComputeStack</div>
        <div className="stack-sub">All compute resources. Depends on StorageStack. Shared IAM role (S3 PutObject, DynamoDB Write, ECR Pull).</div>
        <ul className="resource-list">
          <li><span className="res-icon">⚡</span><div><div className="res-name">DetectorLambda</div><div className="res-desc">ECR image · CMD: dist/aws/lambda-handler.handler · 2 GB RAM · 5 min timeout · imageUri = ECR@sha256 digest</div></div></li>
          <li><span className="res-icon">🐳</span><div><div className="res-name">Batch Compute Environment</div><div className="res-desc">Fargate · default VPC public subnets · MANAGED</div></div></li>
          <li><span className="res-icon">📋</span><div><div className="res-name">Batch Job Queue + Job Definition</div><div className="res-desc">payment-detection-job · 2 vCPU / 4 GB · retry 2 · timeout 10 min · ECR image batchImageTag digest</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">StatusSyncLambda</div><div className="res-desc">NodejsFunction bundling src/aws/status-sync-handler.ts · triggered by EventBridge rule</div></div></li>
          <li><span className="res-icon">📡</span><div><div className="res-name">EventBridge Rule</div><div className="res-desc">source: aws.batch · detailType: Batch Job State Change · status: [FAILED, SUCCEEDED] · jobQueue: payment-detection-queue (ARN 精确匹配，防止其他队列触发) → StatusSyncLambda</div></div></li>
        </ul>
      </div>
      <div className="card">
        <div className="stack-title">🌐 ApiStack</div>
        <div className="stack-sub">API Gateway + 3 Lambda handlers. Depends on StorageStack and ComputeStack.</div>
        <ul className="resource-list">
          <li><span className="res-icon">🌐</span><div><div className="res-name">API Gateway RestApi</div><div className="res-desc">stage v1 · CORS enabled · throttle 100 rps</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">SubmitFn</div><div className="res-desc">src/api/submit-handler.ts · grants: batch:SubmitJob + DynamoDB Write</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">JobsFn</div><div className="res-desc">src/api/jobs-handler.ts · grants: batch:ListJobs + batch:DescribeJobs</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">QueryFn</div><div className="res-desc">src/api/query-handler.ts · grants: DynamoDB Read (query + getItem)</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">SummaryFn</div><div className="res-desc">src/api/summary-handler.ts · grants: DynamoDB Read + batch:DescribeJobs · merges DynamoDB history with real-time Batch status for in-progress jobs</div></div></li>
          <li><span className="res-icon">⚡</span><div><div className="res-name">ArtifactsFn</div><div className="res-desc">src/api/artifacts-handler.ts · grants: S3 Read · generates Presigned URL (15 min) · restricted to <code>results/</code> prefix only</div></div></li>
        </ul>
      </div>
      <div className="info-box" style={{ marginTop: 4 }}>
        <strong>EventBridge Rule (ComputeStack)</strong> — Matches <Ic>aws.batch</Ic> + <Ic>status: [FAILED, SUCCEEDED]</Ic> + <Ic>jobQueue: payment-detection-queue</Ic> (ARN exact match, prevents other queues from triggering the sync Lambda).
      </div>
    </>
  )
}
