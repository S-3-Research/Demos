'use client'

import Link from 'next/link'
import {
  ROLES, SPECIALTIES, EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS,
  GOAL_OPTIONS, HOURS_OPTIONS, SOURCE_OPTIONS, US_STATES, COHORT,
} from '../../_config'

type StepData = Record<string, string | string[]>

function collectForm(form: HTMLFormElement): StepData {
  const fd = new FormData(form)
  const result: StepData = {}
  const seen = new Set<string>()
  for (const key of fd.keys()) {
    if (seen.has(key)) continue
    seen.add(key)
    const values = fd.getAll(key).map(String)
    result[key] = values.length === 1 ? values[0] : values
  }
  return result
}

// ── Shared field components ──────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase block mb-[7px]"
      style={{ color: 'rgba(255,255,255,0.55)' }}
    >
      {children}
    </label>
  )
}

const inputClass = `w-full rounded-[2px] px-4 py-[13px] text-[15px] font-dm text-white outline-none
  transition-all duration-200 border
  focus:border-[var(--teal-light)] focus:bg-[rgba(11,110,120,0.06)]`
const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  borderColor: 'rgba(255,255,255,0.1)',
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} style={inputStyle} {...props} />
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${inputClass} appearance-none`}
      style={{ ...inputStyle, background: 'rgba(255,255,255,0.04)' }}
      {...props}
    />
  )
}

function RadioOption({
  name, value, label, desc, full = false,
}: { name: string; value: string; label: string; desc?: string; full?: boolean }) {
  return (
    <label
      className={`flex items-start gap-3 px-4 py-[14px] border rounded-[2px] cursor-pointer
        transition-all duration-200 has-[:checked]:bg-[rgba(11,110,120,0.1)]
        has-[:checked]:border-[rgba(11,110,120,0.4)] hover:bg-[rgba(11,110,120,0.07)]
        hover:border-[rgba(11,110,120,0.25)] ${full ? 'col-span-full' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        className="mt-[2px] accent-[var(--teal-light)] flex-shrink-0"
        style={{ width: '16px', height: '16px' }}
      />
      <span className="text-[14px] leading-[1.45]" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {desc ? (
          <>
            <strong className="block text-white mb-[2px]">{label}</strong>
            {desc}
          </>
        ) : label}
      </span>
    </label>
  )
}

function CheckboxOption({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label
      className="flex items-center gap-[10px] px-3 py-[11px] border rounded-[2px] cursor-pointer
        transition-all duration-200 has-[:checked]:bg-[rgba(11,110,120,0.1)]
        has-[:checked]:border-[rgba(11,110,120,0.4)] hover:bg-[rgba(11,110,120,0.07)]
        hover:border-[rgba(11,110,120,0.25)]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        className="accent-[var(--teal-light)] flex-shrink-0"
        style={{ width: '15px', height: '15px' }}
      />
      <span className="text-[13px] leading-none" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {label}
      </span>
    </label>
  )
}

// ── Multi-step form ──────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3 | 4

