import type { Stagehand } from "@browserbasehq/stagehand"

export async function performObserve({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const actions = await stagehand.observe(instruction)

  return {
    matches: actions.map((action) => ({
      selector: action.selector,
      description: action.description,
    })),
  }
}
