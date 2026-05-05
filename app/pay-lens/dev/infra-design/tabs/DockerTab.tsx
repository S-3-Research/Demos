import React from 'react'
import { Ic } from '../components'

export function DockerTab() {
  return (
    <>
      <div className="section-title">Dockerfile Design</div>
      <div className="section-sub">Three-stage multi-target build. <Ic>builder</Ic> compiles TypeScript. <Ic>batch</Ic> and <Ic>lambda-runtime</Ic> are the two deployable targets.</div>
      <div className="stages-grid" style={{ marginBottom: '24px' }}>
        <div className="stage-card stage-builder">
          <div className="stage-name">builder</div>
          <div className="stage-base">node:22-bookworm</div>
          <ul className="stage-steps">
            <li>npm ci (all deps incl. devDeps)</li>
            <li>tsc --project tsconfig.build.json</li>
            <li>Outputs: /app/dist/</li>
          </ul>
        </div>
        <div className="stage-card stage-batch">
          <div className="stage-name">batch</div>
          <div className="stage-base">node:20-bookworm-slim</div>
          <ul className="stage-steps">
            <li>apt-get chromium dependencies</li>
            <li>npm ci --omit=dev</li>
            <li>playwright install chromium</li>
            <li>COPY --from=builder dist/</li>
            <li>No --single-process flag</li>
          </ul>
          <div className="stage-cmd">CMD [&quot;node&quot;,&quot;dist/aws/batch-runner.js&quot;]</div>
        </div>
        <div className="stage-card stage-lambda">
          <div className="stage-name">lambda-runtime</div>
          <div className="stage-base">public.ecr.aws/lambda/nodejs:22</div>
          <ul className="stage-steps">
            <li>dnf install chromium deps (AL2023, no apt)</li>
            <li>PLAYWRIGHT_BROWSERS_PATH=/ms-playwright</li>
            <li>npm ci --omit=dev</li>
            <li>playwright install chromium</li>
            <li>COPY --from=builder dist/</li>
          </ul>
          <div className="stage-cmd" style={{ fontSize: '10px' }}>CDK overrides CMD to lambda-handler.handler</div>
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Lambda Chromium Startup Flags</div>
        <div className="info-box" style={{ marginBottom: '12px' }}>Lambda sandboxes forbid process forking. These flags are required — without them Chromium crashes on launch inside Lambda.</div>
        <table className="data-table">
          <thead><tr><th>Flag</th><th>Why required in Lambda</th><th>Needed in Batch?</th></tr></thead>
          <tbody>
            <tr><td className="mono">--single-process</td><td>Lambda prohibits fork() — Chrome&apos;s multi-process model would crash</td><td>❌ Not needed</td></tr>
            <tr><td className="mono">--no-zygote</td><td>Disables zygote child process spawner</td><td>❌ Not needed</td></tr>
            <tr><td className="mono">--no-sandbox</td><td>Lambda runs as root with restricted namespaces</td><td>✅ Also added</td></tr>
            <tr><td className="mono">--disable-setuid-sandbox</td><td>setuid binaries unavailable in Lambda</td><td>✅ Also added</td></tr>
            <tr><td className="mono">--disable-dev-shm-usage</td><td>/dev/shm is tiny in Lambda (64 MB)</td><td>✅ Also added</td></tr>
            <tr><td className="mono">--disable-gpu</td><td>No GPU in serverless environments</td><td>✅ Also added</td></tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Key Environment Variables</div>
        <table className="data-table">
          <thead><tr><th>Variable</th><th>Set in</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td className="mono">PLAYWRIGHT_BROWSERS_PATH</td><td>Dockerfile</td><td>Fixed to <Ic>/ms-playwright</Ic> — avoids Lambda home-dir lookup failure</td></tr>
            <tr><td className="mono">PRODUCT_URL</td><td>Batch container env</td><td>Target URL for Batch mode detection</td></tr>
            <tr><td className="mono">S3_BUCKET</td><td>CDK / task env</td><td>If not set, S3 upload is skipped (safe for local testing)</td></tr>
            <tr><td className="mono">DYNAMODB_TABLE</td><td>CDK / task env</td><td>If not set, DynamoDB write is skipped</td></tr>
            <tr><td className="mono">AWS_REGION</td><td>Lambda runtime auto-injects</td><td>Region for AWS SDK clients</td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
