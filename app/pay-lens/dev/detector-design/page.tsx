'use client'
import React, { useState, useRef, useCallback } from 'react'

import { Lang, Tab, TAB_TITLES, TABS, MODALS, RR_STEPS, tt } from './data'
import { dvStyles } from './styles'
import { FlowTab } from './tabs/FlowTab'
import { PathsTab } from './tabs/PathsTab'
import { SignalsTab } from './tabs/SignalsTab'
import { ConfidenceTab } from './tabs/ConfidenceTab'
import { MatrixTab } from './tabs/MatrixTab'
import { StateMachineTab } from './tabs/StateMachineTab'
import { OutputTab } from './tabs/OutputTab'

export default function DetectorDesignPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeTab, setActiveTab] = useState<Tab>('flow')
  const [modal, setModal] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rrStatus, setRrStatus] = useState<string>('')
  const [rrActive, setRrActive] = useState<number>(-1)
  const [rrUsed, setRrUsed] = useState<number[]>([])
  const rrRunning = useRef(false)

  const L = useCallback((en: string, zh: string) => lang === 'en' ? en : zh, [lang])

  const openModal = (key: string) => { if (MODALS[key]) setModal(key) }
  const openFileModal = (idx: number) => openModal('file_' + idx)
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const simulateRR = () => {
    if (rrRunning.current) return
    rrRunning.current = true
    setRrUsed([])
    setRrActive(-1)
    setRrStatus(L('Running...', '正在执行...'))
    let i = 0
    const step = () => {
      if (i > 0) setRrUsed(prev => [...prev, i - 1])
      if (i < RR_STEPS.length) {
        setRrActive(i)
        setRrStatus(L(`Executing ${RR_STEPS[i].label} (${i + 1}/${RR_STEPS.length})`, `执行 ${RR_STEPS[i].label}（第 ${i + 1}/${RR_STEPS.length} 个）`))
        i++
        setTimeout(step, 800)
      } else {
        setRrActive(-1)
        setRrStatus(L('Round complete — roundUsed cleared, awaiting next round', '本轮结束 — roundUsed 清空，等待下轮'))
        setTimeout(() => {
          setRrUsed([])
          setRrStatus(L('Click button to start a new round', '点击按钮开始新一轮'))
          rrRunning.current = false
        }, 1200)
      }
    }
    setTimeout(step, 0)
  }

  return (
    <>
      <style>{dvStyles}</style>
      <div className={`dv-wrap lang-${lang}`}>

        {/* Sidebar overlay (mobile) */}
        <div className={`dv-sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`dv-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="dv-sidebar-logo">
            <h2>Gateway Detector</h2>
            <p>Visual Reference Guide</p>
          </div>
          <div className="dv-lang-toggle">
            <button className={`dv-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
            <button className={`dv-lang-btn${lang === 'zh' ? ' active' : ''}`} onClick={() => setLang('zh')}>中文</button>
          </div>
          <nav className="dv-nav">
            {TABS.map(tab => (
              <div key={tab.id} className={`dv-nav-item${activeTab === tab.id ? ' active' : ''}`} onClick={() => switchTab(tab.id)}>
                <span>{tab.icon}</span>
                <span>{L(tab.label.en, tab.label.zh)}</span>
              </div>
            ))}
          </nav>
          <div className="dv-sidebar-footer">
            <div>Playwright · TypeScript</div>
            <div>{L('4 Detection Paths · 9 Signal Types', '4 检测路径 · 9 种信号类型')}</div>
          </div>
        </aside>

        {/* Main */}
        <div className="dv-main">
          <div className="dv-topbar">
            <div className="dv-topbar-title">{L(TAB_TITLES[activeTab].en, TAB_TITLES[activeTab].zh)}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="dv-badge dv-badge-blue">Playwright</span>
              <span className="dv-badge dv-badge-green">TypeScript</span>
            </div>
          </div>

          <div className="dv-content">
            {activeTab === 'flow'         && <FlowTab lang={lang} openModal={openModal} switchTab={switchTab} />}
            {activeTab === 'paths'        && <PathsTab lang={lang} openModal={openModal} />}
            {activeTab === 'signals'      && <SignalsTab lang={lang} />}
            {activeTab === 'confidence'   && <ConfidenceTab lang={lang} />}
            {activeTab === 'matrix'       && <MatrixTab lang={lang} openModal={openModal} />}
            {activeTab === 'statemachine' && <StateMachineTab lang={lang} rrActive={rrActive} rrUsed={rrUsed} rrStatus={rrStatus} simulateRR={simulateRR} />}
            {activeTab === 'output'       && <OutputTab lang={lang} openFileModal={openFileModal} />}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="dv-menu-btn" onClick={() => setSidebarOpen(v => !v)}>☰</button>

        {/* Modal */}
        {modal && MODALS[modal] && (
          <div className="dv-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
            <div className="dv-modal">
              <div className="dv-modal-header">
                <div className="dv-modal-title">{tt(MODALS[modal].title, lang)}</div>
                <button className="dv-modal-close" onClick={() => setModal(null)}>✕</button>
              </div>
              <div className="dv-modal-body" dangerouslySetInnerHTML={{ __html: MODALS[modal].body }} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
