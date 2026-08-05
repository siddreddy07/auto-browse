import type { Stagehand } from "@browserbasehq/stagehand"

export async function performAgent({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const agent = stagehand.agent()
  const result = await agent.execute(instruction)

  return {
    success: result.success,
    message: result.message,
    completed: result.completed,
  }
}
