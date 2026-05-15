import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient, SES_FROM, SES_REPLY_TO } from './sesClient'

export async function sendVerificationEmail({
  to,
  firstName,
  magicLink,
}: {
  to: string
  firstName: string
  magicLink: string
}) {
  try {
    await sesClient.send(new SendEmailCommand({
      Source: SES_FROM,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [SES_REPLY_TO],
      Message: {
        Subject: { Data: 'Confirm your ACHIEVE application', Charset: 'UTF-8' },
        Body: { Html: { Data: buildEmailHtml({ firstName, magicLink }), Charset: 'UTF-8' } },
      },
    }))
  } catch (error) {
    console.error('[sendVerificationEmail] SES error:', error)
    throw new Error('Failed to send verification email')
  }
}

function buildEmailHtml({ firstName, magicLink }: { firstName: string; magicLink: string }) {
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
                Application Received
              </p>
              <h1 style="margin:0 0 20px 0;font-size:28px;font-weight:700;color:#F5F0E8;line-height:1.1;">
                Hi ${firstName}, confirm your email.
              </h1>
              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                We received your application for ACHIEVE Cohort 4. Click the button below
                to confirm your email address and secure your place in the review queue.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#C49A1A,#E8A820);border-radius:2px;">
                    <a href="${magicLink}"
                       style="display:inline-block;padding:16px 36px;font-size:13px;font-weight:700;
                              letter-spacing:.2em;text-transform:uppercase;color:#040E1B;
                              text-decoration:none;">
                      Confirm My Application →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <p style="margin:0 0 24px 0;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5;">
                This link expires in <strong style="color:rgba(255,255,255,0.5);">24 hours</strong>.
                If you didn't apply, you can safely ignore this email.
              </p>

              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 20px 0;" />

              <!-- What's next -->
              <p style="margin:0 0 12px 0;font-size:10px;font-weight:700;letter-spacing:.2em;
                         text-transform:uppercase;color:rgba(255,255,255,0.3);">
                What happens next
              </p>
              <div style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.45);">
                ◆&nbsp; Your application enters our rolling review queue<br/>
                ◆&nbsp; Selected nurses are notified within 5–7 business days<br/>
                ◆&nbsp; Early applicants are reviewed first
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                ACHIEVE · Research-Ready Nurse™ Program<br/>
                <a href="${magicLink}" style="color:rgba(255,255,255,0.2);word-break:break-all;">
                  ${magicLink}
                </a>
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
