import { createClient } from '@supabase/supabase-js'
import { AdminShell } from './_components/AdminShell'
import type { NurseApplication } from './_components/types'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export default async function AdminPage() {
  const { data, error } = await supabase
    .from('nurse_applications')
    .select(`
      id, first_name, last_name, email, phone,
      role, specialty, years_experience, languages,
      address, state, city, zip, serves_underserved,
      motivation_text, goal, hours_per_month, source,
      email_verified, status, cohort,
      applied_at, verified_at, reviewed_at, admin_notes,
      training_status, training_invited_at, training_invitation_url,
      training_started_at, training_completed_at, training_status_updated_at,
      license_type, license_number, license_state, license_expiration_date,
      license_verification_status, license_verified_at, license_verification_notes,
      eligible_for_matching, eligibility_updated_at, eligibility_notes,
      latitude, longitude
    `)
    .order('applied_at', { ascending: false })

  if (error) {
    console.error('[admin/page] Supabase error:', error)
  }

  const nurses: NurseApplication[] = (data ?? []) as NurseApplication[]

  return <AdminShell initialNurses={nurses} />
}
