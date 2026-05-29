import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { searchParams } = req.nextUrl

  const status              = searchParams.get('status')               // pending|reviewing|selected|rejected|waitlisted
  const trainingStatus      = searchParams.get('training_status')      // not_invited|invited|in_progress|completed|failed|waived
  const licenseStatus       = searchParams.get('license_status')       // not_started|pending|verified|failed|expired|waived
  const eligibleForMatching = searchParams.get('eligible_for_matching')// 'true'|'false'
  const emailVerified       = searchParams.get('email_verified')       // 'true'|'false'
  const search              = searchParams.get('search')               // name or email substring

  let query = supabase
    .from('nurse_applications')
    .select(`
      id, first_name, last_name, email, phone,
      role, specialty, years_experience, languages,
      state, city, zip, serves_underserved,
      motivation_text, goal, hours_per_month, source,
      email_verified, status, cohort,
      applied_at, verified_at, reviewed_at, admin_notes,
      training_status, training_invited_at, training_invitation_url,
      training_started_at, training_completed_at,
      training_status_updated_at,
      license_type, license_number, license_state, license_expiration_date,
      license_verification_status, license_verified_at, license_verification_notes,
      eligible_for_matching, eligibility_updated_at, eligibility_notes,
      latitude, longitude
    `)
    .order('applied_at', { ascending: false })

  if (status)              query = query.eq('status', status)
  if (trainingStatus)      query = query.eq('training_status', trainingStatus)
  if (licenseStatus)       query = query.eq('license_verification_status', licenseStatus)
  if (eligibleForMatching) query = query.eq('eligible_for_matching', eligibleForMatching === 'true')
  if (emailVerified)       query = query.eq('email_verified', emailVerified === 'true')

  if (search) {
    // Supabase ilike with OR via .or()
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('[admin/nurses] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ nurses: data ?? [] })
}
