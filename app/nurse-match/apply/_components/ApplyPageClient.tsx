'use client'

import { useState } from 'react'
import ApplyForm from './ApplyForm'
import ApplySidebar from './ApplySidebar'

type Step = 0 | 1 | 2 | 3 | 4

const PROGRESS = [10, 30, 50, 70, 90]
const STEP_LABELS = ['You', 'Background', 'Location', 'Motivation', 'Availability']

export type FormData = Record<string, string | string[]>

export default function ApplyPageClient() {
  const [step, setStep] = useState<Step>(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const next   = () => setStep((s) => Math.min(s + 1, 4) as Step)
  const back   = () => setStep((s) => Math.max(s - 1, 0) as Step)
  const goTo   = (i: Step) => { if (i <= step) setStep(i) }

  function mergeData(stepData: FormData) {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  async function submit(stepData: FormData) {
    const allData = { ...formData, ...stepData }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/nurse-match/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allData),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json.error ?? 'Submission failed')
      }
      if (json.code === 'ALREADY_REGISTERED') {
        setAlreadyRegistered(true)
        return
      }
      setDone(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── Progress bar — sticky, full-width between hero and main grid ── */}
      {!done && (
        <div
          className="sticky top-[57px] z-[99] border-b px-12 max-[860px]:px-6 py-4 overflow-x-hidden bg-[#0a1f30] border-white/[0.07]"
        >
          <div className="max-w-[680px] mx-auto">
            <div className="flex items-center mb-[10px]">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => goTo(i as Step)}
                    className={`flex items-center gap-[6px] font-barlow font-bold text-[10px]
                      tracking-[.14em] uppercase transition-colors duration-200
                      ${i <= step ? 'cursor-pointer' : 'cursor-default'}
                      ${i < step ? 'text-[#d4920a]' : i === step ? 'text-[#1a8c9e]' : 'text-white/30'}`}
                  >
                    <span
                      className={`w-[22px] h-[22px] rounded-full border border-current flex items-center justify-center
                        text-[11px] font-bold flex-shrink-0 transition-all duration-200
                        ${i < step ? 'bg-[#d4920a] text-white' : i === step ? 'bg-[#1a8c9e] text-white' : 'bg-transparent'}`}
                    >
                      {i < step ? '✓' : i + 1}
                    </span>
                    <span className="max-[540px]:hidden">{label}</span>
                  </button>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-[#d4920a]/30' : 'bg-white/[0.08]'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="h-[3px] rounded-[2px] overflow-hidden bg-white/[0.07]">
              <div className="progress-bar-fill" style={{ width: `${PROGRESS[step]}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Main grid: form + sidebar ── */}
      <div className="apply-main-grid max-w-[1060px] mx-auto px-12 max-[860px]:px-6 pt-12 pb-20 grid gap-12 bg-[#071828]">
        <div>
          {alreadyRegistered ? (
            <AlreadyRegisteredNotice />
          ) : (
            <ApplyForm
              step={step}
              onNext={(data) => { mergeData(data); next() }}
              onBack={back}
              onSubmit={submit}
              done={done}
              submitting={submitting}
              submitError={submitError}
            />
          )}
        </div>
        <ApplySidebar />
      </div>
    </>
  )
}

function AlreadyRegisteredNotice() {
  return (
    <div className="py-12 text-center">
      <div className="text-[48px] mb-5">📬</div>
      <h2
        className="font-bold leading-none mb-3 text-white"
        style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)', fontSize: 'clamp(28px, 3.5vw, 42px)' }}
      >
        You&apos;re already{' '}
        <em className="text-[#1a8c9e]">on file.</em>
      </h2>
      <p className="text-[15px] leading-[1.7] max-w-[480px] mx-auto mb-6 text-white/50">
        An application with this email address already exists. To protect your data,
        we didn&apos;t make any changes.
      </p>
      <div
        className="inline-flex flex-col gap-2 px-6 py-5 border rounded-[8px] text-left max-w-[420px] mx-auto mb-8 bg-[#1a8c9e]/[0.07] border-[#1a8c9e]/20"
      >
        <p className="font-bold text-[11px] tracking-[.18em] uppercase text-[#1a8c9e]">
          Check your inbox
        </p>
        <p className="text-[13px] leading-[1.6] text-white/45">
          We just sent a secure link to your email. Click it to view your existing application
          or make updates.
        </p>
      </div>
      <p className="text-[12px] text-white/30">
        Didn&apos;t receive it? Check your spam folder, or{' '}
        <a
          href="/nurse-match/status"
          className="underline transition-colors hover:text-white text-[#1a8c9e]"
        >
          request a new link here
        </a>
        .
      </p>
    </div>
  )
}
