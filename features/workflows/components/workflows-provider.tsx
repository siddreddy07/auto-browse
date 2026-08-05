"use client"

import { createContext, useCallback, useContext, useState } from "react"
import type { Workflow } from "@/lib/schema"

type WorkflowsContextValue = {
  workflows: Workflow[]
  runSessionIds: Record<string, string>
  setRunSessionId: (runId: string, sessionId: string) => void
}

const WorkflowsContext = createContext<WorkflowsContextValue>({
  workflows: [],
  runSessionIds: {},
  setRunSessionId: () => {},
})

export function WorkflowsProvider({
  workflows,
  children,
}: {
  workflows: Workflow[]
  children: React.ReactNode
}) {
  const [runSessionIds, setRunSessionIds] = useState<Record<string, string>>({})

  const setRunSessionId = useCallback((runId: string, sessionId: string) => {
    setRunSessionIds((prev) => (prev[runId] === sessionId ? prev : { ...prev, [runId]: sessionId }))
  }, [])

  return (
    <WorkflowsContext.Provider value={{ workflows, runSessionIds, setRunSessionId }}>
      {children}
    </WorkflowsContext.Provider>
  )
}

export function useWorkflows() {
  return useContext(WorkflowsContext)
}
