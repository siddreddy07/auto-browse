import { workflowGraph } from "@/lib/schema"
import { nodeDefinitions } from "@/features/workflows/nodes/node-registry"
import toposort from "toposort"

export interface GraphProblem {
  message: string
  nodeId?: string
}

export function validateGraph({ nodes, edges }: workflowGraph): GraphProblem[] {
  const problems: GraphProblem[] = []

  const triggers = nodes.filter((n) => {
    const def = nodeDefinitions.find((d) => d.type === n.data.type)
    return def?.kind === "trigger"
  }).length

  if (triggers !== 1) {
    problems.push({
      message: `A Workflow needs to have exactly one Start trigger (found ${triggers})`,
    })
  }

  if (edges.length === 0) {
    problems.push({ message: "Connect your nodes before running" })
  } else {
    try {
      toposort(edges.map((e) => [e.source, e.target]))
    } catch {
      problems.push({
        message: "Workflow has a cycle - remove the loop before running !",
      })
    }
  }

  for (const node of nodes) {
    const def = nodeDefinitions.find((d) => d.type === node.data.type)
    if (!def || def.kind === "trigger") continue

    const nodeLabel = String(node.data.displayLabel || def.label)

    for (const field of def.fields) {
      if (!field.required) continue
      const value = node.data[field.key]
      const isEmpty =
        value === undefined || value === null || String(value).trim() === ""
      if (isEmpty) {
        problems.push({
          message: `Missing "${field.label}" in the "${nodeLabel}" node`,
          nodeId: node.id,
        })
      }
    }
  }

  return problems
}
