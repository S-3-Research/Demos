'use client'

import { useState } from 'react'
import { X, Send, CheckCircle2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { TrainingInviteModal } from './TrainingInviteModal'
import type { NurseApplication } from './types'

interface Props {
  nurse: NurseApplication
  onClose: () => void
  onUpdate: (updated: NurseApplication) => void
}

type Tab = 'profile' | 'workflow' | 'history'

function fmt(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm text-slate-700">{value || '—'}</p>
    </div>
  )
}

function WorkflowSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600 font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs font-medium rounded-lg border border-slate-200 px-2 outline-none
                   focus:border-blue-300 bg-white text-slate-700 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function TimelineItem({ label, time, active }: { label: string; time?: string | null; active?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-2
        ${active ? 'bg-blue-500 ring-blue-200' : time ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-200 ring-slate-100'}`} />
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{fmt(time)}</p>
      </div>
    </div>
  )
}

export function NurseDrawer({ nurse, onClose, onUpdate }: Props) {
  const [tab, setTab] = useState<Tab>('workflow')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [adminNotes, setAdminNotes] = useState(nurse.admin_notes || '')
  const [licenseNotes, setLicenseNotes] = useState(nurse.license_verification_notes || '')
  const [licenseType, setLicenseType] = useState(nurse.license_type || '')
  const [licenseNumber, setLicenseNumber] = useState(nurse.license_number || '')
  const [licenseState, setLicenseState] = useState(nurse.license_state || '')
  const [licenseExpDate, setLicenseExpDate] = useState(nurse.license_expiration_date || '')

  const updateField = async (updates: Partial<NurseApplication>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/nurse-match/admin/nurse-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nurse.id, updates }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onUpdate(data.nurse)
    } catch (e) {
      console.error('[NurseDrawer] update error:', e)
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'workflow', label: 'Workflow' },
    { key: 'profile',  label: 'Profile' },
    { key: 'history',  label: 'History' },
  ]

  return (
    <>
      <div className="flex flex-col h-full border-l border-slate-200 bg-white w-[400px] shrink-0">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              {nurse.first_name} {nurse.last_name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{nurse.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <StatusBadge value={nurse.status} size="xs" />
              <StatusBadge value={nurse.training_status} size="xs" />
              <StatusBadge value={nurse.license_verification_status} size="xs" />
              {nurse.eligible_for_matching && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]
                                 font-semibold bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={10} /> Eligible
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                       hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-2.5 px-1 mr-5 text-xs font-semibold border-b-2 transition-colors
                ${tab === t.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── WORKFLOW ── */}
          {tab === 'workflow' && (
            <div className="space-y-6">
              {/* Application Status */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Application Status
                </p>
                <WorkflowSelect
                  label="Status"
                  value={nurse.status}
                  options={[
                    { value: 'pending',    label: 'Pending' },
                    { value: 'reviewing',  label: 'Reviewing' },
                    { value: 'selected',   label: 'Selected' },
                    { value: 'waitlisted', label: 'Waitlisted' },
                    { value: 'rejected',   label: 'Rejected' },
                  ]}
                  onChange={(v) => updateField({ status: v })}
                />
              </section>

              <hr className="border-slate-100" />

              {/* Training */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Training
                </p>
                <div className="space-y-3">
                  <WorkflowSelect
                    label="Training Status"
                    value={nurse.training_status}
                    options={[
                      { value: 'not_invited', label: 'Not Invited' },
                      { value: 'invited',     label: 'Invited' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'completed',   label: 'Completed' },
                      { value: 'failed',      label: 'Failed' },
                      { value: 'waived',      label: 'Waived' },
                    ]}
                    onChange={(v) => updateField({ training_status: v })}
                  />
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg
                               bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold
                               transition-colors"
                  >
                    <Send size={12} />
                    {nurse.training_status === 'invited' || nurse.training_status === 'in_progress'
                      ? 'Resend Training Invite'
                      : 'Send Training Invite'}
                  </button>
                  {nurse.training_invitation_url && (
                    <p className="text-xs text-slate-400 truncate">
                      URL: <a href={nurse.training_invitation_url} target="_blank" rel="noopener noreferrer"
                               className="text-blue-500 hover:underline">{nurse.training_invitation_url}</a>
                    </p>
                  )}
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* License */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  License Verification
                </p>
                <div className="space-y-3">
                  <WorkflowSelect
                    label="Verification Status"
                    value={nurse.license_verification_status}
                    options={[
                      { value: 'not_started', label: 'Not Started' },
                      { value: 'pending',     label: 'Pending Review' },
                      { value: 'verified',    label: 'Verified' },
                      { value: 'failed',      label: 'Failed' },
                      { value: 'expired',     label: 'Expired' },
                      { value: 'waived',      label: 'Waived' },
                    ]}
                    onChange={(v) => updateField({ license_verification_status: v })}
                  />

                  {/* License type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 font-medium">License Type</span>
                    <select
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      onBlur={() => {
                        if (licenseType !== nurse.license_type) updateField({ license_type: licenseType || undefined })
                      }}
                      className="h-8 text-xs font-medium rounded-lg border border-slate-200 px-2 outline-none
                                 focus:border-blue-300 bg-white text-slate-700 transition-colors"
                    >
                      <option value="">— Select —</option>
                      <option value="RN">RN</option>
                      <option value="LPN">LPN</option>
                      <option value="LVN">LVN</option>
                      <option value="NP">NP</option>
                    </select>
                  </div>

                  {/* License number */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600 font-medium shrink-0">License #</span>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      onBlur={() => {
                        if (licenseNumber !== nurse.license_number) updateField({ license_number: licenseNumber || undefined })
                      }}
                      placeholder="e.g. RN1234567"
                      className="h-8 flex-1 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700
                                 placeholder:text-slate-300 outline-none focus:border-blue-300 transition-colors"
                    />
                  </div>

                  {/* License state */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600 font-medium shrink-0">License State</span>
                    <input
                      type="text"
                      value={licenseState}
                      onChange={(e) => setLicenseState(e.target.value.toUpperCase().slice(0, 2))}
                      onBlur={() => {
                        if (licenseState !== nurse.license_state) updateField({ license_state: licenseState || undefined })
                      }}
                      placeholder="e.g. CA"
                      maxLength={2}
                      className="h-8 w-16 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700
                                 placeholder:text-slate-300 outline-none focus:border-blue-300 transition-colors uppercase"
                    />
                  </div>

                  {/* Expiration date */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600 font-medium shrink-0">Expiration Date</span>
                    <input
                      type="date"
                      value={licenseExpDate}
                      onChange={(e) => setLicenseExpDate(e.target.value)}
                      onBlur={() => {
                        if (licenseExpDate !== nurse.license_expiration_date) updateField({ license_expiration_date: licenseExpDate || undefined })
                      }}
                      className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700
                                 outline-none focus:border-blue-300 transition-colors"
                    />
                  </div>

                  {/* License notes */}
                  <textarea
                    rows={2}
                    placeholder="License verification notes…"
                    value={licenseNotes}
                    onChange={(e) => setLicenseNotes(e.target.value)}
                    onBlur={() => {
                      if (licenseNotes !== nurse.license_verification_notes) {
                        updateField({ license_verification_notes: licenseNotes })
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 text-slate-600
                               placeholder:text-slate-300 outline-none focus:border-blue-300
                               resize-none transition-colors"
                  />
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Eligible */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Matching Eligibility
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Eligible for Matching</p>
                    <p className="text-xs text-slate-400 mt-0.5">Enable after training + license are verified</p>
                  </div>
                  <button
                    onClick={() => updateField({ eligible_for_matching: !nurse.eligible_for_matching })}
                    disabled={saving}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                                border-2 border-transparent transition-colors duration-200
                                ${nurse.eligible_for_matching ? 'bg-emerald-500' : 'bg-slate-200'}
                                disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow ring-0
                                  transition-transform duration-200
                                  ${nurse.eligible_for_matching ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* Admin notes */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Admin Notes
                </p>
                <textarea
                  rows={4}
                  placeholder="Internal notes (not visible to nurse)…"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  onBlur={() => {
                    if (adminNotes !== nurse.admin_notes) {
                      updateField({ admin_notes: adminNotes })
                    }
                  }}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 text-slate-600
                             placeholder:text-slate-300 outline-none focus:border-blue-300
                             resize-none transition-colors"
                />
              </section>
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="space-y-5">
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Identity</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" value={nurse.first_name} />
                  <Field label="Last Name"  value={nurse.last_name} />
                  <Field label="Email"      value={nurse.email} />
                  <Field label="Phone"      value={nurse.phone} />
                </div>
              </section>
              <hr className="border-slate-100" />
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Background</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Role"             value={nurse.role} />
                  <Field label="Specialty"        value={nurse.specialty} />
                  <Field label="Years Experience" value={nurse.years_experience} />
                  <Field label="Languages"        value={nurse.languages?.join(', ')} />
                </div>
              </section>
              <hr className="border-slate-100" />
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Location</p>
                <div className="mb-3">
                  <Field label="Street Address" value={nurse.address} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="City"  value={nurse.city} />
                  <Field label="State" value={nurse.state} />
                  <Field label="ZIP"   value={nurse.zip} />
                </div>
                <div className="mt-3">
                  <Field label="Serves Underserved" value={nurse.serves_underserved} />
                </div>
              </section>
              <hr className="border-slate-100" />
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Motivation</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Motivation</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{nurse.motivation_text || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Goal</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{nurse.goal || '—'}</p>
                  </div>
                </div>
              </section>
              <hr className="border-slate-100" />
              <section>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Availability</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Hours / Month" value={nurse.hours_per_month} />
                  <Field label="Source"        value={nurse.source} />
                  <Field label="Cohort"        value={nurse.cohort} />
                  <Field label="Email Verified" value={nurse.email_verified ? 'Yes ✓' : 'No'} />
                </div>
              </section>
            </div>
          )}

          {/* ── HISTORY ── */}
          {tab === 'history' && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Timeline</p>
              <div className="relative pl-4 space-y-5 before:absolute before:left-1.5 before:top-1.5
                              before:bottom-1.5 before:w-px before:bg-slate-100">
                <TimelineItem label="Application Submitted"    time={nurse.applied_at}        active={!nurse.verified_at} />
                <TimelineItem label="Email Verified"           time={nurse.verified_at} />
                <TimelineItem label="Application Reviewed"     time={nurse.reviewed_at} />
                <TimelineItem label="Training Invite Sent"     time={nurse.training_invited_at} />
                <TimelineItem label="Training Started"         time={nurse.training_started_at} />
                <TimelineItem label="Training Completed"       time={nurse.training_completed_at} />
                <TimelineItem label="License Verified"         time={nurse.license_verified_at} />
                <TimelineItem label="Eligibility Updated"      time={nurse.eligibility_updated_at} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showInviteModal && (
        <TrainingInviteModal
          nurse={nurse}
          onClose={() => setShowInviteModal(false)}
          onSuccess={(updated) => {
            onUpdate(updated)
            setShowInviteModal(false)
          }}
        />
      )}
    </>
  )
}
