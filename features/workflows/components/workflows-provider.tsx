"use client"

import { createContext, useContext, useState, useRef, useCallback } from "react"
import type { Workflow } from "@/lib/schema"
import type { Node as FlowNode } from "@xyflow/react"

const WorkflowsContext = createContext<Workflow[]>([])

export function WorkflowsProvider({
  workflows,
  children,
}: {
  workflows: Workflow[]
  children: React.ReactNode
}) {
  return (
    <WorkflowsContext.Provider value={workflows}>
      {children}
    </WorkflowsContext.Provider>
  )
}

export function useWorkflows() {
  return useContext(WorkflowsContext)
}

export type AddNodeResult = { success: boolean; reason?: string }
export type AddNodeFn = (type: string) => AddNodeResult

type NodeSelectionContextType = {
  selectedNode: FlowNode | null
  setSelectedNode: (node: FlowNode | null) => void
  addNode: AddNodeFn
  registerAddNode: (fn: AddNodeFn) => void
}

const NodeSelectionContext = createContext<NodeSelectionContextType | null>(null)

export function NodeSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)
  const addNodeRef = useRef<AddNodeFn>(undefined)

  const addNode: AddNodeFn = useCallback((type: string) => {
    return addNodeRef.current?.(type) ?? { success: false, reason: "Not ready" }
  }, [])

  const registerAddNode = useCallback((fn: AddNodeFn) => {
    addNodeRef.current = fn
  }, [])

  return (
    <NodeSelectionContext.Provider value={{ selectedNode, setSelectedNode, addNode, registerAddNode }}>
      {children}
    </NodeSelectionContext.Provider>
  )
}

export function useNodeSelection() {
  const ctx = useContext(NodeSelectionContext)
  if (!ctx) throw new Error("useNodeSelection must be used within NodeSelectionProvider")
  return ctx
}
