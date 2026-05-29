'use client'

import Link from 'next/link'
import {
  ROLES, SPECIALTIES, SPECIAL_EXPERIENCE_OPTIONS, EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS,
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
    <label className="font-bold text-[11px] tracking-[.16em] uppercase block mb-[7px] text-white/45">
      {children}
    </label>
  )
}

const inputClass = `w-full rounded-[6px] px-4 py-[13px] text-[15px] text-white outline-none
  transition-all duration-200 border border-white/10 bg-white/5
  focus:border-[#1a8c9e] focus:ring-2 focus:ring-[#1a8c9e]/10`

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`${inputClass} appearance-none`}
      style={{ colorScheme: 'dark' }}
      {...props}
    />
  )
}

function RadioOption({
  name, value, label, desc, full = false,
}: { name: string; value: string; label: string; desc?: string; full?: boolean }) {
  return (
    <label
      className={`flex items-start gap-3 px-4 py-[14px] border rounded-[6px] cursor-pointer
        transition-all duration-200 bg-white/[0.03] border-white/[0.08]
        has-[:checked]:bg-[#1a8c9e]/10 has-[:checked]:border-[#1a8c9e]/40
        hover:bg-[#1a8c9e]/[0.06] hover:border-[#1a8c9e]/25 ${full ? 'col-span-full' : ''}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
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

function CheckboxOption({ name, value, label }: { name: string; value: string; label: string }) {
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
        className="flex-shrink-0 w-[15px] h-[15px] accent-[#1a8c9e]"
      />
      <span className="text-[13px] leading-none text-white/60">
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
      <p className="font-bold text-[10px] tracking-[.26em] uppercase mb-[10px] text-[#1a8c9e]">
        {step}
      </p>
      <h2
        className="font-normal leading-[1.08] tracking-[-0.02em] mb-[6px] text-white"
        style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)', fontSize: 'clamp(26px, 3vw, 38px)' }}
      >
        {title}
      </h2>
      <p className="text-[14px] leading-[1.6] text-white/50">{sub}</p>
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
            text-[14px] tracking-[.2em] uppercase transition-all duration-200 bg-[#d4920a] text-[#071828]
            hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 6px 28px rgba(212,146,10,0.3)' }}
        >
          {disabled ? 'Submitting…' : submitLabel}
        </button>
      ) : (
        <button
          type="submit"
          className="btn-shimmer rounded-[2px] px-9 py-4 font-barlow font-black
            text-[13px] tracking-[.2em] uppercase text-white transition-all duration-200 bg-[#1a8c9e]
            hover:-translate-y-[2px]"
          style={{ boxShadow: '0 6px 24px rgba(26,140,158,0.25)' }}
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
            hover:text-white text-white/40"
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
        title={<>Let&apos;s start with <em style={{ color: '#d4920a' }}>you.</em></>}
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
        title={<>Your professional <em style={{ color: '#d4920a' }}>background.</em></>}
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
          <FieldLabel>
            Primary Specialty{' '}
            <span className="font-normal opacity-50">(select all that apply)</span>
          </FieldLabel>
          <div className="grid grid-cols-3 gap-[8px] mt-1 language-grid">
            {SPECIALTIES.map((s) => (
              <CheckboxOption key={s} name="specialty" value={s} label={s} />
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>
            Experience{' '}
            <span className="font-normal opacity-50">(optional — select all that apply)</span>
          </FieldLabel>
          <div className="grid grid-cols-2 gap-[8px] mt-1">
            {SPECIAL_EXPERIENCE_OPTIONS.map((o) => (
              <CheckboxOption key={o.value} name="specialExperience" value={o.value} label={o.label} />
            ))}
          </div>
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
        title={<>Where you <em style={{ color: '#d4920a' }}>practice.</em></>}
        sub="Location helps us match you to active priority areas and cohort allocations near you."
      />
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <FieldLabel>Street Address</FieldLabel>
          <TextInput required name="address" type="text" placeholder="123 Main St" />
        </div>
        <div>
          <FieldLabel>State</FieldLabel>
          <SelectInput required name="state" defaultValue="">
            <option value="" disabled>Select your state</option>
            {US_STATES.map((s) => <option key={s}>{s}</option>)}
          </SelectInput>
        </div>
        <div className="field-row-2col grid gap-4">
          <div><FieldLabel>City</FieldLabel><TextInput required name="city" type="text" placeholder="Your city" /></div>
          <div><FieldLabel>ZIP Code</FieldLabel><TextInput required name="zip" type="text" placeholder="ZIP" maxLength={5} /></div>
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
        title={<>What draws you <em style={{ color: '#d4920a' }}>here.</em></>}
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
        title={<>How this fits <em style={{ color: '#d4920a' }}>your life.</em></>}
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
        <div className="p-[22px] rounded-[8px] border bg-[#d4920a]/[0.06] border-[#d4920a]/20">
          <p className="font-bold text-[10px] tracking-[.22em] uppercase mb-[14px] text-[#d4920a]">
            Selected nurses receive:
          </p>
          <div className="flex flex-col gap-2">
            {[
              `Fully sponsored certification (${COHORT.tuitionValue} value — covered)`,
              'Virtual training — 10 hours, self-paced, no travel required',
              'Paid, project-based clinical research opportunities',
              'A pathway to elevate your nursing career — on your terms',
            ].map((item) => (
              <div key={item} className="flex items-start gap-[10px] text-[13px] text-white/55">
                <span className="flex-shrink-0 text-[#d4920a]">◆</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} submitLabel="Submit Application for Selection →" disabled={submitting} />

      {submitError && (
        <p className="text-[13px] mt-3 text-[#f87171]">
          ⚠ {submitError}
        </p>
      )}

      <p className="text-[11px] leading-[1.5] mt-[14px] text-white/25">
        Selection is limited and reviewed on a rolling basis. Early applicants are prioritized.
        Additional qualified nurses may be invited to enroll at standard tuition.
      </p>
    </form>
  )
}

function Confirmation() {
  return (
    <div className="text-center px-10 py-[60px]">
      <div className="text-[56px] mb-5" style={{ color: '#d4920a' }}>✦</div>
      <h2
        className="font-bold leading-none tracking-[-0.02em] mb-3"
        style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)', fontSize: 'clamp(36px, 4vw, 52px)', color: 'white', fontWeight: 400 }}
      >
        Application{' '}
        <em style={{ color: '#1a8c9e' }}>Received.</em>
      </h2>
      <p className="text-[16px] leading-[1.7] max-w-[520px] mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Thank you for applying. Your application has been received and will be reviewed as part of
        our rolling selection process.
      </p>
      <div
        className="inline-block font-bold text-[12px] tracking-[.16em] uppercase
          px-5 py-[10px] rounded-[6px] border mb-8"
        style={{
          background: 'rgba(26,140,158,0.08)',
          borderColor: 'rgba(26,140,158,0.25)',
          color: '#1a8c9e',
        }}
      >
        Early applicants are reviewed first — you&apos;re ahead.
      </div>
      <div className="flex flex-col gap-[10px] max-w-[400px] mx-auto mb-8">
        {[
          { icon: '📬', text: <>You&apos;ll receive a confirmation email shortly. <strong style={{ color: 'white' }}>Check your inbox.</strong></> },
          { icon: '⏱', text: <>Selections are reviewed on a <strong style={{ color: 'white' }}>rolling basis.</strong> Early applicants are prioritized.</> },
          { icon: '✦', text: <>If selected, you&apos;ll be notified with next steps to begin your <strong style={{ color: 'white' }}>Research-Ready Nurse™ training.</strong></> },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3 text-left border rounded-[8px] bg-white/[0.04] border-white/[0.08]"
          >
            <span className="text-[16px] flex-shrink-0" style={{ color: '#d4920a' }}>{item.icon}</span>
            <span className="text-[14px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.text}</span>
          </div>
        ))}
      </div>
      <Link
        href="/nurse-match/landing"
        className="font-bold text-[12px] tracking-[.16em] uppercase
          transition-colors duration-200 hover:text-white"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        ← Return to Overview
      </Link>
    </div>
  )
}
