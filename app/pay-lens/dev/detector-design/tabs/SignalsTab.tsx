'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Lang, SIGNAL_DATA, SOURCE_CHART_DATA, CONF_COLOR } from '../data'

interface Props { lang: Lang }

export function SignalsTab({ lang }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Signal Types Overview', '信号类型一览')}</div>
      <div className="dv-section-sub">{L('visible field only applies to DOM signals', 'visible 字段仅对 DOM 信号有意义')}</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="dv-signal-table">
          <thead>
            <tr>
              <th>{L('via (signal source)', 'via (信号来源)')}</th>
              <th>source</th>
              <th>{L('Confidence', '置信度')}</th>
              <th>visible?</th>
              <th>{L('Typical rawValue', '典型 rawValue')}</th>
            </tr>
          </thead>
          <tbody>
            {SIGNAL_DATA.map((s, i) => (
              <tr key={i}>
                <td><span className={`dv-via-tag ${s.source === 'network' ? 'dv-via-net' : 'dv-via-html'}`}>{s.via}</span></td>
                <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: s.source === 'network' ? 'rgba(0,113,227,.08)' : 'rgba(94,44,165,.08)', color: s.source === 'network' ? 'var(--accent)' : 'var(--purple)' }}>{s.source}</span></td>
                <td><span style={{ color: CONF_COLOR[s.conf], fontWeight: 700, fontSize: 12 }}>{s.conf.toUpperCase()}</span></td>
                <td>{s.vis ? <><span className="dv-vis-dot dv-vis-yes" />{L('meaningful', '有意义')}</> : <><span className="dv-vis-dot dv-vis-no" />—</>}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.raw}>{s.raw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 16, marginBottom: 16 }}>{L('Signal Source Distribution', '信号来源分布（示意）')}</div>
      <div className="dv-card-grid dv-card-grid-2">
        <div className="dv-card">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={SOURCE_CHART_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {SOURCE_CHART_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Legend formatter={(v) => <span style={{ color: '#3a3a3c', fontSize: 13 }}>{lang === 'zh' ? (v === 'network signals' ? 'network 信号' : 'html 信号') : v}</span>} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dv-card">
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600 }}>{L('The meaning of visible per signal type', '可见性对信号的意义')}</div>
          <div className="dv-info-box">
            <strong>{L('DOM signals', 'DOM 信号')}</strong>{L(' (html-radio, html-logo, html-attribute, html-radio-label) include a ', '（html-radio, html-logo, html-attribute, html-radio-label）包含 ')}<code>visible</code>{L(' field, checked by walking up the ancestor chain with ', ' 字段，通过 ')}<code>getComputedStyle</code>{lang === 'zh' ? ' 逐级向上检查祖先节点。' : '.'}
          </div>
          <div className="dv-warn-box">
            <strong>{L('Network & text signals', '网络 & 文本信号')}</strong>{L(' (request-url, response-json, html-text, html-script-src) do not include a visible field — they don\'t correspond to a specific DOM node.', '（request-url, response-json, html-text, html-script-src）不含 visible 字段 — 因为它们不对应具体 DOM 节点。')}
          </div>
        </div>
      </div>
    </div>
  )
}
