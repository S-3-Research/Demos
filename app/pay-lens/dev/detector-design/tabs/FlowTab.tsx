'use client'
import React from 'react'
import { Lang, Tab } from '../data'

interface Props {
  lang: Lang
  openModal: (key: string) => void
  switchTab: (tab: Tab) => void
}

export function FlowTab({ lang, openModal, switchTab }: Props) {
  const L = (en: string, zh: string) => lang === 'en' ? en : zh

  return (
    <div>
      <div className="dv-section-title">{L('Detection Flow', '检测总流程')}</div>
      <div className="dv-section-sub">{L('Complete automated pipeline from product URL to output files — click each step for details', '从产品 URL 到输出文件的完整自动化流水线 — 点击每个步骤查看详情')}</div>
      <div className="dv-flow-wrap">
        <div className="dv-flow">
          <div className="dv-flow-node init" onClick={() => openModal('init')}>
            <div className="dv-step-label">{L('🔌 Init', '🔌 初始化')}</div>
            <div className="dv-flow-row">
              <div>
                <div className="dv-step-title">{L('Register Network Listeners', '注册网络监听器')}</div>
                <div className="dv-step-desc">browser.newContext() · page.on('request') · context.on('page') · attachResponseListener()</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          {[
            { key: 'step1', num: 1, title: L('Load Product Page', '加载产品页'), desc: "page.goto(productUrl) · waitUntil: domcontentloaded · dismissModals()", cls: '' },
            { key: 'step2', num: 2, title: L('Select Available Variant', '选择在售变体'), desc: L('Skip "sold out" options · supports <select> / radio / swatch', '跳过 "sold out" 选项 · 支持 <select> / radio / swatch'), cls: '' },
            { key: 'step3', num: 3, title: L('Add to Cart (ATC)', '加入购物车 (ATC)'), desc: L('Multi-platform selector compat · skip disabled buttons · watch for new Tab', '多平台选择器兼容 · 跳过禁用按钮 · 监听新 Tab'), cls: '' },
          ].map(s => (
            <React.Fragment key={s.key}>
              <div className={`dv-flow-node ${s.cls}`} onClick={() => openModal(s.key)}>
                <div className="dv-flow-row">
                  <span className="dv-step-num">{s.num}</span>
                  <div>
                    <div className="dv-step-title">{s.title}</div>
                    <div className="dv-step-desc">{s.desc}</div>
                  </div>
                </div>
              </div>
              <div className="dv-flow-arrow">↓</div>
            </React.Fragment>
          ))}

          <div className="dv-flow-node warning" onClick={() => switchTab('statemachine')}>
            <div className="dv-flow-row">
              <span className="dv-step-num">4</span>
              <div>
                <div className="dv-step-title">{L('Navigate to Checkout → State Machine', '导航到结账页 → 状态机')}</div>
                <div className="dv-step-desc">{L('navigateToCheckoutSM() · fill contact/address info · target: CHECKOUT_PAYMENT_STEP', 'navigateToCheckoutSM() · 填写联系/地址信息 · 目标: CHECKOUT_PAYMENT_STEP')}</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          <div className="dv-flow-node" onClick={() => openModal('step5')}>
            <div className="dv-flow-row">
              <span className="dv-step-num">5</span>
              <div>
                <div className="dv-step-title">{L('Select Card Payment Option', '选择卡支付选项')}</div>
                <div className="dv-step-desc">{L('iteratePaymentOptions() · click each radio → collectEvidence() · fallback: selectCardPaymentOption()', 'iteratePaymentOptions() · 点击每个 radio → collectEvidence() · 回退: selectCardPaymentOption()')}</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          <div className="dv-flow-node success" onClick={() => openModal('step6')}>
            <div className="dv-flow-row">
              <span className="dv-step-num">6</span>
              <div>
                <div className="dv-step-title">{L('Collect Evidence (Always Runs)', '收集证据 (始终执行)')}</div>
                <div className="dv-step-desc">collectEvidence() = collectAllHtml() + matchSignaturesInHtml() + scanDomForEntities()</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          <div className="dv-flow-node" onClick={() => openModal('finalise')}>
            <div className="dv-flow-row">
              <div>
                <div className="dv-step-title">🧮 finaliseEntities()</div>
                <div className="dv-step-desc">{L('deriveAvailability() · sorted by confidence + signal count', 'deriveAvailability() · 按置信度 + 信号数排序')}</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          <div className="dv-flow-node output" onClick={() => switchTab('output')}>
            <div className="dv-flow-row">
              <div>
                <div className="dv-step-title">{L('📁 Output Files', '📁 输出文件')}</div>
                <div className="dv-step-desc">result-summary.json · entities.json · network-log.json · evidence.csv · payment-page.html · .png</div>
              </div>
            </div>
          </div>
          <div className="dv-flow-arrow">↓</div>

          <div className="dv-flow-node cleanup">
            <div className="dv-flow-row">
              <div>
                <div className="dv-step-title">🧹 Cleanup (afterEach)</div>
                <div className="dv-step-desc">{L('All pages goto about:blank · close all pages · context.close() + 6s timeout guard (Stripe WebSocket)', '所有页面 goto about:blank · 关闭所有页 · context.close() + 6s 超时保护 (Stripe WebSocket)')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