export default function ApplyForm({
  step, onNext, onBack, onSubmit, done, submitting, submitError,
}: {
  step: Step
  onNext: (data: StepData) => void
  onBack: () => void
  onSubmit: (data: StepData) => void
  done: boolean
  submitting?: boolean
  submitError?: string | null
}) {
  if (done) return <Confirmation />

  return (
    <div className="form-section-enter">
      {step === 0 && <StepIdentity onNext={onNext} />}
      {step === 1 && <StepBackground onNext={onNext} onBack={onBack} />}
      {step === 2 && <StepLocation onNext={onNext} onBack={onBack} />}
      {step === 3 && <StepMotivation onNext={onNext} onBack={onBack} />}
      {step === 4 && (
        <StepAvailability
          onSubmit={onSubmit}
          onBack={onBack}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  )
}

// ── Step components ──────────────────────────────────────────────────────────

function SectionHeader({ step, title, sub }: { step: string; title: React.ReactNode; sub: string }) {
  return (
    <div className="mb-8">
      <p
        className="font-barlow font-bold text-[10px] tracking-[.26em] uppercase mb-[10px]"
        style={{ color: 'var(--teal-light)' }}
      >
        {step}
      </p>
      <h2
        className="font-cormorant font-bold leading-[1.08] tracking-[-0.02em] mb-[6px]"
        style={{ fontSize: 'clamp(26px, 3vw, 38px)', color: 'var(--cream)' }}
      >
        {title}
      </h2>
      <p className="text-[14px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {sub}
      </p>
    </div>
  )
}

function NavButtons({
  onBack, submitLabel, disabled,
}: {
  onBack?: () => void
  submitLabel?: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {submitLabel ? (
        <button
          type="submit"
          disabled={disabled}
          className="btn-shimmer rounded-[2px] px-12 py-[18px] font-barlow font-black
            text-[14px] tracking-[.2em] uppercase transition-all duration-200
            hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, var(--gold), var(--gold-bright))',
            color: 'var(--ink)',
            boxShadow: '0 6px 28px rgba(196,154,26,.4)',
          }}
        >
          {disabled ? 'Submitting…' : submitLabel}
        </button>
      ) : (
        <button
          type="submit"
          className="btn-shimmer rounded-[2px] px-9 py-4 font-barlow font-black
            text-[13px] tracking-[.2em] uppercase text-white transition-all duration-200
            hover:translate-y-[-2px]"
          style={{
            background: 'linear-gradient(135deg, var(--teal), var(--teal-light))',
            boxShadow: '0 6px 24px rgba(11,110,120,.35)',
          }}
        >
          Continue →
        </button>
      )}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 font-barlow font-bold text-[12px] tracking-[.14em] uppercase
            bg-transparent border-none cursor-pointer transition-colors duration-200
            hover:text-white"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          ← Back
        </button>
      )}
    </div>
  )
}

function StepIdentity({ onNext }: { onNext: (data: StepData) => void }) {
  return (
    <form className="form-section-enter" onSubmit={(e) => { e.preventDefault(); onNext(collectForm(e.currentTarget)) }}>
      <SectionHeader
        step="Step 1 of 5"
        title={<>Let&apos;s start with <em style={{ color: 'var(--gold-bright)' }}>you.</em></>}
        sub="Simple details to begin your application."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div className="field-row-2col grid gap-4 max-[860px]:grid-cols-1">
          <div><FieldLabel>First Name</FieldLabel><TextInput required name="firstName" type="text" placeholder="First name" /></div>
          <div><FieldLabel>Last Name</FieldLabel><TextInput required name="lastName" type="text" placeholder="Last name" /></div>
        </div>
        <div><FieldLabel>Email Address</FieldLabel><TextInput required name="email" type="email" placeholder="your@email.com" /></div>
        <div><FieldLabel>Phone Number</FieldLabel><TextInput name="phone" type="tel" placeholder="(555) 000-0000" /></div>
      </div>
      <NavButtons />
    </form>
  )
}

function StepBackground({ onNext, onBack }: { onNext: (data: StepData) => void; onBack: () => void }) {
  return (
    <form className="form-section-enter" onSubmit={(e) => { e.preventDefault(); onNext(collectForm(e.currentTarget)) }}>
      <SectionHeader
        step="Step 2 of 5"
        title={<>Your professional <em style={{ color: 'var(--gold-bright)' }}>background.</em></>}
        sub="We select nurses across a wide range of specialties and experience levels."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <FieldLabel>Current Role</FieldLabel>
          <SelectInput name="role" defaultValue="">
            <option value="" disabled>Select your role</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Primary Specialty</FieldLabel>
          <SelectInput name="specialty" defaultValue="">
            <option value="" disabled>Select your specialty</option>
            {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Years of Clinical Experience</FieldLabel>
          <SelectInput name="yearsExperience" defaultValue="">
            <option value="" disabled>Select years</option>
            {EXPERIENCE_OPTIONS.map((e) => <option key={e}>{e}</option>)}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>
            Do you speak a language other than English?{' '}
            <span className="font-normal opacity-50">(optional — select all that apply)</span>
          </FieldLabel>
          <div className="grid grid-cols-3 gap-[8px] mt-1 language-grid">
            {LANGUAGE_OPTIONS.map((l) => (
              <CheckboxOption key={l} name="languages" value={l} label={l} />
            ))}
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} />
    </form>
  )
}

