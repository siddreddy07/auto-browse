import type { StagehandInstance } from "@/lib/stagehand"
import type { StepNodeData } from "./node-registry"
import { openUrl } from "./open-url"
import { aiAgent, type ToNode } from "./ai-agent"
import { sendEmail } from "./send-email"

export interface NodeContext {
  from: StepNodeData[]
  to: ToNode[]
}

export type NodeExecutor = (
  stagehand: StagehandInstance,
  data: StepNodeData,
  context: NodeContext,
) => Promise<unknown>

const executors: Record<string, NodeExecutor> = {
  openurl: (stagehand, data) => openUrl({ stagehand, url: String(data.url ?? "") }),
  agent: (_stagehand, data, context) =>
    aiAgent({
      model: typeof data.model === "string" ? data.model : undefined,
      apiKey: typeof data.apiKey === "string" ? data.apiKey : undefined,
      prompt: String(data.prompt ?? ""),
      from: context.from,
      to: context.to,
    }),
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
