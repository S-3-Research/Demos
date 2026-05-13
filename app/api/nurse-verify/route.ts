import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyMagicToken, signSessionToken } from '@/lib/nurseToken'
import { buildSessionCookieOptions } from '@/lib/nurseSession'

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return redirectToError('missing-token')
  }

  // 验证 magic token
  const payload = await verifyMagicToken(token)
  if (!payload) {
    return redirectToError('invalid-or-expired')
  }

  const { applicationId, email } = payload

  // 更新数据库：标记 email 已验证
  const { error } = await supabase
    .from('nurse_applications')
    .update({
      email_verified: true,
      verified_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .eq('email', email) // 双重核验

  if (error) {
    console.error('[nurse-verify] DB update error:', error)
    return redirectToError('db-error')
  }

  // 签发长效 session token（30天）
  const sessionToken = await signSessionToken({ applicationId, email })
  const cookieOptions = buildSessionCookieOptions(sessionToken)

  // 重定向到状态页，同时设 httpOnly cookie
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const response = NextResponse.redirect(`${appUrl}/nurse-match/status`)
  response.cookies.set(cookieOptions)

  return response
}

function redirectToError(reason: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return NextResponse.redirect(
    `${appUrl}/nurse-match/status?error=${reason}`,
  )
}
