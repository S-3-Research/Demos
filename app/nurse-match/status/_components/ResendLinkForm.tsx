'use client'

import { useState } from 'react'

export default function ResendLinkForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setState('loading')
    try {
      const res = await fetch('/api/nurse-resend-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div
        className="px-6 py-5 border rounded-[2px] text-center"
        style={{ background: 'rgba(11,110,120,0.08)', borderColor: 'rgba(11,110,120,0.25)' }}
      >
        <p className="font-barlow font-bold text-[11px] tracking-[.18em] uppercase mb-1" style={{ color: 'var(--teal-light)' }}>
          Check your inbox
        </p>
        <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          If that email has an application on file, you&apos;ll receive a secure link shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-[2px] px-4 py-[13px] text-[15px] text-white outline-none border transition-all duration-200 focus:border-[var(--teal-light)]"
        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="rounded-[2px] px-8 py-[14px] font-barlow font-black text-[13px] tracking-[.2em] uppercase transition-all duration-200 hover:translate-y-[-2px] disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, var(--teal), var(--teal-light))',
          color: 'white',
          boxShadow: '0 6px 24px rgba(11,110,120,.35)',
        }}
      >
        {state === 'loading' ? 'Sending…' : 'Send My Status Link →'}
      </button>
      {state === 'error' && (
        <p className="text-[12px] text-center" style={{ color: 'rgba(255,100,100,0.7)' }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
