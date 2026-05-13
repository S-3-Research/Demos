import { cookies } from 'next/headers'
import { verifySessionToken, type SessionTokenPayload } from './nurseToken'

export const SESSION_COOKIE = 'nurse_session'

/** 从 cookie 中读取并验证 session，返回 payload 或 null */
export async function getSessionFromCookie(): Promise<SessionTokenPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

/** 构建 session cookie 的属性（供 API route 的 NextResponse 使用） */
export function buildSessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30天（秒）
  }
}
