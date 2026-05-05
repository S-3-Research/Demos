import React from 'react'
import { Ic } from '../components'

export function DebugTab() {
  return (
    <>
      <div className="section-title">Debug Mode — Nav Screenshots</div>
      <div className="section-sub">
        Pass <Ic>options.debugNav: true</Ic> when submitting a job to enable per-iteration viewport screenshots inside <Ic>navigateToCheckoutSM</Ic>.
      </div>

      <div className="info-box">
        Screenshots are <strong>off by default</strong> in production (no <Ic>DEBUG_NAV</Ic> env var = zero overhead).
        When enabled, each screenshot is viewport-only (<Ic>fullPage: false</Ic>) — typically &lt;200 ms per capture in cloud environments.
      </div>

      {/* How it works */}
      <div className="section-title" style={{ marginTop: 28 }}>How It Works</div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
        Submitting with <Ic>{'{"options":{"debugNav":true}}'}</Ic> injects <Ic>DEBUG_NAV=1</Ic> into the Batch container environment,
        activating screenshot mode inside the state machine. Two screenshots are taken per iteration and written to <Ic>artifactDir</Ic>
        alongside all other artifacts.
      </p>

      <table className="data-table">
        <thead>
          <tr><th>Timing</th><th>Filename pattern</th><th>Content</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>After <Ic>detectPageState()</Ic> returns</td>
            <td className="mono">nav-iter-01-PRODUCT_PAGE-detect.png</td>
            <td>Page state at detection time</td>
          </tr>
          <tr>
            <td>After action + settle wait</td>
            <td className="mono">nav-iter-01-PRODUCT_PAGE-after_clickViewCart.png</td>
            <td>Result of the executed action</td>
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
        Files are zero-padded by iteration number — sorting by name in any file browser reconstructs the full navigation flow.
        The terminal state (e.g. <Ic>CHECKOUT_PAYMENT_STEP</Ic>) only gets a <Ic>-detect</Ic> screenshot; there is no <em>after</em> shot.
      </p>

      {/* Submit via API */}
      <div className="section-title" style={{ marginTop: 28 }}>Submit a Debug Job (Cloud)</div>
      <pre style={{ fontSize: 12, background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', overflowX: 'auto', marginBottom: 8 }}>{`curl -X POST \\
  -H "x-api-key: <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com/product/foo","options":{"debugNav":true}}' \\
  "https://dksxsk0f39.execute-api.us-west-2.amazonaws.com/v1/jobs/submit"`}</pre>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 0 }}>
        Screenshots upload to S3 with all other artifacts. Use <Ic>GET /artifacts?s3Uri=s3://…</Ic> to get a presigned download URL.
      </p>

      {/* Local Docker */}
      <div className="section-title" style={{ marginTop: 28 }}>Local Docker Test</div>
      <pre style={{ fontSize: 12, background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', overflowX: 'auto', marginBottom: 8 }}>{`docker run --rm \\
  -e TARGET_URL="https://example.com/product/foo" \\
  -e DEBUG_NAV=1 \\
  -v $(pwd)/debug-out:/app/artifacts \\
  payment-detection:batch-local
# screenshots land in ./debug-out/`}</pre>

      {/* Example filenames */}
      <div className="section-title" style={{ marginTop: 28 }}>Example Screenshot Files</div>
      <pre style={{ fontSize: 12, background: 'var(--bg-secondary)', borderRadius: 8, padding: '12px 14px', overflowX: 'auto' }}>{`nav-iter-01-PRODUCT_PAGE-detect.png
nav-iter-01-PRODUCT_PAGE-after_clickViewCart.png
nav-iter-02-CART_PAGE-detect.png
nav-iter-02-CART_PAGE-after_clickCheckoutButton.png
nav-iter-03-CHECKOUT_PAGE-detect.png
nav-iter-03-CHECKOUT_PAGE-after_fillContactInfo.png
nav-iter-04-CHECKOUT_PAYMENT_STEP-detect.png   ← terminal, no after shot`}</pre>
    </>
  )
}
