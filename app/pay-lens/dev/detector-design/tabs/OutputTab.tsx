'use client'
import React from 'react'
import { Lang, OUTPUT_FILES, tt } from '../data'

interface Props {
  lang: Lang
  openFileModal: (idx: number) => void
}

export function OutputTab({ lang, openFileModal }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Output Files', '输出文件')}</div>
      <div className="dv-section-sub">{L('Each test run writes to test-results/ directory, click to view field details', '每次测试运行写入 test-results/ 目录，点击查看字段说明')}</div>
      <div className="dv-output-grid">
        {OUTPUT_FILES.map((f, i) => (
          <div key={i} className="dv-output-file" onClick={() => openFileModal(i)}>
            <div className="dv-file-icon">{f.icon}</div>
            <div className="dv-file-name">{f.name}</div>
            <div className="dv-file-desc">{tt(f.desc, lang)}</div>
          </div>
        ))}
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 16, marginBottom: 14 }}>{L('Cleanup Flow (afterEach)', '清理流程 (afterEach)')}</div>
      <div className="dv-card" style={{ maxWidth: 560 }}>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([
            { step: 1, content: <React.Fragment>{L('All pages', '所有页面')} <code>goto(&apos;about:blank&apos;)</code></React.Fragment> },
            { step: 2, content: <React.Fragment>{L('Close all pages', '关闭所有页面')}</React.Fragment> },
            { step: 3, content: <div><code>Promise.race(context.close(), 6s timeout)</code><br /><span style={{ color: 'var(--text-muted)' }}>{L('Bypass Stripe WebSocket hang issue on m.stripe.com', '绕过 Stripe WebSocket 在 m.stripe.com 上的挂起问题')}</span></div> },
          ] as { step: number; content: React.ReactNode }[]).map(row => (
            <div key={row.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(181,42,28,.09)', color: 'var(--red)', border: '1px solid rgba(181,42,28,.18)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{row.step}</span>
              {row.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
