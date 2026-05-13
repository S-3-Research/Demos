import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionFromCookie } from '@/lib/nurseSession'
import { createClient } from '@supabase/supabase-js'
import EditForm from './_components/EditForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export default async function EditPage() {
  const session = await getSessionFromCookie()
  if (!session) redirect('/nurse-match/status')

  const { data: app } = await supabase
    .from('nurse_applications')
    .select(`
      first_name, last_name, email, status,
      applicant_can_edit,
      phone, role, specialty, years_experience, languages,
      state, city, zip, serves_underserved,
      motivation_text, goal, hours_per_month
    `)
    .eq('id', session.applicationId)
    .single()

  if (!app) redirect('/nurse-match/status')
  if (!app.applicant_can_edit || app.status === 'rejected') redirect('/nurse-match/status')

  const isSelectedLimited = app.status === 'selected'

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
            Update Your Application
          </div>
        </div>
        <Link
          href="/nurse-match/status"
          className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase transition-colors hover:text-white"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          ← Back to Status
        </Link>
      </header>

      <main className="max-w-[680px] mx-auto px-6 py-12">

        {/* Selected-mode notice */}
        {isSelectedLimited && (
          <div
            className="mb-8 px-5 py-4 border rounded-[2px]"
            style={{ background: 'rgba(232,168,32,0.05)', borderColor: 'rgba(232,168,32,0.2)' }}
          >
            <p className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase mb-1" style={{ color: 'var(--gold-bright)' }}>
              Limited editing — application selected
            </p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              You can update your contact info and availability. Qualification fields are locked.
            </p>
          </div>
        )}

        {/* Reviewing notice */}
        {app.status === 'reviewing' && (
          <div
            className="mb-8 px-5 py-4 border rounded-[2px]"
            style={{ background: 'rgba(11,110,120,0.07)', borderColor: 'rgba(11,110,120,0.25)' }}
          >
            <p className="font-barlow font-bold text-[11px] tracking-[.16em] uppercase mb-1" style={{ color: 'var(--teal-light)' }}>
              Currently under review
            </p>
            <p className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Saving changes will move your application back to <strong className="text-white">pending</strong> review.
            </p>
          </div>
        )}

        <EditForm app={app} isSelectedLimited={isSelectedLimited} />
      </main>
    </div>
  )
}
