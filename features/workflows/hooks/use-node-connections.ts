"use client"

import { useStore } from "@xyflow/react"
import { Circle, type LucideIcon } from "lucide-react"
import { nodeDefinitions, type NodeOutput, type StepNodeData } from "../nodes/node-registry"

export interface NodeConnection {
  id: string
  type: string
  label: string
  accent: string
  icon: LucideIcon
  output: NodeOutput[]
  data: StepNodeData
}

function toNodeConnection(id: string, data?: StepNodeData): NodeConnection {
  const def = nodeDefinitions.find((d) => d.type === data?.type)
  return {
    id,
    type: data?.type ?? "",
    label: data?.displayLabel || def?.label || data?.type || "Unknown",
    accent: def?.accent ?? "#6b7280",
    icon: def?.icon ?? Circle,
    output: def?.output ?? [],
    data: data ?? { type: "" },
  }
}

export function useNodeConnections(nodeId?: string) {
  return useStore((s) => {
    if (!nodeId) return { ancestors: [], descendants: [] }

    const dataById = new Map<string, StepNodeData>()
    for (const n of s.nodes) {
      dataById.set(n.id, n.data as StepNodeData)
    }

    const incoming: Record<string, string[]> = {}
    const outgoing: Record<string, string[]> = {}
    for (const edge of s.edges) {
      ;(incoming[edge.target] ??= []).push(edge.source)
      ;(outgoing[edge.source] ??= []).push(edge.target)
    }

    const collect = (direction: "in" | "out"): NodeConnection[] => {
      const visited = new Set<string>()
      const queue = [nodeId]
      while (queue.length > 0) {
        const current = queue.shift()!
        const neighbors = direction === "in" ? incoming[current] : outgoing[current]
        for (const neighbor of neighbors ?? []) {
          if (visited.has(neighbor)) continue
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
      return [...visited].map((id) => toNodeConnection(id, dataById.get(id)))
    }

    return { ancestors: collect("in"), descendants: collect("out") }
  })
}
