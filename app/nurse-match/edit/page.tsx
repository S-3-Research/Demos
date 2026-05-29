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
      address, state, city, zip, serves_underserved,
      motivation_text, goal, hours_per_month, special_experience
    `)
    .eq('id', session.applicationId)
    .single()

  if (!app) redirect('/nurse-match/status')
  if (!app.applicant_can_edit || app.status === 'rejected') redirect('/nurse-match/status')

  const isSelectedLimited = app.status === 'selected'

  return (
    <div className="min-h-screen bg-[#071828] text-white">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[#0a1f30] border-b border-white/[0.07] flex items-center justify-between px-12 py-[14px]">
        <div>
          <div className="font-[family-name:var(--font-display,'DM_Serif_Display',Georgia,serif)] text-xl text-white font-bold">
            ACHIEVE
          </div>
          <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#1a8c9e]">
            Update Your Application
          </div>
        </div>
        <Link
          href="/nurse-match/status"
          className="text-[11px] font-bold tracking-[0.16em] uppercase text-white/35 no-underline"
        >
          ← Back to Status
        </Link>
      </header>

      <main className="max-w-[680px] mx-auto px-6 py-12">

        {/* Selected-mode notice */}
        {isSelectedLimited && (
          <div className="bg-[rgba(212,146,10,0.07)] border border-[rgba(212,146,10,0.22)] rounded-lg px-5 py-4 mb-7">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#d4920a] mb-1">
              Limited editing — application selected
            </p>
            <p className="text-[13px] leading-relaxed text-white/45">
              You can update your contact info and availability. Qualification fields are locked.
            </p>
          </div>
        )}

        {/* Reviewing notice */}
        {app.status === 'reviewing' && (
          <div className="bg-[rgba(26,140,158,0.07)] border border-[rgba(26,140,158,0.22)] rounded-lg px-5 py-4 mb-7">
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#1a8c9e] mb-1">
              Currently under review
            </p>
            <p className="text-[13px] leading-relaxed text-white/45">
              Saving changes will move your application back to <strong className="text-white">pending</strong> review.
            </p>
          </div>
        )}

        <EditForm app={app} isSelectedLimited={isSelectedLimited} />
      </main>
    </div>
  )
}
