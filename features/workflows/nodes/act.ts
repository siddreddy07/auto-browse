import type { Stagehand } from "@browserbasehq/stagehand"

export async function performAct({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const result = await stagehand.act(instruction)

  return {
    success: result.success,
    message: result.message,
    url: stagehand.context.pages()[0].url(),
  }
}
