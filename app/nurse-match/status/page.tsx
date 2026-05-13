import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookie } from '@/lib/nurseSession'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  pending:    { label: 'Under Review',    color: 'var(--teal-light)', desc: 'Your application has been received and is in our review queue. Early applicants are reviewed first.' },
  reviewing:  { label: 'In Review',       color: '#E8A820',           desc: 'Our team is actively reviewing your application. You will hear from us within 5–7 business days.' },
  selected:   { label: 'Selected ✦',      color: '#4ADE80',           desc: 'Congratulations! You have been selected for Cohort 4. Check your inbox for next steps.' },
  waitlisted: { label: 'Waitlisted',      color: '#94A3B8',           desc: 'You are on our waitlist. We will notify you if a spot opens up.' },
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
    <div style={{ minHeight: '100vh', background: '#040E1B', color: 'white' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-[100] flex items-center justify-between px-12 max-[860px]:px-6 py-4 border-b"
        style={{ background: 'var(--ink-mid)', borderColor: 'rgba(232,168,32,0.12)' }}
      >
        <div>
          <div className="font-cormorant font-bold text-[20px] tracking-[.05em]" style={{ color: 'var(--gold-bright)' }}>
            ACHIEVE
          </div>
          <div className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase" style={{ color: 'var(--teal-light)' }}>
            Research-Ready Nurse™ · {app.cohort}
          </div>
        </div>
        <span className="font-barlow text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {app.email}
        </span>
      </header>

      <main className="max-w-[640px] mx-auto px-6 py-16">

        {/* Email not verified warning */}
        {!app.email_verified && (
          <div
            className="mb-8 px-5 py-4 border rounded-[2px]"
            style={{ background: 'rgba(232,168,32,0.06)', borderColor: 'rgba(232,168,32,0.2)' }}
          >
            <p className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase mb-1" style={{ color: 'var(--gold-bright)' }}>
              ⚠ Email not yet confirmed
            </p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Please check your inbox and click the confirmation link to verify your email address.
            </p>
          </div>
        )}

        {/* Status card */}
        <div
          className="p-8 border rounded-[2px] mb-6"
          style={{ background: '#071828', borderColor: 'rgba(232,168,32,0.1)' }}
        >
          <p className="font-barlow font-bold text-[10px] tracking-[.24em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Application Status
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: statusCfg.color }} />
            <span className="font-cormorant font-bold text-[28px]" style={{ color: statusCfg.color }}>
              {statusCfg.label}
            </span>
          </div>
          <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {statusCfg.desc}
          </p>
        </div>

        {/* Applicant summary */}
        <div
          className="p-6 border rounded-[2px] mb-8"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="font-barlow font-bold text-[10px] tracking-[.22em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Your Application
          </p>
          <div className="flex flex-col gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div className="flex justify-between">
              <span>Name</span>
              <span className="text-white">{app.first_name} {app.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Applied</span>
              <span className="text-white">{new Date(app.applied_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Cohort</span>
              <span className="text-white">{app.cohort}</span>
            </div>
          </div>
        </div>

        {/* Edit button */}
        {app.applicant_can_edit && app.status !== 'rejected' && (
          <Link
            href="/nurse-match/edit"
            className="flex items-center justify-center gap-2 w-full py-[14px] border rounded-[2px]
              font-barlow font-bold text-[12px] tracking-[.16em] uppercase transition-all duration-200
              hover:bg-[rgba(11,110,120,0.1)] hover:border-[rgba(11,110,120,0.4)] mb-6"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            ✎ Update My Application
          </Link>
        )}

        {app.status === 'rejected' && (
          <div
            className="px-5 py-4 border rounded-[2px] mb-6 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              This application is closed and cannot be edited.
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-3">
          <Link
            href="/nurse-match/landing"
            className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,0.3)' }}
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
    <div style={{ minHeight: '100vh', background: '#040E1B', color: 'white' }}>
      <header
        className="sticky top-0 z-[100] flex items-center px-12 max-[860px]:px-6 py-4 border-b"
        style={{ background: 'var(--ink-mid)', borderColor: 'rgba(232,168,32,0.12)' }}
      >
        <div className="font-cormorant font-bold text-[20px] tracking-[.05em]" style={{ color: 'var(--gold-bright)' }}>
          ACHIEVE
        </div>
      </header>

      <main className="max-w-[480px] mx-auto px-6 py-20 text-center">
        <div className="text-[40px] mb-5">📬</div>
        <h1
          className="font-cormorant font-bold leading-none mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--cream)' }}
        >
          Check your status
        </h1>

        {msg && (
          <p className="text-[13px] leading-[1.6] mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {msg}
          </p>
        )}

        {!msg && (
          <p className="text-[14px] leading-[1.7] mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Enter your email address and we&apos;ll send you a secure link to view your application status.
          </p>
        )}

        <ResendLinkForm />

        <Link
          href="/nurse-match/landing"
          className="mt-8 inline-block font-barlow font-bold text-[11px] tracking-[.16em] uppercase transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          ← Back to Overview
        </Link>
      </main>
    </div>
  )
}

// ── Client component for the resend form ──────────────────────────────────────
import ResendLinkForm from './_components/ResendLinkForm'
