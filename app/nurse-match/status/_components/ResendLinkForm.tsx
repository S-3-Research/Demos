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
      const res = await fetch('/api/nurse-match/resend-link', {
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
      <div className="bg-[#1a8c9e]/[0.07] border border-[#1a8c9e]/20 rounded-[8px] px-6 py-5 text-center">
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#1a8c9e] mb-[6px]">
          Check your inbox
        </p>
        <p className="text-[13px] leading-[1.5] text-white/45">
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
        className="w-full rounded-[6px] px-4 py-[13px] text-[15px] text-white outline-none border border-white/10 bg-white/5 box-border"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className={`rounded-[6px] px-8 py-[14px] font-black text-[13px] tracking-[0.2em] uppercase bg-[#d4920a] text-[#071828] border-none cursor-pointer transition-opacity ${state === 'loading' ? 'opacity-60' : 'opacity-100'}`}
      >
        {state === 'loading' ? 'Sending…' : 'Send My Status Link →'}
      </button>
      {state === 'error' && (
        <p className="text-[12px] text-center text-[#f87171]">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  )
}
