'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ROLES, SPECIALTIES, SPECIAL_EXPERIENCE_OPTIONS, EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS,
  GOAL_OPTIONS, HOURS_OPTIONS, US_STATES,
} from '../../_config'

type AppData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  specialty: string
  years_experience: string | number
  languages: string | string[]
  address: string
  state: string
  city: string
  zip: string
  serves_underserved: boolean | string
  motivation_text: string
  goal: string
  hours_per_month: string | number
  special_experience: string | string[]
}

type EditFormProps = {
  app: AppData
  isSelectedLimited: boolean
}

const inputClass =
  'w-full rounded-[6px] px-4 py-[13px] text-[15px] text-white outline-none transition-all duration-200 border border-white/10 bg-white/5 focus:border-[#1a8c9e] focus:ring-2 focus:ring-[#1a8c9e]/10'
const selectClass =
  'w-full rounded-[6px] px-4 py-[13px] text-[15px] text-white outline-none transition-all duration-200 border border-white/10 bg-white/5 focus:border-[#1a8c9e] focus:ring-2 focus:ring-[#1a8c9e]/10 appearance-none'
const labelClass = 'block font-bold text-[11px] tracking-[.16em] uppercase mb-[7px] text-white/45'

function CheckboxOption({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label
      className="flex items-center gap-[10px] px-3 py-[11px] border rounded-[6px] cursor-pointer
        transition-all duration-200 bg-white/[0.03] border-white/[0.08]
        has-[:checked]:bg-[#1a8c9e]/10 has-[:checked]:border-[#1a8c9e]/40
        hover:bg-[#1a8c9e]/[0.06] hover:border-[#1a8c9e]/25"
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="flex-shrink-0 w-[15px] h-[15px] accent-[#1a8c9e]"
      />
      <span className="text-[13px] leading-none text-white/60">{label}</span>
    </label>
  )
}

function RadioOption({ name, value, label, desc, defaultChecked }: {
  name: string; value: string; label: string; desc?: string; defaultChecked?: boolean
}) {
  return (
    <label
      className="flex items-start gap-3 px-4 py-[14px] border rounded-[6px] cursor-pointer
        transition-all duration-200 bg-white/[0.03] border-white/[0.08]
        has-[:checked]:bg-[#1a8c9e]/10 has-[:checked]:border-[#1a8c9e]/40
        hover:bg-[#1a8c9e]/[0.06] hover:border-[#1a8c9e]/25"
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="mt-[2px] flex-shrink-0 w-4 h-4 accent-[#1a8c9e]"
      />
      <span className="text-[14px] leading-[1.45] text-white/60">
        {desc ? (
          <>
            <strong className="block mb-[2px] text-white">{label}</strong>
            {desc}
          </>
        ) : label}
      </span>
    </label>
  )
}

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
      address: fd.get('address'),
      state: fd.get('state'),
      city: fd.get('city'),
      zip: fd.get('zip'),
      hours_per_month: fd.get('hours_per_month'),
      languages: fd.getAll('languages'),
    }
    if (!isSelectedLimited) {
      body.role = fd.get('role')
      body.specialty = fd.getAll('specialty')
      body.years_experience = fd.get('years_experience')
      const underserved = fd.get('serves_underserved') as string
      body.serves_underserved = underserved === 'yes' || underserved === 'somewhat'
      body.motivation_text = fd.get('motivation_text')
      body.goal = fd.get('goal')
      body.special_experience = fd.getAll('special_experience')
    }

    const res = await fetch('/api/nurse-match/edit-application', {
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
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" type="tel" className={inputClass} defaultValue={app.phone} />
            </div>
            <div>
              <label className={labelClass}>Street Address</label>
              <input name="address" type="text" className={inputClass} defaultValue={app.address} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input name="city" type="text" className={inputClass} defaultValue={app.city} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select name="state" className={selectClass} defaultValue={app.state ?? ''} style={{ colorScheme: 'dark' }}>
                <option value="" disabled>Select your state</option>
                {US_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>ZIP Code</label>
              <input name="zip" type="text" className={inputClass} defaultValue={app.zip} maxLength={10} />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Languages spoken{' '}
              <span className="font-normal opacity-50">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-3 gap-[8px] mt-1">
              {LANGUAGE_OPTIONS.map((l) => {
                const saved = Array.isArray(app.languages)
                  ? app.languages
                  : (app.languages ?? '').toString().split(/[,;]+/).map((s) => s.trim())
                return (
                  <CheckboxOption key={l} name="languages" value={l} label={l} defaultChecked={saved.includes(l)} />
                )
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>How many hours per month might you be open to for clinical research activities?</label>
            <div className="grid grid-cols-2 gap-[10px] mt-1">
              {HOURS_OPTIONS.map((h) => (
                <RadioOption
                  key={h.value}
                  name="hours_per_month"
                  value={h.value}
                  label={h.label}
                  desc={h.desc}
                  defaultChecked={String(app.hours_per_month) === h.value}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Qualification fields — full edit mode only */}
      {!isSelectedLimited && (
        <section>
          <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase mb-5 text-[#1a8c9e] pb-[10px] border-b border-white/[0.06]">
            Qualifications
          </h3>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Current Role</label>
                <select name="role" className={selectClass} defaultValue={app.role ?? ''} style={{ colorScheme: 'dark' }}>
                  <option value="" disabled>Select your role</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Primary Specialty{' '}
                  <span className="font-normal opacity-50">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-3 gap-[8px] mt-1">
                  {SPECIALTIES.map((s) => {
                    const saved = Array.isArray(app.specialty)
                      ? app.specialty
                      : (app.specialty ?? '').toString().split(/[,;]+/).map((x) => x.trim())
                    return (
                      <CheckboxOption key={s} name="specialty" value={s} label={s} defaultChecked={saved.includes(s)} />
                    )
                  })}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Experience{' '}
                  <span className="font-normal opacity-50">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-[8px] mt-1">
                  {SPECIAL_EXPERIENCE_OPTIONS.map((o) => {
                    const saved = Array.isArray(app.special_experience)
                      ? app.special_experience
                      : (app.special_experience ?? '').toString().split(/[,;]+/).map((x) => x.trim())
                    return (
                      <CheckboxOption key={o.value} name="special_experience" value={o.value} label={o.label} defaultChecked={saved.includes(o.value)} />
                    )
                  })}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Years of Clinical Experience</label>
                <select name="years_experience" className={selectClass} defaultValue={String(app.years_experience ?? '')} style={{ colorScheme: 'dark' }}>
                  <option value="" disabled>Select years</option>
                  {EXPERIENCE_OPTIONS.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Are you currently serving patients in underserved or rural communities?</label>
              <div className="grid grid-cols-3 gap-[10px] mt-1">
                <RadioOption name="serves_underserved" value="yes" label="Yes"
                  defaultChecked={app.serves_underserved === true || app.serves_underserved === 'yes'} />
                <RadioOption name="serves_underserved" value="no" label="No"
                  defaultChecked={app.serves_underserved === false || app.serves_underserved === 'no'} />
                <RadioOption name="serves_underserved" value="somewhat" label="Somewhat"
                  defaultChecked={app.serves_underserved === 'somewhat'} />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                What interests you most about expanding into clinical research?{' '}
                <span className="font-normal opacity-50">(optional)</span>
              </label>
              <textarea
                name="motivation_text"
                rows={4}
                placeholder="Share as much or as little as you'd like..."
                className={`${inputClass} resize-y min-h-[90px] leading-[1.6]`}
                defaultValue={app.motivation_text}
              />
            </div>

            <div>
              <label className={labelClass}>What best describes your goal?</label>
              <div className="grid grid-cols-2 gap-[10px] mt-1">
                {GOAL_OPTIONS.map((g) => (
                  <RadioOption
                    key={g.value}
                    name="goal"
                    value={g.value}
                    label={g.label}
                    desc={g.desc || undefined}
                    defaultChecked={app.goal === g.value}
                  />
                ))}
              </div>
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
