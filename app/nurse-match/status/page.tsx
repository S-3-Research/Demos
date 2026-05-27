import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookie } from '@/lib/nurseSession'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  pending:    { label: 'Under Review',    color: '#1a8c9e', desc: 'Your application has been received and is in our review queue. Early applicants are reviewed first.' },
  reviewing:  { label: 'In Review',       color: '#d4920a', desc: 'Our team is actively reviewing your application. You will hear from us within 5–7 business days.' },
  selected:   { label: 'Selected ✦',      color: '#4ade80', desc: 'Congratulations! You have been selected for Cohort 4. Check your inbox for next steps.' },
  waitlisted: { label: 'Waitlisted',      color: '#94a3b8', desc: 'You are on our waitlist. We will notify you if a spot opens up.' },
  rejected:   { label: 'Not Selected',    color: 'rgba(255,255,255,0.3)', desc: 'Thank you for applying. We were unable to offer you a spot in this cohort.' },
}

export default async function NurseStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error: errorParam } = await searchParams
  const session = await getSessionFromCookie()

  // 无 session：显示"请求新链接"界面
  if (!session) {
    return <RequestNewLink errorParam={errorParam} />
  }

  // 有 session：读取申请数据
  const { data: app } = await supabase
    .from('nurse_applications')
    .select('first_name, last_name, email, status, email_verified, applied_at, cohort, applicant_can_edit')
    .eq('id', session.applicationId)
    .single()

  if (!app) redirect('/nurse-match/landing/apply')

  const statusCfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending

  return (
    <div className="min-h-screen bg-[#071828] text-white">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[#0a1f30] border-b border-white/[0.07] flex items-center justify-between px-12 py-[14px]">
        <div>
          <div className="text-white font-bold text-[20px]" style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)' }}>
            ACHIEVE
          </div>
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#1a8c9e]">
            Research-Ready Nurse™ · {app.cohort}
          </div>
        </div>
        <span className="text-[12px] text-white/30">
          {app.email}
        </span>
      </header>

      <main className="max-w-[640px] mx-auto px-6 py-16">

        {/* Email not verified warning */}
        {!app.email_verified && (
          <div className="bg-[#d4920a]/[0.07] border border-[#d4920a]/[0.22] rounded-[8px] px-5 py-4 mb-8">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#d4920a] mb-1">
              ⚠ Email not yet confirmed
            </p>
            <p className="text-[13px] leading-[1.5] text-white/45">
              Please check your inbox and click the confirmation link to verify your email address.
            </p>
          </div>
        )}

        {/* Status card */}
        <div className="bg-[#0c2236] border border-white/[0.07] rounded-[10px] p-8 mb-6">
          <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-white/30 mb-3">
            Application Status
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusCfg.color }} />
            <span
              className="text-[32px] text-white font-normal"
              style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)' }}
            >
              {statusCfg.label}
            </span>
          </div>
          <p className="text-[14px] leading-[1.7] text-white/50">
            {statusCfg.desc}
          </p>
        </div>

        {/* Applicant summary */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-[10px] p-6 mb-8">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/30 mb-4">
            Your Application
          </p>
          <div className="flex flex-col gap-[10px] text-[13px] text-white/50">
            <div className="flex justify-between">
              <span>Name</span>
              <span className="text-white font-semibold">{app.first_name} {app.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Applied</span>
              <span className="text-white font-semibold">{new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Cohort</span>
              <span className="text-white font-semibold">{app.cohort}</span>
            </div>
          </div>
        </div>

        {/* Edit button */}
        {app.applicant_can_edit && app.status !== 'rejected' && (
          <Link
            href="/nurse-match/edit"
            className="flex items-center justify-center gap-2 w-full px-0 py-[14px] border border-white/10 rounded-[8px] text-[12px] font-bold tracking-[0.16em] uppercase text-white/55 no-underline mb-6 bg-white/[0.03] transition-all duration-200"
          >
            ✎ Update My Application
          </Link>
        )}

        {app.status === 'rejected' && (
          <div className="px-5 py-4 border border-white/[0.06] rounded-[8px] mb-6 text-center bg-white/[0.02]">
            <p className="text-[13px] text-white/30">
              This application is closed and cannot be edited.
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-3">
          <Link
            href="/nurse-match/landing"
            className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/30 no-underline"
          >
            ← Back to Overview
          </Link>
        </div>
      </main>
    </div>
  )
}

function RequestNewLink({ errorParam }: { errorParam?: string }) {
  const errorMessages: Record<string, string> = {
    'invalid-or-expired': 'That link has expired or is invalid. Enter your email below to receive a new one.',
    'missing-token':      'No verification token found. Enter your email below to receive a new link.',
    'db-error':           'Something went wrong on our end. Please try again.',
  }
  const msg = errorParam ? (errorMessages[errorParam] ?? errorMessages['invalid-or-expired']) : null

  return (
    <div className="min-h-screen bg-[#071828] text-white">
      <header className="sticky top-0 z-[100] bg-[#0a1f30] border-b border-white/[0.07] flex items-center px-12 py-[14px]">
        <div className="text-white font-bold text-[20px]" style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)' }}>
          ACHIEVE
        </div>
      </header>

      <main className="max-w-[480px] mx-auto px-6 pt-20 pb-10 text-center">
        <div className="text-[40px] mb-5">📬</div>
        <h1
          className="text-white font-normal mb-3"
          style={{ fontFamily: 'var(--font-display, "DM Serif Display", Georgia, serif)', fontSize: 'clamp(28px, 4vw, 40px)' }}
        >
          Check your status
        </h1>

        {msg && (
          <p className="text-[13px] leading-[1.6] text-white/45 mb-6">
            {msg}
          </p>
        )}

        {!msg && (
          <p className="text-[14px] leading-[1.7] text-white/50 mb-8">
            Enter your email address and we&apos;ll send you a secure link to view your application status.
          </p>
        )}

        <ResendLinkForm />

        <Link
          href="/nurse-match/landing"
          className="mt-8 inline-block text-[11px] font-bold tracking-[0.16em] uppercase text-white/25 no-underline"
        >
          ← Back to Overview
        </Link>
      </main>
    </div>
  )
}

// ── Client component for the resend form ──────────────────────────────────────
import ResendLinkForm from './_components/ResendLinkForm'
