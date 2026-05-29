import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signMagicToken } from '@/lib/nurseToken'
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { data: app } = await supabase
    .from('nurse_applications')
    .select('id, first_name, email')
    .eq('email', email.toLowerCase().trim())
    .single()

  // 无论是否找到，都返回 200，防止枚举邮箱
  if (!app) {
    return NextResponse.json({ success: true })
  }

  const token = await signMagicToken({ applicationId: app.id, email: app.email })
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const magicLink = `${appUrl}/api/nurse-match/verify?token=${token}`

  await sendVerificationEmail({ to: app.email, firstName: app.first_name, magicLink })

  return NextResponse.json({ success: true })
}
