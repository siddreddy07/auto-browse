"use client"

import { createContext, useContext } from "react"
import type { Workflow } from "@/lib/schema"

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
