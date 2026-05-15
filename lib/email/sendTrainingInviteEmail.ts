import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient, SES_FROM, SES_REPLY_TO } from './sesClient'

export async function sendTrainingInviteEmail({
  to,
  firstName,
  trainingUrl,
}: {
  to: string
  firstName: string
  trainingUrl: string
}) {
  try {
    await sesClient.send(new SendEmailCommand({
      Source: SES_FROM,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [SES_REPLY_TO],
      Message: {
        Subject: { Data: 'Your ACHIEVE Training Has Been Scheduled', Charset: 'UTF-8' },
        Body: { Html: { Data: buildEmailHtml({ firstName, trainingUrl }), Charset: 'UTF-8' } },
      },
    }))
  } catch (error) {
    console.error('[sendTrainingInviteEmail] SES error:', error)
    throw new Error('Failed to send training invite email')
  }
}

function buildEmailHtml({ firstName, trainingUrl }: { firstName: string; trainingUrl: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#040E1B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#040E1B;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 28px 0;text-align:center;">
              <div style="font-size:22px;font-weight:700;letter-spacing:.05em;color:#C49A1A;">
                ACHIEVE
              </div>
              <div style="font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#0B6E78;margin-top:2px;">
                Research-Ready Nurse™ · Cohort 4
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#071828;border:1px solid rgba(232,168,32,0.12);border-radius:4px;padding:40px 36px;">

              <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#0B6E78;">
                Next Step: Training
              </p>
              <h1 style="margin:0 0 20px 0;font-size:28px;font-weight:700;color:#F5F0E8;line-height:1.1;">
                Congratulations, ${firstName}.
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                You've been selected to move forward in the ACHIEVE Cohort 4 program.
                Your next step is to complete the Research-Ready Nurse™ training module.
                Click the button below to begin.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#C49A1A,#E8A820);border-radius:2px;">
                    <a href="${trainingUrl}"
                       style="display:inline-block;padding:16px 36px;font-size:13px;font-weight:700;
                              letter-spacing:.2em;text-transform:uppercase;color:#040E1B;
                              text-decoration:none;">
                      Start Training →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <p style="margin:0 0 24px 0;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${trainingUrl}" style="color:rgba(255,255,255,0.4);word-break:break-all;">${trainingUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 20px 0;" />

              <!-- What's next -->
              <p style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:.2em;
                         text-transform:uppercase;color:rgba(255,255,255,0.3);">
                What happens next
              </p>
              <div style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.45);">
                ◆&nbsp; Complete the training module at your own pace<br/>
                ◆&nbsp; Our team will verify your completion and licensure<br/>
                ◆&nbsp; Once cleared, you'll be eligible for clinical trial matching
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                ACHIEVE · Research-Ready Nurse™ Program<br/>
                Questions? Reply to this email or contact your program coordinator.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
