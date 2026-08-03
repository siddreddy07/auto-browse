export async function sendEmail(fields: {
  to: string
  subject?: string
  body?: string
}) {
  const { to, subject, body } = fields

  return {
    to,
    subject: subject ?? "",
    body: body ?? "",
  }
}
