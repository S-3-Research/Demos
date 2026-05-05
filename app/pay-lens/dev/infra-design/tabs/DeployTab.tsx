import React from 'react'
import { Ic, CodeBlock } from '../components'
import { CODE } from '../data'

export function DeployTab() {
  return (
    <>
      <div className="section-title">Deployment Pipeline</div>
      <div className="section-sub">Always use <Ic>bash deploy.sh</Ic> — it resolves exact ECR sha256 digests so CloudFormation detects image changes.</div>
      <div className="warn-box">
        ⚠️ <strong>Never</strong> run <Ic>cdk deploy</Ic> directly with <Ic>:latest</Ic> tag — CloudFormation won&apos;t detect image changes and the Lambda won&apos;t update. Always deploy via <Ic>deploy.sh</Ic> which passes <Ic>sha256:...</Ic> digest as CDK context.
      </div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>deploy.sh — 4 Steps</div>
        <div className="timeline">
          <div className="tl-item">
            <div className="tl-line"><div className="tl-dot" /><div className="tl-connector" /></div>
            <div className="tl-content">
              <div className="tl-label">Step 1</div>
              <div className="tl-title">ECR Login + Docker Build (two targets)</div>
              <div className="tl-desc">Builds <Ic>--target batch</Ic> → <Ic>ECR:batch</Ic> and <Ic>--target lambda-runtime</Ic> → <Ic>ECR:lambda</Ic>. Platform: linux/amd64.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-line"><div className="tl-dot" /><div className="tl-connector" /></div>
            <div className="tl-content">
              <div className="tl-label">Step 2</div>
              <div className="tl-title">Resolve sha256 digests from ECR</div>
              <div className="tl-desc">Queries ECR for exact digest of each pushed tag. Separate digest for <Ic>:lambda</Ic> and <Ic>:batch</Ic>.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-line"><div className="tl-dot" /><div className="tl-connector" /></div>
            <div className="tl-content">
              <div className="tl-label">Step 3</div>
              <div className="tl-title">CDK deploy --all with digest context</div>
              <div className="tl-desc"><Ic>npx cdk deploy --all --context imageTag=sha256:… --context batchImageTag=sha256:…</Ic>. CloudFormation detects the digest change and updates Lambda + Batch Job Definition.</div>
            </div>
          </div>
          <div className="tl-item">
            <div className="tl-line"><div className="tl-dot green" /></div>
            <div className="tl-content">
              <div className="tl-label">Step 4</div>
              <div className="tl-title">Force-update Lambda (belt-and-suspenders)</div>
              <div className="tl-desc"><Ic>aws lambda update-function-code --image-uri ECR@digest</Ic>. Directly updates Lambda even if CDK had no diff.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-grid card-grid-3">
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Full deploy</div>
          <CodeBlock code={CODE.deployFull} />
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>Build + push + CDK + Lambda update</div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>CDK only</div>
          <CodeBlock code={CODE.deployStack} />
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>Skip docker build/push, re-deploy CDK stacks</div>
        </div>
        <div className="card" style={{ marginBottom: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Lambda only</div>
          <CodeBlock code={CODE.deployLambda} />
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '8px' }}>Skip CDK, force-update Lambda function only</div>
        </div>
      </div>
      <hr className="divider" />
      <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Manual / First-time Deploy</div>
      <CodeBlock code={CODE.deployManual} />
    </>
  )
}
