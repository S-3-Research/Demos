'use client'
import { Lang } from '../data'

interface Props {
  lang: Lang
  openModal: (key: string) => void
}

export function PathsTab({ lang, openModal }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Four Detection Paths', '四大检测路径')}</div>
      <div className="dv-section-sub">{L('All paths write to the same shared entityMap; signals are deduplicated automatically', '所有路径写入同一个共享 entityMap，信号自动去重')}</div>
      <div className="dv-card-grid dv-card-grid-2">
        <div className="dv-path-card" onClick={() => openModal('path1')}>
          <div className="dv-path-icon">🌐</div>
          <div className="dv-path-name">{L('Path 1 — Network Request URL', 'Path 1 — 网络请求 URL')}</div>
          <span className="dv-path-timing dv-timing-realtime">{L('Real-time', '实时监听')}</span>
          <div className="dv-path-desc">{L('Registered before page.goto(). Captures every request from the first byte, auto-hooks new tabs.', '在 page.goto() 之前注册。捕获从第一个字节开始的每一条请求，自动 hook 新 Tab。')}</div>
          <div className="dv-path-signals">
            <span className="dv-sig-tag" style={{ background: 'rgba(0,113,227,.08)', color: 'var(--accent)' }}>request-url</span>
            <span className="dv-sig-tag" style={{ background: 'rgba(0,113,227,.06)', color: '#0071e3' }}>html-script-src</span>
          </div>
        </div>

        <div className="dv-path-card" onClick={() => openModal('path2')}>
          <div className="dv-path-icon">📄</div>
          <div className="dv-path-name">{L('Path 2 — Full-Page HTML Regex', 'Path 2 — 全页面 HTML 正则')}</div>
          <span className="dv-path-timing dv-timing-sweep">{L('Sweep Phase', '收集阶段扫描')}</span>
          <div className="dv-path-desc">{L('collectAllHtml() aggregates current page + all frames + all open tabs HTML, then regex-matches signatures.', 'collectAllHtml() 汇总当前页 + 所有 frame + 所有开放 Tab 的 HTML，再用正则匹配签名。')}</div>
          <div className="dv-path-signals">
            <span className="dv-sig-tag" style={{ background: 'rgba(29,125,69,.09)', color: 'var(--green)' }}>html-text</span>
          </div>
        </div>

        <div className="dv-path-card" onClick={() => openModal('path3')}>
          <div className="dv-path-icon">🔬</div>
          <div className="dv-path-name">{L('Path 3 — Precise DOM Query', 'Path 3 — 精准 DOM 查询')}</div>
          <span className="dv-path-timing dv-timing-sweep">{L('Sweep Phase', '收集阶段扫描')}</span>
          <div className="dv-path-desc">{L('Single page.evaluate() round-trip, batch queries for radio/logo/data-attr/script, visibility check on each node.', 'page.evaluate() 单次往返，批量查询 radio/logo/data-attr/script，每个节点进行可见性检查。')}</div>
          <div className="dv-path-signals">
            <span className="dv-sig-tag" style={{ background: 'rgba(94,44,165,.08)', color: 'var(--purple)' }}>html-radio</span>
            <span className="dv-sig-tag" style={{ background: 'rgba(94,44,165,.07)', color: 'var(--purple)' }}>html-logo</span>
            <span className="dv-sig-tag" style={{ background: 'rgba(94,44,165,.06)', color: 'var(--purple)' }}>html-attribute</span>
            <span className="dv-sig-tag" style={{ background: 'rgba(94,44,165,.05)', color: 'var(--purple)' }}>html-script-src</span>
          </div>
        </div>

        <div className="dv-path-card" onClick={() => openModal('path4')}>
          <div className="dv-path-icon">📡</div>
          <div className="dv-path-name">{L('Path 4 — Response JSON Allowlist', 'Path 4 — 响应 JSON 白名单')}</div>
          <span className="dv-path-timing dv-timing-realtime">{L('Real-time', '实时监听')}</span>
          <div className="dv-path-desc">{L('Parses JSON body after response URL matches allowlist, extracts structured fields. Most authoritative signal source.', '响应 URL 匹配白名单后解析 JSON body，提取结构化字段。最权威的信号来源。')}</div>
          <div className="dv-path-signals">
            <span className="dv-sig-tag" style={{ background: 'rgba(184,64,0,.09)', color: 'var(--orange)' }}>response-json</span>
          </div>
          <div style={{ marginTop: 14, overflowX: 'auto' }}>
            <table style={{ fontSize: 11, width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ color: 'var(--text-muted)' }}><th style={{ padding: '4px 6px', textAlign: 'left' }}>{L('Signature', '签名')}</th><th style={{ padding: '4px 6px', textAlign: 'left' }}>{L('URL fragment', 'URL 片段')}</th><th style={{ padding: '4px 6px', textAlign: 'left' }}>{L('Extracted fields', '提取字段')}</th></tr></thead>
              <tbody>
                <tr><td style={{ padding: '4px 6px' }}>Stripe</td><td style={{ padding: '4px 6px', fontFamily: 'monospace' }}>/v1/elements/sessions</td><td style={{ padding: '4px 6px' }}>payment_method_types</td></tr>
                <tr><td style={{ padding: '4px 6px' }}>Stripe</td><td style={{ padding: '4px 6px', fontFamily: 'monospace' }}>/v1/payment_intents</td><td style={{ padding: '4px 6px' }}>card_brand, wallet_type</td></tr>
                <tr><td style={{ padding: '4px 6px' }}>Adyen</td><td style={{ padding: '4px 6px', fontFamily: 'monospace' }}>/v68/sessions</td><td style={{ padding: '4px 6px' }}>paymentMethods[].name</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 16 }}>{L('collectEvidence() Call Timing', 'collectEvidence() 调用时机')}</div>
      <div className="dv-info-box" style={{ marginTop: 12 }}>
        <strong>{L('3 call sites', '三处调用')}</strong>{L(', deduplication via upsertEntity():', '，配合 upsertEntity() 去重：')}<br />
        {L('① Step 5 iteration callback — after clicking each payment radio', '① Step 5 迭代回调 — 点击每个支付 radio 后')}<br />
        {L('② Step 5 fallback path — after selectCardPaymentOption() succeeds', '② Step 5 回退路径 — selectCardPaymentOption() 成功后')}<br />
        {L('③ Step 6 — always runs regardless of Step 5 result', '③ Step 6 — 始终执行，无论 Step 5 结果如何')}
      </div>
    </div>
  )
}
