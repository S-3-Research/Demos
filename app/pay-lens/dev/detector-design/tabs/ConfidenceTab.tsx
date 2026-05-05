'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from 'recharts'
import { Lang, CONF_CHART_DATA } from '../data'

interface Props { lang: Lang }

export function ConfidenceTab({ lang }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Confidence Rules', '置信度规则')}</div>
      <div className="dv-section-sub">{L('Entity confidence = highest level among all its signals', '实体置信度 = 其所有信号中最高的那个级别')}</div>
      <div className="dv-card-grid dv-card-grid-2">
        <div className="dv-card">
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>{L('Confidence Level Mapping', '置信度等级映射')}</div>
          {[
            {
              label: 'HIGH', cls: 'dv-conf-high', width: '90%', fill: '#1d7d45',
              items: [
                { label: 'response-json', bg: 'rgba(29,125,69,.09)', color: 'var(--green)', tip: L('Server-side payment config, most authoritative', '服务端支付配置，最权威') },
                { label: 'html-radio', bg: 'rgba(29,125,69,.07)', color: 'var(--green)', tip: L('User-visible payment option DOM node', '用户可见的支付选项 DOM 节点') },
                { label: 'request-url (api)', bg: 'rgba(29,125,69,.05)', color: 'var(--green)', tip: L('Actual API call e.g. POST /v1/payment_intents', '实际 API 调用如 POST /v1/payment_intents') },
              ]
            },
            {
              label: 'MED', cls: 'dv-conf-medium', width: '55%', fill: '#8e6000',
              items: [
                { label: 'request-url (cdn)', bg: 'rgba(142,96,0,.09)', color: 'var(--yellow)', tip: L('CDN/SDK load, e.g. js.stripe.com', 'CDN/SDK 加载，如 js.stripe.com') },
                { label: 'html-script-src', bg: 'rgba(142,96,0,.07)', color: 'var(--yellow)', tip: L('script src present, but activation unconfirmed', 'script src 存在，但未确认激活') },
                { label: 'html-radio-label', bg: 'rgba(142,96,0,.05)', color: 'var(--yellow)', tip: L('Label text match, may be description text only', '标签文字匹配，可能只是说明文案') },
                { label: 'html-logo', bg: 'rgba(142,96,0,.04)', color: 'var(--yellow)', tip: L("Logo presence doesn't mean method is selectable", 'Logo 展示不代表方法可选') },
                { label: 'html-attribute', bg: 'rgba(142,96,0,.03)', color: 'var(--yellow)', tip: L('data-* attributes may be styling config', 'data-* 属性可能是样式配置') },
              ]
            },
            {
              label: 'LOW', cls: 'dv-conf-low', width: '20%', fill: '#86868b',
              items: [
                { label: 'html-text', bg: 'rgba(134,134,139,.1)', color: 'var(--low)', tip: L('HTML source regex, may match comments/dead code', 'HTML 源码正则，可能是注释/死代码') },
              ]
            },
          ].map(row => (
            <div className="dv-conf-row" key={row.label}>
              <div className={`dv-conf-label ${row.cls}`}>{row.label}</div>
              <div className="dv-conf-bar"><div className="dv-conf-fill" style={{ width: row.width, background: row.fill }} /></div>
              <div className="dv-conf-via-list">
                {row.items.map(item => (
                  <span key={item.label} className="dv-conf-via-item" style={{ background: item.bg, color: item.color }} title={item.tip}>{item.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="dv-card">
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{L('URL Heuristic Classification (request-url only)', 'URL 启发式分类 (仅 request-url)')}</div>
          <div className="dv-heuristic">
            <div className="dv-h-row">
              <div className="dv-h-input">{L('subdomain: js. / cdn. / static. / assets. / widget.\nor path ends with .js / .css', 'subdomain: js. / cdn. / static. / assets. / widget.\n或 路径以 .js / .css 结尾')}</div>
              <div className="dv-h-arrow">→</div>
              <div className="dv-h-result dv-h-cdn">CDN<br /><small style={{ fontWeight: 400, fontSize: 10 }}>medium</small></div>
            </div>
            <div className="dv-h-row">
              <div className="dv-h-input">{L('subdomain: api. / hooks. / checkout. / secure. / gateway. / pay.\nor path contains /v1/ /api/ /payment /intent…\nor method = POST / PUT / PATCH', 'subdomain: api. / hooks. / checkout. / secure.\n或 路径含 /v1/ /api/ /payment /intent…\n或 method = POST / PUT / PATCH')}</div>
              <div className="dv-h-arrow">→</div>
              <div className="dv-h-result dv-h-api">API<br /><small style={{ fontWeight: 400, fontSize: 10 }}>high</small></div>
            </div>
            <div className="dv-h-row">
              <div className="dv-h-input">{L('All other cases', '其他所有情况')}</div>
              <div className="dv-h-arrow">→</div>
              <div className="dv-h-result dv-h-unk">unknown<br /><small style={{ fontWeight: 400, fontSize: 10 }}>medium</small></div>
            </div>
          </div>
          <div className="dv-info-box" style={{ marginTop: 14 }}>
            <strong>{L('Formula: ', '公式：')}</strong>entity.confidence = max( signalConfidence(s) for s in signals )
          </div>
        </div>
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 16, marginBottom: 16 }}>{L('Confidence Distribution Chart', '置信度分布图')}</div>
      <div className="dv-card" style={{ maxWidth: 520 }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CONF_CHART_DATA} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.07)" horizontal={false} />
            <XAxis type="number" domain={[0, 3.5]} tick={{ fill: '#86868b', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#3a3a3c', fontSize: 11 }} width={130} />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
              {CONF_CHART_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
