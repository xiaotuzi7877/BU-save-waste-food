/** Test-mode email must never be redirected to an unrelated mailbox. */
export function selectEmailRecipients(
  to: string | string[],
  fromEmail: string,
  testEmail?: string,
): string[] {
  const recipients = [...new Set((Array.isArray(to) ? to : [to])
    .map(email => email.trim())
    .filter(Boolean))]

  if (fromEmail !== 'onboarding@resend.dev') return recipients
  const allowed = testEmail?.trim().toLowerCase()
  if (!allowed) return []
  return recipients.filter(email => email.toLowerCase() === allowed)
}
