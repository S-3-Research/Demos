import { SESClient } from '@aws-sdk/client-ses'

export const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION ?? 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
})

export const SES_FROM = 'ACHIEVE <onboarding@nexct.io>'
export const SES_REPLY_TO = 'place_holder@domain.com'
