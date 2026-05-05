'use client'
import React from 'react'
import { Lang, QUERIES_DATA, tt } from '../data'

interface Props {
  lang: Lang
  openModal: (key: string) => void
}

export function MatrixTab({ lang, openModal }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Availability × Confidence Matrix', '可用性 × 置信度矩阵')}</div>
      <div className="dv-section-sub">{L('Click a cell to see business meaning and query examples', '点击格子查看业务含义与查询示例')}</div>

      <div className="dv-matrix-grid">
        <div className="dv-matrix-header" style={{ background: 'transparent' }} />
        <div className="dv-matrix-header">✅ available = true</div>
        <div className="dv-matrix-header">❌ available = false</div>

        {[
          { rowLabel: 'HIGH', rowCls: 'dv-conf-high',
            cells: [
              { id: 'cell-hh-t', emoji: '✅', title: L('Confirmed Available', '已确认可用'), desc: L('API called / DOM visible & clickable\ne.g. Stripe main flow', 'API 被调用 / DOM visible & 可点击\ne.g. Stripe 主流程'), cls: 'dv-cell-confirmed' },
              { id: 'cell-hh-f', emoji: '⚠️', title: L('Integrated but Hidden', '已集成，但隐藏'), desc: L('API called / radio exists, but CSS hidden\ne.g. Apple Pay', 'API 调用 / radio 存在，但 CSS 隐藏\ne.g. Apple Pay'), cls: 'dv-cell-hidden' },
            ]
          },
          { rowLabel: 'MEDIUM', rowCls: 'dv-conf-medium',
            cells: [
              { id: 'cell-md-t', emoji: '🟡', title: L('Likely Available', '可能可用'), desc: L('SDK loaded / Logo visible\nbut no API call\ne.g. newly integrated gateway', 'SDK 已加载 / Logo 可见\n但无 API 调用\ne.g. 新接入的网关'), cls: 'dv-cell-likely' },
              { id: 'cell-md-f', emoji: '🔶', title: L('Status Unclear', '状态不明'), desc: L('script exists but no visible node\ne.g. A/B test disabled', 'script 存在但无可见节点\ne.g. A/B 测试关闭'), cls: 'dv-cell-unclear' },
            ]
          },
          { rowLabel: 'LOW', rowCls: 'dv-conf-low',
            cells: [
              { id: 'cell-lw-t', emoji: '🔵', title: L('Weak Signal', '弱信号'), desc: L('HTML source regex match, DOM happens to be visible\ne.g. footer mention', 'HTML 源码匹配，恰好 DOM 可见\ne.g. footer 提及'), cls: 'dv-cell-weak' },
              { id: 'cell-lw-f', emoji: '❌', title: L('Low Value, Ignorable', '低价值，可忽略'), desc: L('Mentioned in source but not rendered\nand no network requests', '源码中提到但未渲染\n也无任何网络请求'), cls: 'dv-cell-ignorable' },
            ]
          },
        ].map(row => (
          <React.Fragment key={row.rowLabel}>
            <div className="dv-matrix-row-label"><span className={row.rowCls}>{row.rowLabel}</span></div>
            {row.cells.map(cell => (
              <div key={cell.id} className={`dv-matrix-cell ${cell.cls}`} onClick={() => openModal(cell.id)}>
                <div className="dv-cell-emoji">{cell.emoji}</div>
                <div className="dv-cell-title">{cell.title}</div>
                <div className="dv-cell-desc" style={{ whiteSpace: 'pre-line' }}>{cell.desc}</div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 16, marginBottom: 14 }}>{L('Business Query Examples', '业务查询示例')}</div>
      <div className="dv-card-grid dv-card-grid-2">
        <div>
          {QUERIES_DATA.map((q, i) => (
            <div key={i} style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>{tt(q.q, lang)}</div>
              <code style={{ fontSize: 11, color: 'var(--accent)' }}>{q.filter}</code>
            </div>
          ))}
        </div>
        <div className="dv-card">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{L('Availability Derivation Logic', '可用性推导逻辑')}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div>{L('① Filter signals that include a visible field (DOM signals)', '① 过滤出含 visible 字段的 DOM 信号')}</div>
            <div>{L('② DOM signal count = 0 → ', '② DOM 信号数 = 0 → ')}<strong style={{ color: 'var(--red)' }}>available = false</strong>{L(' (network/text only)', '（仅网络/文本匹配）')}</div>
            <div>{L('③ Any DOM signal visible = true → ', '③ 任意 DOM 信号 visible = true → ')}<strong style={{ color: 'var(--green)' }}>available = true</strong></div>
            <div>{L('④ All DOM signals visible = false → ', '④ 所有 DOM 信号 visible = false → ')}<strong style={{ color: 'var(--red)' }}>available = false</strong><br />&nbsp;&nbsp;&nbsp;{'unavailableReason = \'css-hidden\''}</div>
          </div>
          <hr className="dv-divider" style={{ margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>unavailableReason {L('Enum', '枚举')}</div>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div><code>css-hidden</code> — {L('node exists but getComputedStyle deems it invisible', '节点存在但 getComputedStyle 判定不可见')}</div>
            <div><code>browser-unsupported</code> — {L('not supported by browser (e.g. Apple Pay on non-Safari)', '浏览器不支持（如非 Safari 的 Apple Pay）')}</div>
            <div><code>session-check-failed</code> — {L('canMakePayments() returned false', 'canMakePayments() 返回 false')}</div>
            <div><code>not-rendered</code> — {L('network/text match only, no DOM node', '仅网络/文本匹配，无 DOM 节点')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
