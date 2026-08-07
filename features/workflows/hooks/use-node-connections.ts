"use client"

import { useStore } from "@xyflow/react"
import { Circle, type LucideIcon } from "lucide-react"
import {
  nodeDefinitions,
  type NodeOutput,
  type StepNodeData,
} from "../nodes/node-registry"

export interface NodeConnection {
  id: string
  type: string
  label: string
  accent: string
  icon: LucideIcon
  kind: "trigger" | "action"
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
    kind: def?.kind ?? "action",
    output: def?.output ?? [],
    data: data ?? { type: "" },
  }
}

export function useNodeConnections(nodeId?: string) {
  return useStore((s) => {
    if (!nodeId) return { ancestors: [], descendants: [] }

    const dataById = new Map<string, StepNodeData>()
    for (const n of s.nodes) dataById.set(n.id, n.data as StepNodeData)

    const collect = (direction: "in" | "out") => {
      const seen = new Set<string>()
      const visit = (id: string) => {
        for (const edge of s.edges) {
          const from = direction === "in" ? edge.target : edge.source
          const to = direction === "in" ? edge.source : edge.target
          if (from !== id || seen.has(to)) continue
          seen.add(to)
          visit(to)
        }
      }
      visit(nodeId)
      return [...seen].map((id) => toNodeConnection(id, dataById.get(id)))
    }

    return { ancestors: collect("in"), descendants: collect("out") }
  })
}
