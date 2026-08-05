"use client"

import { useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Route } from "@/components/animate-ui/icons/route"
import { Plus } from "@/components/animate-ui/icons/plus"
import { Loader2 } from "lucide-react"
import { createWorkflowAction } from "@/features/workflows/actions"
import { generateSlug } from "@/features/workflows/lib/generate-slug"
import { useWorkflows } from "@/features/workflows/components/workflows-provider"

export default function WorkflowsPage() {
  const { workflows } = useWorkflows()
  const [isPending, startTransition] = useTransition()

  function handleCreateWorkflow() {
    startTransition(() => {
      createWorkflowAction(generateSlug())
    })
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Route className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">No workflows yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first workflow to get started.
            </p>
          </div>
          <Button className="cursor-pointer" onClick={handleCreateWorkflow} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Create Workflow
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Workflows</h1>
        <Button className="p-2 flex items-center gap-1 cursor-pointer" onClick={handleCreateWorkflow} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          <span className="block text-sm sm:hidden">Workflow</span>
          <span className="hidden sm:inline">Workflow</span>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Link
            key={workflow.id}
            href={`/workflows/${workflow.id}`}
            className="group flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-muted transition-colors group-hover:bg-background">
                <Route className="size-4 text-muted-foreground" />
              </div>
              <span className="font-medium leading-none">{workflow.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Updated {workflow.updatedAt.toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
