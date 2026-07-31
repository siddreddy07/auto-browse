import { getStagehand, type StagehandInstance } from "@/lib/stagehand"
import type { StepNodeData } from "./node-registry"
import { openUrl } from "./open-url"

export type NodeExecutor = (stagehand: StagehandInstance, data: StepNodeData) => Promise<unknown>

const executors: Record<string, NodeExecutor> = {
  openurl: (stagehand, data) => openUrl({ stagehand, url: data.url ?? "" }),
}

export async function executeNode(stagehand: StagehandInstance, data: StepNodeData) {
  const executor = executors[data.type]
  if (!executor) {
    throw new Error(`No executor registered for node type: ${data.type}`)
  }
  return executor(stagehand, data)
}
