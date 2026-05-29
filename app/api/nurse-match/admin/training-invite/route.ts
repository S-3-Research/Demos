import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTrainingInviteEmail } from '@/lib/email/sendTrainingInviteEmail'

const TRAINING_URL_PLACEHOLDER = 'https://training.achieve.org/cohort-4'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const body = await req.json()
  const { id, trainingUrl } = body as { id: string; trainingUrl?: string }

  if (!id) {
    return NextResponse.json({ error: 'Missing nurse application id' }, { status: 400 })
  }

  // Fetch the nurse
  const { data: nurse, error: fetchErr } = await supabase
    .from('nurse_applications')
    .select('id, first_name, email, training_status')
    .eq('id', id)
    .single()

  if (fetchErr || !nurse) {
    return NextResponse.json({ error: 'Nurse not found' }, { status: 404 })
  }

  const resolvedUrl = trainingUrl?.trim() || TRAINING_URL_PLACEHOLDER

  // Update DB first
  const { error: updateErr } = await supabase
    .from('nurse_applications')
    .update({
      training_status: 'invited',
      training_invited_at: new Date().toISOString(),
      training_invitation_url: resolvedUrl,
      training_status_updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateErr) {
    console.error('[admin/training-invite] DB update error:', updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Send email
  try {
    await sendTrainingInviteEmail({
      to: nurse.email,
      firstName: nurse.first_name,
      trainingUrl: resolvedUrl,
    })
  } catch (emailErr) {
    console.error('[admin/training-invite] Email error:', emailErr)
    // Email failed — rollback training_status to prior value
    await supabase
      .from('nurse_applications')
      .update({
        training_status: nurse.training_status,
        training_invited_at: null,
        training_invitation_url: null,
        training_status_updated_at: null,
      })
      .eq('id', id)
    return NextResponse.json({ error: 'Failed to send email. DB changes rolled back.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, trainingUrl: resolvedUrl })
}
