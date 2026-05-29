import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSessionFromCookie } from '@/lib/nurseSession'

// 允许更新的字段白名单（防止护士改 status、email_verified 等系统字段）
const UPDATABLE_FIELDS = [
  'phone', 'role', 'specialty', 'years_experience', 'languages',
  'address', 'state', 'city', 'zip', 'serves_underserved',
  'motivation_text', 'goal', 'hours_per_month', 'source',
] as const

/** GET /api/nurse-profile — 读取护士自己的资料 */
function makeSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  const supabase = makeSupabase()
  const session = await getSessionFromCookie()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('nurse_applications')
    .select('*')
    .eq('id', session.applicationId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 不返回 admin_notes 等敏感字段
  const { admin_notes: _, ...safeData } = data
  return NextResponse.json(safeData)
}

/** PATCH /api/nurse-profile — 更新护士自己的资料 */
export async function PATCH(req: NextRequest) {
  const supabase = makeSupabase()
  const session = await getSessionFromCookie()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // 只提取白名单字段
  const updates: Record<string, unknown> = {}
  for (const field of UPDATABLE_FIELDS) {
    if (field in body) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await supabase
    .from('nurse_applications')
    .update(updates)
    .eq('id', session.applicationId)

  if (error) {
    console.error('[nurse-profile] Update error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
