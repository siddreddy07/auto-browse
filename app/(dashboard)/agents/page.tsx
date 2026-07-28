"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot } from "@/components/animate-ui/icons/bot"
import { Plus } from "@/components/animate-ui/icons/plus"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { useAgents } from "@/features/agents/components/agents-provider"

export default function AgentsPage() {
  const agents = useAgents()

  if (agents.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Bot animateOnHover className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">No agents yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first agent to get started.
            </p>
          </div>
          <Button asChild>
            <Link href="/agents/new">Create Agent</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
        <Button asChild className="p-2 flex items-center gap-1">
          <Link href="/agents/new">
            <Plus className="size-4" />
            <span className="block text-sm sm:hidden">Agent</span>
            <span className="hidden sm:inline">Agent</span>
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-background">
                  <Bot animateOnHover className="size-4 text-muted-foreground" />
                </div>
                <span className="font-medium leading-none">{agent.name}</span>
              </div>
              <NativeSelect
                defaultValue={agent.shared ? "true" : "false"}
                className="h-7 w-auto text-xs"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                size="sm"
              >
                <NativeSelectOption value="true">Shared</NativeSelectOption>
                <NativeSelectOption value="false">Private</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{agent.modelName || "No model"}</span>
              <span>{agent.createdAt.toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
