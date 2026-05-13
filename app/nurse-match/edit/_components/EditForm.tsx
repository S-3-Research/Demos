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
  'w-full bg-transparent border-b border-[rgba(255,255,255,0.12)] text-white text-[15px] font-barlow py-2 px-0 placeholder:text-[rgba(255,255,255,0.22)] focus:outline-none focus:border-[rgba(232,168,32,0.5)] transition-colors'
const labelClass = 'block font-barlow font-bold text-[10px] tracking-[.2em] uppercase mb-1'

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
        <div className="text-[32px] mb-3">✓</div>
        <p className="font-barlow font-bold tracking-[.12em] uppercase text-[14px]" style={{ color: 'var(--gold-bright)' }}>
          Application updated
        </p>
        <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Returning to status page…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Contact */}
      <section>
        <h3 className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-4" style={{ color: 'var(--teal-light)' }}>
          Contact & Availability
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Phone</label>
            <input name="phone" type="tel" className={inputClass} defaultValue={app.phone} />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Languages</label>
            <input name="languages" type="text" className={inputClass} defaultValue={Array.isArray(app.languages) ? app.languages.join(', ') : (app.languages ?? '')} placeholder="e.g. English, Spanish" />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>City</label>
            <input name="city" type="text" className={inputClass} defaultValue={app.city} />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>State</label>
            <input name="state" type="text" className={inputClass} defaultValue={app.state} maxLength={2} />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>ZIP</label>
            <input name="zip" type="text" className={inputClass} defaultValue={app.zip} maxLength={10} />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Hours available / month</label>
            <input name="hours_per_month" type="number" min={1} max={160} className={inputClass} defaultValue={app.hours_per_month} />
          </div>
        </div>
      </section>

      {/* Qualification fields — full edit mode only */}
      {!isSelectedLimited && (
        <section>
          <h3 className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-4" style={{ color: 'var(--teal-light)' }}>
            Qualifications
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Role / Title</label>
              <input name="role" type="text" className={inputClass} defaultValue={app.role} />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Specialty</label>
              <input name="specialty" type="text" className={inputClass} defaultValue={app.specialty} />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Years of experience</label>
              <input name="years_experience" type="number" min={0} max={50} className={inputClass} defaultValue={app.years_experience} />
            </div>
            <div className="flex items-center gap-3 self-end pb-2">
              <input
                id="serves_underserved"
                name="serves_underserved"
                type="checkbox"
                defaultChecked={app.serves_underserved}
                className="w-4 h-4 accent-[var(--gold-bright)]"
              />
              <label htmlFor="serves_underserved" className="font-barlow text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Open to underserved communities
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Why do you want to join? (motivation)</label>
              <textarea
                name="motivation_text"
                rows={4}
                className={`${inputClass} border border-[rgba(255,255,255,0.12)] rounded-[2px] p-3 resize-none`}
                defaultValue={app.motivation_text}
              />
            </div>
            <div>
              <label className={labelClass} style={{ color: 'rgba(255,255,255,0.45)' }}>Your goal with Achieve</label>
              <textarea
                name="goal"
                rows={3}
                className={`${inputClass} border border-[rgba(255,255,255,0.12)] rounded-[2px] p-3 resize-none`}
                defaultValue={app.goal}
              />
            </div>
          </div>
        </section>
      )}

      {error && (
        <p className="text-[13px]" style={{ color: '#f87171' }}>{error}</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="font-barlow font-bold text-[12px] tracking-[.18em] uppercase px-8 py-3 rounded-[2px] transition-all"
          style={{
            background: saving ? 'rgba(232,168,32,0.35)' : '#E8A820',
            color: saving ? 'rgba(255,255,255,0.5)' : '#040E1B',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <a
          href="/nurse-match/status"
          className="font-barlow text-[12px] tracking-[.12em] uppercase transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
