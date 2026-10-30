import { Resend } from 'resend'
import { selectEmailRecipients } from './email-recipients'

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string,
) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('Email delivery disabled: RESEND_API_KEY is not configured')
    return
  }

  const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
  const recipients = selectEmailRecipients(to, from, process.env.RESEND_TEST_EMAIL)
  if (recipients.length === 0) {
    console.warn('Email delivery skipped: no permitted recipients')
    return
  }

  // Instantiate only after configuration checks so email remains optional locally.
  const resend = new Resend(apiKey)
  const result = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  })

  if (result.error) {
    if (from === 'onboarding@resend.dev') {
      console.warn('Test-mode email delivery failed', result.error.statusCode)
      return
    }
    throw new Error(`Resend API error: ${result.error.message}`)
  }
}