function StepLocation({ onNext, onBack }: { onNext: (data: StepData) => void; onBack: () => void }) {
  return (
    <form className="form-section-enter" onSubmit={(e) => { e.preventDefault(); onNext(collectForm(e.currentTarget)) }}>
      <SectionHeader
        step="Step 3 of 5"
        title={<>Where you <em style={{ color: 'var(--gold-bright)' }}>practice.</em></>}
        sub="Location helps us match you to active priority areas and cohort allocations near you."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <FieldLabel>State</FieldLabel>
          <SelectInput name="state" defaultValue="">
            <option value="" disabled>Select your state</option>
            {US_STATES.map((s) => <option key={s}>{s}</option>)}
          </SelectInput>
        </div>
        <div className="field-row-2col grid gap-4">
          <div><FieldLabel>City</FieldLabel><TextInput name="city" type="text" placeholder="Your city" /></div>
          <div><FieldLabel>ZIP Code</FieldLabel><TextInput name="zip" type="text" placeholder="ZIP" maxLength={5} /></div>
        </div>
        <div>
          <FieldLabel>Are you currently serving patients in underserved or rural communities?</FieldLabel>
          <div className="grid grid-cols-3 gap-[10px] mt-1">
            <RadioOption name="servesUnderserved" value="yes" label="Yes" />
            <RadioOption name="servesUnderserved" value="no" label="No" />
            <RadioOption name="servesUnderserved" value="somewhat" label="Somewhat" />
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} />
    </form>
  )
}

function StepMotivation({ onNext, onBack }: { onNext: (data: StepData) => void; onBack: () => void }) {
  return (
    <form className="form-section-enter" onSubmit={(e) => { e.preventDefault(); onNext(collectForm(e.currentTarget)) }}>
      <SectionHeader
        step="Step 4 of 5"
        title={<>What draws you <em style={{ color: 'var(--gold-bright)' }}>here.</em></>}
        sub="No right or wrong answers. This helps us understand what matters most to you."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <FieldLabel>
            What interests you most about expanding into clinical research?{' '}
            <span className="font-normal opacity-50">(optional)</span>
          </FieldLabel>
          <textarea
            name="motivationText"
            rows={4}
            placeholder="Share as much or as little as you'd like..."
            className={`${inputClass} resize-y min-h-[90px] leading-[1.6]`}
            style={inputStyle}
          />
        </div>
        <div>
          <FieldLabel>What best describes your goal?</FieldLabel>
          <div className="options-grid-2col grid gap-[10px] mt-1">
            {GOAL_OPTIONS.map((g) => (
              <RadioOption
                key={g.value}
                name="goal"
                value={g.value}
                label={g.label}
                desc={g.desc || undefined}
                full={g.value === 'all'}
              />
            ))}
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} />
    </form>
  )
}

