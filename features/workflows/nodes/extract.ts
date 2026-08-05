import type { Stagehand } from "@browserbasehq/stagehand"

export async function performExtract({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const result = await stagehand.extract(instruction)

  return {
    extraction: result.extraction,
  }
}
