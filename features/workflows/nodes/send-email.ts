import { sendEmail as sendEmailWithResend } from "@/lib/resend"

const FROM_ADDRESS = "onboarding@resend.dev"

export async function sendEmail(fields: {
  to: string
  subject?: string
  body?: string
}) {
  const { to, subject, body } = fields

  const { id } = await sendEmailWithResend({
    from: FROM_ADDRESS,
    to: [to],
    subject: subject ?? "",
    text: body ?? "",
  })

  return { emailId: id }
}
