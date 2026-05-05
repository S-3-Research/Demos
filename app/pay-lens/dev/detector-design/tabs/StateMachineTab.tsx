'use client'
import React from 'react'
import { Lang, STATES_DATA, TRANSITIONS_DATA, RR_STEPS, tt } from '../data'

interface Props {
  lang: Lang
  rrActive: number
  rrUsed: number[]
  rrStatus: string
  simulateRR: () => void
}

export function StateMachineTab({ lang, rrActive, rrUsed, rrStatus, simulateRR }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Checkout Navigation State Machine', '结账导航状态机')}</div>
      <div className="dv-section-sub">{L('navigateToCheckoutSM() — non-fixed sequence, re-detects page state each iteration', 'navigateToCheckoutSM() — 非固定序列，每次迭代重新检测页面状态')}</div>

      <div className="dv-info-box">
        <strong>{L('Each iteration loop:', '每次迭代循环：')}</strong>{' '}
        {L('① Detect current state', '① 检测当前状态')} → {L('② Handle terminal conditions', '② 处理终止条件')} → {L('③ Execute next action', '③ 执行下一个动作')} → {L('④ Wait for DOM stability', '④ 等待 DOM 稳定')} → {L('⑤ Repeat', '⑤ 重复')}
      </div>

      <div className="dv-section-title" style={{ fontSize: 15, marginBottom: 12 }}>{L('Page States', '页面状态')}</div>
      <div className="dv-sm-legend">
        {[
          { color: 'var(--green)', label: L('Terminal (success)', '终止(成功)') },
          { color: 'var(--red)', label: L('Terminal (fail)', '终止(失败)') },
          { color: 'var(--yellow)', label: L('Warning', '注意') },
          { color: 'var(--border)', label: L('Transitional', '过渡状态') },
        ].map(item => (
          <div key={item.label} className="dv-sm-legend-item">
            <div className="dv-sm-dot" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="dv-states-grid">
        {STATES_DATA.map(s => {
          const borderColor = s.cls === 'success' ? 'rgba(29,125,69,.25)' : s.cls === 'fail' ? 'rgba(181,42,28,.25)' : s.cls === 'warn' ? 'rgba(142,96,0,.25)' : 'var(--border)'
          const termColor = s.cls === 'success' ? 'var(--green)' : s.cls === 'fail' ? 'var(--red)' : 'var(--yellow)'
          return (
            <div key={s.code} className="dv-state-card" style={{ borderColor }}>
              <div className="dv-state-code">{s.code}</div>
              <div className="dv-state-desc">{tt(s.desc, lang)}</div>
              {s.terminal && <div className="dv-state-terminal" style={{ color: termColor }}>{tt(s.terminal, lang)}</div>}
            </div>
          )
        })}
      </div>

      <div className="dv-section-title" style={{ fontSize: 15, marginBottom: 12 }}>{L('State Detection Order (detectPageState)', '状态检测顺序 (detectPageState)')}</div>
      <div className="dv-card" style={{ maxWidth: 700, padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
          {[
            { num: 1, bg: 'rgba(181,42,28,.09)', color: 'var(--red)', state: 'SIGN_IN_WALL', desc: L('URL matches /login /sign-in /my-account, or visible password input (non-payment card field)', 'URL 匹配 /login /sign-in /my-account，或存在可见密码输入框（非支付卡字段）') },
            { num: 2, bg: 'rgba(134,134,139,.09)', color: 'var(--low)', state: 'BLOCKED_MODAL', desc: L('Disabled — high false-positive rate; age verification/cookie popups handled upstream', '已禁用 — 误报率高，年龄验证/Cookie 弹窗已在上游处理') },
            { num: 3, bg: 'rgba(29,125,69,.09)', color: 'var(--green)', state: 'CHECKOUT_PAYMENT_STEP', desc: L('URL contains "checkout"/"order" AND at least one payment option element is visible (getComputedStyle check)', 'URL 含 "checkout"/"order" 且至少一个支付选项元素可见（getComputedStyle 检查）') },
            { num: 4, bg: 'rgba(0,113,227,.08)', color: 'var(--accent)', state: 'CART_PAGE / CART_EMPTY', desc: L('URL matches /cart /basket /shopping-cart /bag — CART_ITEM_SELECTOR finds element → CART_PAGE; = 0 → CART_EMPTY', 'URL 匹配 /cart /basket /shopping-cart /bag — CART_ITEM_SELECTOR 找到元素 → CART_PAGE；= 0 → CART_EMPTY') },
            { num: 5, bg: 'rgba(94,44,165,.08)', color: 'var(--purple)', state: 'PRODUCT_PAGE_ATC_DONE', desc: L('visible ATC success element (.woocommerce-message etc.)', '可见的 ATC 成功元素（.woocommerce-message 等）') },
            { num: 6, bg: 'rgba(94,44,165,.05)', color: 'var(--purple)', state: 'PRODUCT_PAGE', desc: L('ATC button or form present in DOM', 'DOM 中存在 ATC 按钮或表单') },
            { num: 7, bg: 'rgba(134,134,139,.08)', color: 'var(--low)', state: 'UNKNOWN', desc: L('None of the above match', '以上均不匹配') },
          ].map(row => (
            <div key={row.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ background: row.bg, color: row.color, padding: '2px 8px', borderRadius: 6, minWidth: 28, textAlign: 'center', fontWeight: 700, flexShrink: 0 }}>{row.num}</span>
              <div><strong>{row.state}</strong> — {row.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="dv-divider" />

      <div className="dv-card-grid dv-card-grid-2">
        <div>
          <div className="dv-section-title" style={{ fontSize: 15, marginBottom: 12 }}>{L('Round-Robin Scheduler', '轮转调度器 (Round-Robin)')}</div>
          <div className="dv-info-box">
            <strong>{L('Why round-robin?', '为什么轮转？')}</strong>{' '}{L('clickViewCart may open a side drawer (URL unchanged) that injects a checkout button. Round-robin ensures each action runs once per round.', 'clickViewCart 可能打开侧边抽屉（URL 不变），抽屉内注入了结账按钮。轮转确保每个动作每轮各执行一次。')}
          </div>
          <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>{L('Click "Simulate Round" to demo scheduling', '点击「模拟一轮」演示调度过程')}</div>
          <div className="dv-rr-viz">
            {RR_STEPS.map((step, i) => (
              <React.Fragment key={step.id}>
                <div className={`dv-rr-action${rrActive === i ? ' active' : ''}${rrUsed.includes(i) ? ' used' : ''}`}>
                  {step.label}<br /><small style={{ color: 'var(--text-muted)' }}>{step.maxTries}</small>
                </div>
                {i < RR_STEPS.length - 1 && <div className="dv-rr-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
          <button className="dv-sim-btn" onClick={simulateRR}>{L('Simulate Round', '模拟一轮')}</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            {rrStatus || L('Click button to start simulation', '点击按钮开始模拟')}
          </div>
        </div>

        <div>
          <div className="dv-section-title" style={{ fontSize: 15, marginBottom: 12 }}>{L('Action Tiers & Max Attempts', '动作等级 & 最大尝试次数')}</div>
          <table className="dv-transition-table">
            <thead><tr><th>{L('Tier', '等级')}</th><th>{L('Action', '动作')}</th><th>{L('Max Tries', '最大尝试')}</th><th>{L('Schedule', '调度方式')}</th></tr></thead>
            <tbody>
              {[
                { tier: 1, action: 'fillContactInfo', max: `1 (${L('global', '全局')})`, sched: 'Round-Robin' },
                { tier: 1, action: 'clickCheckoutButton', max: '3', sched: 'Round-Robin' },
                { tier: 1, action: 'clickViewCart', max: '3', sched: 'Round-Robin' },
                { tier: 1, action: 'advanceCheckoutStep', max: '5', sched: 'Round-Robin' },
                { tier: 1, action: 'dismissModal', max: '3', sched: 'Round-Robin' },
                { tier: 2, action: 'directNavigateCart', max: '1', sched: L('Sequential (after Tier1 exhausted)', '顺序（Tier1耗尽后）') },
                { tier: 2, action: 'directNavigateCheckout', max: '1', sched: L('Sequential (after Tier1 exhausted)', '顺序（Tier1耗尽后）') },
              ].map((row, i) => (
                <tr key={i}>
                  <td><span className={`dv-action-tag ${row.tier === 1 ? 'dv-tier1' : 'dv-tier2'}`}>Tier {row.tier}</span></td>
                  <td>{row.action}</td>
                  <td>{row.max}</td>
                  <td style={{ fontSize: 11 }}>{row.sched}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="dv-divider" />
      <div className="dv-section-title" style={{ fontSize: 15, marginBottom: 12 }}>{L('State Transition Table', '状态转移表')}</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="dv-transition-table">
          <thead><tr><th>{L('State', '状态')}</th><th>{L('Tier 1 (Round-Robin)', 'Tier 1（轮转）')}</th><th>{L('Tier 2 (Last Resort)', 'Tier 2（最后手段）')}</th></tr></thead>
          <tbody>
            {TRANSITIONS_DATA.map(tr => (
              <tr key={tr.state}>
                <td><code style={{ fontSize: 12, color: 'var(--accent)' }}>{tr.state}</code></td>
                <td>{tr.t1.map(a => <span key={a} className="dv-action-tag dv-tier1" style={{ marginRight: 2 }}>{a}</span>)}</td>
                <td>{tr.t2.length ? tr.t2.map(a => <span key={a} className="dv-action-tag dv-tier2" style={{ marginRight: 2 }}>{a}</span>) : <span style={{ color: 'var(--border)' }}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="dv-divider" />
      <div className="dv-card-grid dv-card-grid-2">
        <div className="dv-card">
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Post-Action Wait Strategy</div>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(0,113,227,.05)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(0,113,227,.1)' }}>
              <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>{L('URL Changed', 'URL 已改变')}</div>
              {"waitForLoadState('domcontentloaded') + 3s cap"}
            </div>
            <div style={{ background: 'rgba(94,44,165,.05)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(94,44,165,.1)' }}>
              <div style={{ color: 'var(--purple)', fontWeight: 700, marginBottom: 4 }}>{L('URL Unchanged', 'URL 未改变')}</div>
              {L('waitForTimeout(1200ms) — wait for AJAX / drawer injection to settle', 'waitForTimeout(1200ms) — 等待 AJAX / 抽屉注入稳定')}
            </div>
          </div>
        </div>
        <div className="dv-card">
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>fillContactInfo {L('Performance Optimizations', '性能优化')}</div>
          <div className="dv-perf-compare">
            <div className="dv-perf-side dv-perf-before">
              <div className="dv-perf-label">{L('Before', '优化前')}</div>
              <div className="dv-perf-item"><strong>{L('Form absent', '表单缺失')}</strong> <span className="dv-time-badge dv-time-slow">~10s</span><br />{L('waitForSelector timeout', 'waitForSelector 超时')}</div>
              <div className="dv-perf-item"><strong>combobox</strong> <span className="dv-time-badge dv-time-slow">~500ms</span><br />{L('char-by-char type + 40ms delay', '逐字符 type + 40ms 延迟')}</div>
              <div className="dv-perf-item"><strong>{L('After each field', '每字段后')}</strong> <span className="dv-time-badge dv-time-slow">80ms</span><br />waitForTimeout</div>
            </div>
            <div className="dv-perf-side dv-perf-after">
              <div className="dv-perf-label">{L('After', '优化后')}</div>
              <div className="dv-perf-item"><strong>{L('Form absent', '表单缺失')}</strong> <span className="dv-time-badge dv-time-fast">&lt;50ms</span><br />{L('evaluate check + 800ms buffer', 'evaluate 检查 + 800ms 补窗')}</div>
              <div className="dv-perf-item"><strong>combobox</strong> <span className="dv-time-badge dv-time-fast">~0ms</span><br />keyboard.type(delay:0)</div>
              <div className="dv-perf-item"><strong>{L('After each field', '每字段后')}</strong> <span className="dv-time-badge dv-time-fast">{L('removed', '移除')}</span><br />{L('direct value confirmation', '直接读值确认')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
