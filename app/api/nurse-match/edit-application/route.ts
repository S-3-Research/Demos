import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSessionFromCookie } from '@/lib/nurseSession'

// 所有字段 — pending / reviewing / waitlisted 可改
const ALL_EDITABLE = [
  'phone', 'role', 'specialty', 'years_experience', 'languages',
  'address', 'state', 'city', 'zip', 'serves_underserved',
  'motivation_text', 'goal', 'hours_per_month', 'special_experience',
] as const

// 仅 contact / availability — selected 时只允许改这些
const CONTACT_EDITABLE = [
  'phone', 'address', 'state', 'city', 'zip', 'hours_per_month', 'languages',
] as const

export async function PATCH(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const session = await getSessionFromCookie()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 读取当前申请状态
  const { data: current, error: fetchErr } = await supabase
    .from('nurse_applications')
    .select('status, applicant_can_edit')
    .eq('id', session.applicationId)
    .single()

  if (fetchErr || !current) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  // 拒绝 locked 或 rejected
  if (!current.applicant_can_edit) {
    return NextResponse.json({ error: 'Your application is locked and cannot be edited.' }, { status: 403 })
  }
  if (current.status === 'rejected') {
    return NextResponse.json({ error: 'Rejected applications cannot be edited.' }, { status: 403 })
  }

  const body = await req.json()

  // 按 status 决定允许编辑的字段
  const allowedFields = current.status === 'selected'
    ? CONTACT_EDITABLE
    : ALL_EDITABLE

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  // array fields stored as TEXT[] — ensure they are arrays
  for (const arrField of ['languages', 'specialty', 'special_experience'] as const) {
    if (arrField in updates) {
      if (typeof updates[arrField] === 'string') {
        updates[arrField] = (updates[arrField] as string)
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
      } else if (!Array.isArray(updates[arrField])) {
        updates[arrField] = []
      }
    }
  }

  // 如果正在 reviewing，编辑后重置为 pending
  const wasReviewing = current.status === 'reviewing'
  if (wasReviewing) {
    updates.status = 'pending'
    updates.reviewed_at = null
  }

  // 维护编辑追踪字段（updated_at 由 DB trigger 自动处理）
  updates.last_applicant_edited_at = new Date().toISOString()

  const { error: updateErr } = await supabase
    .from('nurse_applications')
    .update(updates)
    .eq('id', session.applicationId)

  if (updateErr) {
    console.error('[nurse-application/edit] Update error:', updateErr)
    return NextResponse.json({ error: 'Failed to save changes.' }, { status: 500 })
  }

  // applicant_edit_count++ 单独做（避免竞态用 RPC，MVP 直接读再写）
  await supabase.rpc('increment_edit_count', { app_id: session.applicationId }).maybeSingle()

  return NextResponse.json({
    success: true,
    resetToReview: wasReviewing,
  })
}
