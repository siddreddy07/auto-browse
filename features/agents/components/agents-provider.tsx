"use client"

import { createContext, useContext } from "react"
import type { Agent } from "@/lib/schema"

const AgentsContext = createContext<Agent[]>([])

export function AgentsProvider({
  agents,
  children,
}: {
  agents: Agent[]
  children: React.ReactNode
}) {
  return (
    <AgentsContext.Provider value={agents}>
      {children}
    </AgentsContext.Provider>
  )
}

export function useAgents() {
  return useContext(AgentsContext)
}
