'use client'

import { useState } from 'react'

export function Ic({ children }: { children: React.ReactNode }) {
  return <span className="ic">{children}</span>
}

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    const el = document.createElement('div')
    el.innerHTML = code
    navigator.clipboard.writeText(el.textContent || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code-wrap">
      <CopyButton code={code} />
      <pre dangerouslySetInnerHTML={{ __html: code }} />
    </div>
  )
}
