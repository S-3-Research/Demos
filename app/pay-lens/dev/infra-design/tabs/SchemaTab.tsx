import React from 'react'
import { Ic } from '../components'

export function SchemaTab() {
  return (
    <>
      <div className="section-title">DynamoDB Table Schema</div>
      <div className="section-sub">Table: <Ic>payment-detection-jobs</Ic> · PAY_PER_REQUEST · TTL field: <Ic>ttl</Ic></div>
      <table className="data-table">
        <thead><tr><th>Attribute</th><th>Type</th><th>Key</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td className="mono">pk</td><td><span className="type-tag type-s">S</span></td><td><span className="pk-tag">PK</span></td><td>Hostname, e.g. <Ic>www.k9reproduction.com</Ic></td></tr>
          <tr><td className="mono">sk</td><td><span className="type-tag type-s">S</span></td><td><span className="pk-tag">SK</span></td><td><Ic>job#&lt;jobId&gt;</Ic> — enables querying all jobs for a hostname</td></tr>
          <tr><td className="mono">jobId</td><td><span className="type-tag type-s">S</span></td><td></td><td>AWS Batch Job ID or Lambda awsRequestId</td></tr>
          <tr><td className="mono">url</td><td><span className="type-tag type-s">S</span></td><td></td><td>Full product page URL submitted for detection</td></tr>
          <tr><td className="mono">status</td><td><span className="type-tag type-s">S</span></td><td></td><td>SUBMITTED → SUCCEEDED / FAILED</td></tr>
          <tr><td className="mono">submittedAt</td><td><span className="type-tag type-n">N</span></td><td></td><td>Epoch ms — written at submission time</td></tr>
          <tr><td className="mono">completedAt</td><td><span className="type-tag type-n">N</span></td><td></td><td>Epoch ms — written by container/Lambda on success</td></tr>
          <tr><td className="mono">stoppedAt</td><td><span className="type-tag type-n">N</span></td><td></td><td>Epoch ms — written by EventBridge Lambda (Batch only)</td></tr>
          <tr><td className="mono">entities</td><td><span className="type-tag type-l">L</span></td><td></td><td>Unified entity list — each item: <Ic>&#123;name, category, available, confidence&#125;</Ic>. category: <Ic>gateway</Ic> / <Ic>wallet</Ic> / <Ic>bnpl</Ic> / <Ic>card-brand</Ic> / <Ic>platform</Ic></td></tr>
          <tr><td className="mono">entityCount</td><td><span className="type-tag type-n">N</span></td><td></td><td>Total detected payment entities</td></tr>
          <tr><td className="mono">signalCount</td><td><span className="type-tag type-n">N</span></td><td></td><td>Total signals collected</td></tr>
          <tr><td className="mono">s3Paths</td><td><span className="type-tag type-m">M</span></td><td></td><td>Map of artifact filename → S3 URI (evidence.csv, entities.json, etc.)</td></tr>
          <tr><td className="mono">logStreamName</td><td><span className="type-tag type-s">S</span></td><td></td><td>CloudWatch Batch 日志流名称，由 status-sync Lambda 在终态时写入，格式 <Ic>payment-detection-job/default/&lt;hash&gt;</Ic></td></tr>
          <tr><td className="mono">navFinalState</td><td><span className="type-tag type-s">S</span></td><td></td><td>Last <Ic>PageState</Ic> reached by <Ic>navigateToCheckoutSM</Ic> — <Ic>CHECKOUT_PAYMENT_STEP</Ic> on success; terminal failure state (<Ic>SIGN_IN_WALL</Ic>, <Ic>CART_EMPTY</Ic>, <Ic>EXHAUSTED</Ic>) on <Ic>NavError</Ic>. Omitted when nav step is skipped.</td></tr>
          <tr><td className="mono">navBlockReason</td><td><span className="type-tag type-s">S</span></td><td></td><td>Human-readable nav failure reason string; omitted on success.</td></tr>
          <tr><td className="mono">ttl</td><td><span className="type-tag type-n">N</span></td><td></td><td>Unix seconds — auto-expire after 90 days</td></tr>
        </tbody>
      </table>
    </>
  )
}
