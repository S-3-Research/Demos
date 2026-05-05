import React from 'react'
import { Ic } from '../components'

export function ApiTab() {
  return (
    <>
      <div className="section-title">API Endpoints</div>
      <div className="section-sub">Base URL: <Ic>https://dksxsk0f39.execute-api.us-west-2.amazonaws.com/v1</Ic></div>
      <div className="info-box">
        <strong>/jobs endpoints</strong> proxy the Batch API — job history retained 24 h.<br />
        <strong>/detections endpoints</strong> query DynamoDB — records expire after 90 days (TTL).<br />
        <strong>/detections/summary</strong> aggregates both: in-progress jobs get real-time Batch status; completed jobs come from DynamoDB.
      </div>
      <table className="data-table">
        <thead><tr><th>Method</th><th>Path</th><th>Handler</th><th>Description</th></tr></thead>
        <tbody>
          <tr>
            <td><span className="tag tag-orange" style={{ fontWeight: 700 }}>POST</span></td>
            <td className="mono">/jobs/submit</td>
            <td className="mono">submit-handler</td>
            <td>Submit Batch scan job. Returns <Ic>{'{"jobId":"…","status":"SUBMITTED"}'}</Ic> immediately.</td>
          </tr>
          <tr>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/jobs/status?status=RUNNING</td>
            <td className="mono">jobs-handler</td>
            <td>List Batch jobs filtered by status (SUBMITTED / PENDING / RUNNING / SUCCEEDED / FAILED).</td>
          </tr>
          <tr>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/jobs/&#123;jobId&#125;</td>
            <td className="mono">jobs-handler</td>
            <td>Single job detail — status, log stream name, container exit code.</td>
          </tr>
          <tr>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/detections?hostname=example.com</td>
            <td className="mono">query-handler</td>
            <td>Query all scan records for a hostname. Optional <Ic>from</Ic> / <Ic>to</Ic> date filters.</td>
          </tr>
          <tr>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/detections/latest?url=https://…</td>
            <td className="mono">query-handler</td>
            <td>Most recent successful scan result for an exact URL. Returns full entity list.</td>
          </tr>
          <tr style={{ background: 'rgba(0,113,227,.025)' }}>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/detections/summary</td>
            <td className="mono">summary-handler</td>
            <td><strong>Aggregated view</strong> — DynamoDB history merged with real-time Batch status for in-progress jobs. See parameters below.</td>
          </tr>
          <tr>
            <td><span className="tag tag-blue" style={{ fontWeight: 700 }}>GET</span></td>
            <td className="mono">/artifacts?s3Uri=s3://…</td>
            <td className="mono">artifacts-handler</td>
            <td>Generate S3 Presigned URL (15 min). Only allows <Ic>results/</Ic> prefix paths. Use to download artifact files (evidence.csv, entities.json, etc.).</td>
          </tr>
        </tbody>
      </table>

      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: 4 }}>/detections/summary — Query Parameters</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: 14 }}>
          <strong>Merge logic:</strong> Jobs with DynamoDB status <Ic>SUBMITTED</Ic> or <Ic>RUNNING</Ic> are enriched via <Ic>Batch.describeJobs()</Ic>
          with real-time status, <Ic>logStreamName</Ic>, and <Ic>statusReason</Ic>.
          Completed jobs use DynamoDB data directly (<Ic>batchDetail: null</Ic>).<br />
          每条 job 响应包含顶层 <Ic>logStreamName</Ic> 字段，优先读取 DynamoDB 中持久化的值（由 status-sync Lambda 在任务终态时写入），若任务仍在运行则取 Batch 实时 API 中的值，否则为 <Ic>null</Ic>。
        </div>
        <table className="data-table">
          <thead><tr><th>Param</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td className="mono">hostname</td><td>string</td><td>No</td><td>—</td><td>Filter to a specific domain. Omit to return all hostnames.</td></tr>
            <tr><td className="mono">from</td><td>ISO date</td><td>No</td><td>7 days ago</td><td>Filter jobs submitted at or after this date.</td></tr>
            <tr><td className="mono">to</td><td>ISO date</td><td>No</td><td>now</td><td>Filter jobs submitted at or before this date.</td></tr>
            <tr><td className="mono">limit</td><td>number</td><td>No</td><td>50</td><td>Maximum records to return. Hard cap: 200.</td></tr>
            <tr><td className="mono">includeBatchDetail</td><td>boolean</td><td>No</td><td>true</td><td>Call <Ic>describeJobs()</Ic> to enrich in-progress jobs with real-time Batch status.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
