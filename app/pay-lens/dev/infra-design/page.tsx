'use client'
import { useState } from 'react'

import { TabId, TABS } from './data'
import { infraStyles } from './styles'
import { ArchTab } from './tabs/ArchTab'
import { ModesTab } from './tabs/ModesTab'
import { LifecycleTab } from './tabs/LifecycleTab'
import { StacksTab } from './tabs/StacksTab'
import { ApiTab } from './tabs/ApiTab'
import { SchemaTab } from './tabs/SchemaTab'
import { DeployTab } from './tabs/DeployTab'
import { TestTab } from './tabs/TestTab'
import { DockerTab } from './tabs/DockerTab'
import { SrcTab } from './tabs/SrcTab'
import { DebugTab } from './tabs/DebugTab'

export default function InfraDesignVisual() {
  const [activeTab, setActiveTab] = useState<TabId>('arch')

  return (
    <div className="infra-page">
      <style>{infraStyles}</style>

      {/* Header */}
      <div className="header">
        <h1>Payment Detection — Infra Design</h1>
        <p>AWS architecture, deployment pipeline, and testing guide</p>
        <div className="badges">
          <span className="badge badge-blue">Lambda + ECR</span>
          <span className="badge badge-orange">AWS Batch / Fargate</span>
          <span className="badge badge-green">DynamoDB + S3</span>
          <span className="badge badge-purple">CDK (TypeScript)</span>
        </div>
      </div>

      {/* Tab Nav */}
      <nav className="tabs-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-pane active">
        {activeTab === 'arch'      && <ArchTab />}
        {activeTab === 'modes'     && <ModesTab />}
        {activeTab === 'lifecycle' && <LifecycleTab />}
        {activeTab === 'stacks'    && <StacksTab />}
        {activeTab === 'api'       && <ApiTab />}
        {activeTab === 'schema'    && <SchemaTab />}
        {activeTab === 'deploy'    && <DeployTab />}
        {activeTab === 'test'      && <TestTab />}
        {activeTab === 'docker'    && <DockerTab />}
        {activeTab === 'src'       && <SrcTab />}
        {activeTab === 'debug'     && <DebugTab />}
      </div>
    </div>
  )
}
