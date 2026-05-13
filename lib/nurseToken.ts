import { SignJWT, jwtVerify } from 'jose'

const secret = () => {
  const s = process.env.NURSE_TOKEN_SECRET
  if (!s) throw new Error('NURSE_TOKEN_SECRET env var is not set')
  return new TextEncoder().encode(s)
}

export type MagicTokenPayload = {
  applicationId: string
  email: string
  type: 'verify'
}

export type SessionTokenPayload = {
  applicationId: string
  email: string
  type: 'session'
}

/** 签发一次性邮件验证 token，24小时有效 */
export async function signMagicToken(payload: Omit<MagicTokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'verify' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret())
}

/** 签发长效 session token，30天有效 */
export async function signSessionToken(payload: Omit<SessionTokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'session' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(secret())
}

/** 验证 magic token，返回 payload 或 null */
export async function verifyMagicToken(token: string): Promise<MagicTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.type !== 'verify') return null
    return payload as unknown as MagicTokenPayload
  } catch {
    return null
  }
}

/** 验证 session token，返回 payload 或 null */
export async function verifySessionToken(token: string): Promise<SessionTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (payload.type !== 'session') return null
    return payload as unknown as SessionTokenPayload
  } catch {
    return null
  }
}
