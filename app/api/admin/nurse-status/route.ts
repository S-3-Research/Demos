import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fields admin is allowed to update directly
const ALLOWED_FIELDS = new Set([
  'status',
  'training_status',
  'training_invitation_url',
  'training_started_at',
  'training_completed_at',
  'license_type',
  'license_number',
  'license_state',
  'license_expiration_date',
  'license_verification_status',
  'license_verified_at',
  'license_verification_notes',
  'eligible_for_matching',
  'eligibility_updated_at',
  'eligibility_notes',
  'admin_notes',
  'reviewed_at',
])

export async function PATCH(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const body = await req.json()
  const { id, updates } = body as { id: string; updates: Record<string, unknown> }

  if (!id || !updates || typeof updates !== 'object') {
    return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 })
  }

  // Filter to only allowed fields
  const safeUpdates: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_FIELDS.has(key)) {
      safeUpdates[key] = value
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // Auto-set reviewed_at when status changes away from pending
  if (safeUpdates.status && safeUpdates.status !== 'pending' && !safeUpdates.reviewed_at) {
    safeUpdates.reviewed_at = new Date().toISOString()
  }

  // Auto-set eligibility_updated_at when eligible_for_matching changes
  if ('eligible_for_matching' in safeUpdates && !safeUpdates.eligibility_updated_at) {
    safeUpdates.eligibility_updated_at = new Date().toISOString()
  }

  // Auto-set license_verified_at when license_verification_status → verified
  if (safeUpdates.license_verification_status === 'verified' && !safeUpdates.license_verified_at) {
    safeUpdates.license_verified_at = new Date().toISOString()
  }

  // Auto-set training timestamps
  if (safeUpdates.training_status === 'completed' && !safeUpdates.training_completed_at) {
    safeUpdates.training_completed_at = new Date().toISOString()
  }
  if (safeUpdates.training_status === 'in_progress' && !safeUpdates.training_started_at) {
    safeUpdates.training_started_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('nurse_applications')
    .update(safeUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[admin/nurse-status] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, nurse: data })
}
