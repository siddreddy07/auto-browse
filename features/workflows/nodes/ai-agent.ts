import { generateText } from "ai"
import { createOllama } from "ollama-ai-provider-v2"
import { nodeDefinitions, type StepNodeData } from "./node-registry"

export const DEFAULT_AGENT_MODEL = "qwen3.5:9b"

export type ToNode = { id: string; data: StepNodeData }

export async function aiAgent(fields: {
  model?: string
  apiKey?: string
  prompt: string
  from: StepNodeData[]
  to: ToNode[]
}) {
  const { model, prompt, from, to } = fields
  const targetId = to[0]?.id
  const modelName = model?.trim() || DEFAULT_AGENT_MODEL
  const userPrompt =
    prompt.trim() ||
    "Generate the JSON input for the next node based on the previous node outputs."
  const provider = createOllama({
    baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/api",
  })

  console.log("AI Agent Input:", {
    model: modelName,
    prompt: userPrompt,
    from: from.map((f) => ({ type: f.type, output: f.output })),
    to: to.map((t) => ({ id: t.id, type: t.data.type })),
  })

  const result = await generateText({
    model: provider(modelName),
    system: buildSystemPrompt(from, to),
    prompt: userPrompt,
  })

  console.log("AI Agent Output (raw):", result.text)

  let parsed: Record<string, unknown> = {}
  try {
    parsed = JSON.parse(result.text)

    console.log("AI Agent Output (parsed):", parsed)

  } catch (error) {
    throw new Error(`AI Agent output was not valid JSON:\n${result.text}`, { cause: error })
  }

  return {
    ...parsed,
    id: targetId,
    response: result.text,
    model: modelName,
    usage: result.usage,
  }
}

function buildSystemPrompt(from: StepNodeData[], to: ToNode[]): string {
  return [
    "You are an AI agent in a workflow. Generate a JSON object for the next node.",
    `Previous node outputs:\n${describeNodes(from)}`,
    `Next node input fields:\n${describeNodes(to.map((t) => t.data))}`,
    "Return only a JSON object with exactly those keys. No extra text.",
  ].join("\n\n")
}

function describeNodes(nodes: StepNodeData[]): string {
  if (nodes.length === 0) return "(none)"
  return nodes
    .map((node) => {
      const def = nodeDefinitions.find((d) => d.type === node.type)
      const fields = (def?.fields ?? []).map((f) => `${f.key}: ${f.type}`).join(", ")
      return `${node.displayLabel || node.type}: output=${JSON.stringify(node.output)} | expects=${fields || "none"}`
    })
    .join("\n")
}
