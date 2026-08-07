import { Resend, type CreateEmailOptions } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(
  options: CreateEmailOptions,
  idempotencyKey?: string
) {
  const { data, error } = await resend.emails.send(
    options,
    idempotencyKey ? { idempotencyKey } : undefined
  )

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`, {
      cause: error,
    })
  }

  return data
}
