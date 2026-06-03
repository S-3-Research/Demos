'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DemoPasswordModal from '@/components/DemoPasswordModal'
import { isDemoUnlockedClient } from '@/lib/demoAuth'

const NAV_ITEMS = [
  { href: '/pay-lens/dev/crawler-job',              label: 'Crawler Jobs',    icon: '🕷️' },
  { href: '/pay-lens/dev/detector-job',             label: 'Detector Jobs',   icon: '⚡' },
  { href: '/pay-lens/dev/detector-design',          label: 'Detector Design', icon: '🔍' },
  { href: '/pay-lens/dev/detector-infra-design',    label: 'Detector Infra Design',    icon: '🏗️' },
]

const css = `
  .dev-layout { display: flex; flex-direction: column; min-height: 100vh; background: #f5f5f7; --dev-nav-h: 45px; }
  .dev-nav {
    background: rgba(255,255,255,.92);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid rgba(0,0,0,.08);
    padding: 0 40px;
    display: flex;
    align-items: center;
    gap: 0;
    height: var(--dev-nav-h);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .dev-nav-brand {
    font-size: 13px;
    font-weight: 700;
    color: #1d1d1f;
    letter-spacing: -.2px;
    padding: 14px 0;
    margin-right: 28px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 7px;
    text-decoration: none;
  }
  .dev-nav-brand span { color: #0071e3; }
  .dev-nav-divider {
    width: 1px;
    height: 20px;
    background: rgba(0,0,0,.1);
    margin-right: 20px;
  }
  .dev-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 14px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #86868b;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color .15s, border-color .15s;
  }
  .dev-nav-link:hover { color: #1d1d1f; }
  .dev-nav-link.active { color: #0071e3; border-bottom-color: #0071e3; font-weight: 600; }
  .dev-nav-icon { font-size: 14px; line-height: 1; }
  .dev-layout-content { flex: 1; }
`

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    setIsUnlocked(isDemoUnlockedClient('pay-lens'))
  }, [])

  if (isUnlocked === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#86868b', fontSize: 14 }}>Loading…</div>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <DemoPasswordModal
        demoId="pay-lens"
        onSuccess={() => setIsUnlocked(true)}
        onCancel={() => router.push('/')}
      />
    )
  }

  return (
    <div className="dev-layout">
      <style>{css}</style>
      <nav className="dev-nav">
        <Link href="/pay-lens/dev" className="dev-nav-brand">
          💳 <span>PayLens</span> Dev
        </Link>
        <div className="dev-nav-divider" />
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/pay-lens/dev'
            ? pathname === '/pay-lens/dev'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dev-nav-link${isActive ? ' active' : ''}`}
            >
              <span className="dev-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="dev-layout-content">{children}</div>
    </div>
  )
}
