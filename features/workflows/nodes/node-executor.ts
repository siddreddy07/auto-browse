import type { StagehandInstance } from "@/lib/stagehand"
import type { StepNodeData } from "./node-registry"
import { openUrl } from "./open-url"
import { sendEmail } from "./send-email"
import { performAct } from "./act"
import { performExtract } from "./extract"
import { performObserve } from "./observe"
import { performAgent } from "./agent"

export type NodeExecutor = (
  stagehand: StagehandInstance | undefined,
  data: StepNodeData
) => Promise<unknown>

const BROWSER_NODE_TYPES = new Set([
  "openurl",
  "act",
  "extract",
  "observe",
  "agent",
])

export function needsBrowser(type: string): boolean {
  return BROWSER_NODE_TYPES.has(type)
}

function requireStagehand(
  stagehand: StagehandInstance | undefined,
  nodeLabel: string
): StagehandInstance {
  if (!stagehand) {
    throw new Error(
      `${nodeLabel} node requires a browser session, but none was started.`
    )
  }
  return stagehand
}

const executors: Record<string, NodeExecutor> = {
  openurl: (stagehand, data) =>
    openUrl({
      stagehand: requireStagehand(stagehand, "Open URL"),
      url: String(data.url ?? ""),
    }),
  act: (stagehand, data) =>
    performAct({
      stagehand: requireStagehand(stagehand, "Act"),
      instruction: String(data.instruction ?? ""),
    }),
  extract: (stagehand, data) =>
    performExtract({
      stagehand: requireStagehand(stagehand, "Extract Data"),
      instruction: String(data.instruction ?? ""),
    }),
  observe: (stagehand, data) =>
    performObserve({
      stagehand: requireStagehand(stagehand, "Observe"),
      instruction: String(data.instruction ?? ""),
    }),
  agent: (stagehand, data) =>
    performAgent({
      stagehand: requireStagehand(stagehand, "Agent"),
      instruction: String(data.instruction ?? ""),
    }),
  "send-email": (_stagehand, data) =>
    sendEmail({
      to: String(data.to ?? ""),
      subject: typeof data.subject === "string" ? data.subject : undefined,
      body: typeof data.body === "string" ? data.body : undefined,
    }),
}

export async function executeNode(
  stagehand: StagehandInstance | undefined,
  data: StepNodeData
) {
  const executor = executors[data.type]
  if (!executor) {
    throw new Error(`No executor registered for node type: ${data.type}`)
  }
  return executor(stagehand, data)
}