function StepAvailability({
  onSubmit, onBack, submitting, submitError,
}: {
  onSubmit: (data: StepData) => void
  onBack: () => void
  submitting?: boolean
  submitError?: string | null
}) {
  return (
    <form
      className="form-section-enter"
      onSubmit={(e) => { e.preventDefault(); onSubmit(collectForm(e.currentTarget)) }}
    >
      <SectionHeader
        step="Step 5 of 5"
        title={<>How this fits <em style={{ color: 'var(--gold-bright)' }}>your life.</em></>}
        sub="This program is designed around your schedule. There's no wrong answer here."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <FieldLabel>How many hours per month might you be open to for clinical research activities?</FieldLabel>
          <div className="options-grid-2col grid gap-[10px] mt-1">
            {HOURS_OPTIONS.map((h) => (
              <RadioOption key={h.value} name="hoursPerMonth" value={h.value} label={h.label} desc={h.desc} />
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>
            How did you hear about ACHIEVE?{' '}
            <span className="font-normal opacity-50">(optional)</span>
          </FieldLabel>
          <SelectInput name="source">
            <option value="">Select one</option>
            {SOURCE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </SelectInput>
        </div>

        {/* Preview */}
        <div
          className="p-[22px] rounded-[2px] border"
          style={{
            background: 'rgba(232,168,32,0.05)',
            borderColor: 'rgba(232,168,32,0.15)',
          }}
        >
          <p
            className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-[14px]"
            style={{ color: 'var(--gold-bright)' }}
          >
            Selected nurses receive:
          </p>
          <div className="flex flex-col gap-2">
            {[
              `Fully sponsored certification (${COHORT.tuitionValue} value — covered)`,
              'Virtual training — 10 hours, self-paced, no travel required',
              'Paid, project-based clinical research opportunities',
              'A pathway to elevate your nursing career — on your terms',
            ].map((item) => (
              <div key={item} className="flex items-start gap-[10px] text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                <span className="flex-shrink-0" style={{ color: 'var(--gold-bright)' }}>◆</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} submitLabel="Submit Application for Selection →" disabled={submitting} />

      {submitError && (
        <p className="text-[13px] mt-3" style={{ color: 'rgba(255,100,100,0.8)' }}>
          ⚠ {submitError}
        </p>
      )}

      <p className="text-[11px] leading-[1.5] mt-[14px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Selection is limited and reviewed on a rolling basis. Early applicants are prioritized.
        Additional qualified nurses may be invited to enroll at standard tuition.
      </p>
    </form>
  )
}

function Confirmation() {
  return (
    <div className="text-center px-10 py-[60px]">
      <div className="text-[56px] mb-5">✦</div>
      <h2
        className="font-cormorant font-bold leading-none tracking-[-0.02em] mb-3"
        style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--cream)' }}
      >
        Application{' '}
        <em style={{ color: 'var(--teal-light)' }}>Received.</em>
      </h2>
      <p className="text-[16px] leading-[1.7] max-w-[520px] mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Thank you for applying. Your application has been received and will be reviewed as part of
        our rolling selection process.
      </p>
      <div
        className="inline-block font-barlow font-bold text-[12px] tracking-[.16em] uppercase
          px-5 py-[10px] rounded-[2px] border mb-8"
        style={{
          background: 'rgba(11,110,120,0.1)',
          borderColor: 'rgba(11,110,120,0.25)',
          color: 'var(--teal-light)',
        }}
      >
        Early applicants are reviewed first — you&apos;re ahead.
      </div>
      <div className="flex flex-col gap-[10px] max-w-[400px] mx-auto mb-8">
        {[
          { icon: '📬', text: <>You&apos;ll receive a confirmation email shortly. <strong className="text-white">Check your inbox.</strong></> },
          { icon: '⏱', text: <>Selections are reviewed on a <strong className="text-white">rolling basis.</strong> Early applicants are prioritized.</> },
          { icon: '✦', text: <>If selected, you&apos;ll be notified with next steps to begin your <strong className="text-white">Research-Ready Nurse™ training.</strong></> },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3 text-left border rounded-[2px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-[16px] flex-shrink-0" style={{ color: 'var(--gold-bright)' }}>{item.icon}</span>
            <span className="text-[14px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.text}</span>
          </div>
        ))}
      </div>
      <Link
        href="/nurse-match/landing"
        className="font-barlow font-bold text-[12px] tracking-[.16em] uppercase
          transition-colors duration-200 hover:text-[var(--gold-bright)]"
        style={{ color: 'var(--muted)' }}
      >
        ← Return to Overview
      </Link>
    </div>
  )
}
