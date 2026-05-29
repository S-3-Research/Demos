import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { signMagicToken } from '@/lib/nurseToken'
import { sendVerificationEmail } from '@/lib/email/sendVerificationEmail'
import { sendAlreadyRegisteredEmail } from '@/lib/email/sendAlreadyRegisteredEmail'

export async function POST(req: NextRequest) {
  try {
    // 使用 service_role key 绕过 RLS，只在服务端使用
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const body = await req.json()

    const {
      firstName, lastName, email, phone,
      role, specialty, yearsExperience, languages,
      address, state, city, zip, servesUnderserved,
      motivationText, goal,
      hoursPerMonth, source,
      specialExperience,
    } = body

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // 检查是否已申请过
    const { data: existing } = await supabase
      .from('nurse_applications')
      .select('id, first_name, email')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      // 已有记录：不覆盖，发引导邮件让护士通过 magic link 自行修改
      const token = await signMagicToken({ applicationId: existing.id, email: normalizedEmail })
      const magicLink = `${appUrl}/api/nurse-match/verify?token=${token}`
      await sendAlreadyRegisteredEmail({
        to: normalizedEmail,
        firstName: existing.first_name,
        magicLink,
      })
      // 返回特殊 code，让前端显示引导提示而非报错
      return NextResponse.json({ code: 'ALREADY_REGISTERED' }, { status: 200 })
    }

    // 全新申请：INSERT
    const { data, error } = await supabase
      .from('nurse_applications')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: normalizedEmail,
        phone,
        role,
        specialty: Array.isArray(specialty) ? specialty : specialty ? [specialty] : [],
        years_experience: yearsExperience,
        languages: Array.isArray(languages) ? languages : languages ? [languages] : [],
        address, state, city, zip,
        serves_underserved: servesUnderserved,
        motivation_text: motivationText,
        goal,
        hours_per_month: hoursPerMonth,
        source,
        special_experience: Array.isArray(specialExperience) ? specialExperience : specialExperience ? [specialExperience] : [],
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error('[nurse-apply] Insert error:', error)
      return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
    }

    // 发验证邮件
    const token = await signMagicToken({ applicationId: data.id, email: normalizedEmail })
    const magicLink = `${appUrl}/api/nurse-match/verify?token=${token}`
    await sendVerificationEmail({ to: normalizedEmail, firstName, magicLink })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[nurse-apply] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
