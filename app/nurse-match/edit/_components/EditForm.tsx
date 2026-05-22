'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type AppData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  specialty: string
  years_experience: number
  languages: string
  state: string
  city: string
  zip: string
  serves_underserved: boolean
  motivation_text: string
  goal: string
  hours_per_month: number
}

type EditFormProps = {
  app: AppData
  isSelectedLimited: boolean
}

const inputClass =
  'w-full bg-transparent border-b border-white/10 text-white text-[15px] py-2 px-0 placeholder:text-white/20 focus:outline-none focus:border-[#1a8c9e]/60 transition-colors'
const labelClass = 'block font-bold text-[10px] tracking-[.2em] uppercase mb-1 text-white/40'

export default function EditForm({ app, isSelectedLimited }: EditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      phone: fd.get('phone'),
      state: fd.get('state'),
      city: fd.get('city'),
      zip: fd.get('zip'),
      hours_per_month: Number(fd.get('hours_per_month')),
      languages: fd.get('languages'),
    }
    if (!isSelectedLimited) {
      body.role = fd.get('role')
      body.specialty = fd.get('specialty')
      body.years_experience = Number(fd.get('years_experience'))
      body.serves_underserved = fd.get('serves_underserved') === 'on'
      body.motivation_text = fd.get('motivation_text')
      body.goal = fd.get('goal')
    }

    const res = await fetch('/api/nurse-application/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error || 'Something went wrong. Please try again.')
      setSaving(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/nurse-match/status'), 1500)
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="text-[32px] mb-3 text-[#1a8c9e]">✓</div>
        <p className="font-bold tracking-[0.12em] uppercase text-[14px] text-[#d4920a]">
          Application updated
        </p>
        <p className="text-[13px] mt-2 text-white/35">Returning to status page…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Contact */}
      <section>
        <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase mb-5 text-[#1a8c9e] pb-[10px] border-b border-white/[0.06]">
          Contact &amp; Availability
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone</label>
            <input name="phone" type="tel" className={inputClass} defaultValue={app.phone} />
          </div>
          <div>
            <label className={labelClass}>Languages</label>
            <input name="languages" type="text" className={inputClass} defaultValue={Array.isArray(app.languages) ? app.languages.join(', ') : (app.languages ?? '')} placeholder="e.g. English, Spanish" />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input name="city" type="text" className={inputClass} defaultValue={app.city} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input name="state" type="text" className={inputClass} defaultValue={app.state} maxLength={2} />
          </div>
          <div>
            <label className={labelClass}>ZIP</label>
            <input name="zip" type="text" className={inputClass} defaultValue={app.zip} maxLength={10} />
          </div>
          <div>
            <label className={labelClass}>Hours available / month</label>
            <input name="hours_per_month" type="number" min={1} max={160} className={inputClass} defaultValue={app.hours_per_month} />
          </div>
        </div>
      </section>

      {/* Qualification fields — full edit mode only */}
      {!isSelectedLimited && (
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase mb-5 text-[#1a8c9e] pb-[10px] border-b border-white/[0.06]">
            Qualifications
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Role / Title</label>
              <input name="role" type="text" className={inputClass} defaultValue={app.role} />
            </div>
            <div>
              <label className={labelClass}>Specialty</label>
              <input name="specialty" type="text" className={inputClass} defaultValue={app.specialty} />
            </div>
            <div>
              <label className={labelClass}>Years of experience</label>
              <input name="years_experience" type="number" min={0} max={50} className={inputClass} defaultValue={app.years_experience} />
            </div>
            <div className="flex items-center gap-3 self-end pb-2">
              <input
                id="serves_underserved"
                name="serves_underserved"
                type="checkbox"
                defaultChecked={app.serves_underserved}
                className="w-4 h-4 accent-[#d4920a]"
              />
              <label htmlFor="serves_underserved" className="text-[13px] text-white/55">
                Open to underserved communities
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className={labelClass}>Why do you want to join? (motivation)</label>
              <textarea
                name="motivation_text"
                rows={4}
                className="w-full text-[14px] text-white leading-[1.6] resize-none outline-none py-3 px-3 rounded-[4px] bg-white/[0.04] border border-white/[0.08]"
                defaultValue={app.motivation_text}
              />
            </div>
            <div>
              <label className={labelClass}>Your goal with Achieve</label>
              <textarea
                name="goal"
                rows={3}
                className="w-full text-[14px] text-white leading-[1.6] resize-none outline-none py-3 px-3 rounded-[4px] bg-white/[0.04] border border-white/[0.08]"
                defaultValue={app.goal}
              />
            </div>
          </div>
        </section>
      )}

      {error && (
        <p className="text-[13px] text-[#f87171]">{error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className={`font-black text-[12px] tracking-[0.18em] uppercase py-3 px-8 rounded-[6px] border-none transition-all duration-200 ${
            saving
              ? 'bg-[rgba(212,146,10,0.35)] text-white/50 cursor-not-allowed'
              : 'bg-[#d4920a] text-[#071828] cursor-pointer'
          }`}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <a
          href="/nurse-match/status"
          className="text-[12px] tracking-[0.12em] uppercase text-white/30 no-underline"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
