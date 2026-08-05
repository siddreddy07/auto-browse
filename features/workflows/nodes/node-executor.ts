import type { StagehandInstance } from "@/lib/stagehand"
import type { StepNodeData } from "./node-registry"
import { openUrl } from "./open-url"
import { sendEmail } from "./send-email"
import { performAct } from "./act"
import { performExtract } from "./extract"
import { performObserve } from "./observe"
import { performAgent } from "./agent"

export interface NodeContext {
  from: StepNodeData[]
  to: { id: string; data: StepNodeData }[]
}

export type NodeExecutor = (
  stagehand: StagehandInstance,
  data: StepNodeData,
  context: NodeContext,
) => Promise<unknown>

const executors: Record<string, NodeExecutor> = {
  openurl: (stagehand, data) => openUrl({ stagehand, url: String(data.url ?? "") }),
  act: (stagehand, data) =>
    performAct({ stagehand, instruction: String(data.instruction ?? "") }),
  extract: (stagehand, data) =>
    performExtract({ stagehand, instruction: String(data.instruction ?? "") }),
  observe: (stagehand, data) =>
    performObserve({ stagehand, instruction: String(data.instruction ?? "") }),
  agent: (stagehand, data) =>
    performAgent({ stagehand, instruction: String(data.instruction ?? "") }),
  "send-email": (_stagehand, data) =>
    sendEmail({
      to: String(data.to ?? ""),
      subject: typeof data.subject === "string" ? data.subject : undefined,
      body: typeof data.body === "string" ? data.body : undefined,
    }),
}

export async function executeNode(
  stagehand: StagehandInstance,
  data: StepNodeData,
  context: NodeContext,
) {
  const executor = executors[data.type]
  if (!executor) {
    throw new Error(`No executor registered for node type: ${data.type}`)
  }
  return executor(stagehand, data, context)
}
