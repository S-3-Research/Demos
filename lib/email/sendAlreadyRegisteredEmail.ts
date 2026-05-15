import { SendEmailCommand } from '@aws-sdk/client-ses'
import { sesClient, SES_FROM, SES_REPLY_TO } from './sesClient'

export async function sendAlreadyRegisteredEmail({
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
        Subject: { Data: 'You already have an ACHIEVE application', Charset: 'UTF-8' },
        Body: { Html: { Data: buildEmailHtml({ firstName, magicLink }), Charset: 'UTF-8' } },
      },
    }))
  } catch (error) {
    console.error('[sendAlreadyRegisteredEmail] SES error:', error)
    throw new Error('Failed to send email')
  }
}

function buildEmailHtml({ firstName, magicLink }: { firstName: string; magicLink: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#040E1B;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#040E1B;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <tr>
            <td style="padding:0 0 28px 0;text-align:center;">
              <div style="font-size:22px;font-weight:700;letter-spacing:.05em;color:#C49A1A;">ACHIEVE</div>
              <div style="font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#0B6E78;margin-top:2px;">
                Research-Ready Nurse™ · Cohort 4
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#071828;border:1px solid rgba(232,168,32,0.12);border-radius:4px;padding:40px 36px;">

              <p style="margin:0 0 8px 0;font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#0B6E78;">
                Application Found
              </p>
              <h1 style="margin:0 0 20px 0;font-size:26px;font-weight:700;color:#F5F0E8;line-height:1.2;">
                Hi ${firstName}, you already have an application on file.
              </h1>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                We received a new submission with your email address, but an application already exists.
                To protect your data, we did <strong style="color:white;">not</strong> overwrite anything.
              </p>
              <p style="margin:0 0 28px 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.55);">
                Click below to access your existing application, check its status, or make updates.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,#0B6E78,#14A0AD);border-radius:2px;">
                    <a href="${magicLink}"
                       style="display:inline-block;padding:16px 36px;font-size:13px;font-weight:700;
                              letter-spacing:.2em;text-transform:uppercase;color:white;text-decoration:none;">
                      View My Application →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;font-size:12px;color:rgba(255,255,255,0.3);line-height:1.5;">
                This link expires in <strong style="color:rgba(255,255,255,0.5);">24 hours</strong>.
                If you didn't submit anything, you can safely ignore this email.
              </p>

              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 20px 0;" />

              <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.35);">
                If you believe this is an error or need help, reply to this email.
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:24px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                ACHIEVE · Research-Ready Nurse™ Program
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
