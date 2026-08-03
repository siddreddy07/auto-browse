"use client"

import { useEffect, useState, useTransition, useCallback, useActionState } from "react"
import { useStore, useReactFlow } from "@xyflow/react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { Button } from "@/components/ui/button"
import { ResizablePanel } from "@/components/ui/resizable"
import { Play, Loader2, CheckCircle2, XCircle, Timer, Trash2 } from "lucide-react"
import { runWorkflowAction, deleteWorkflowAction } from "../actions"

import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { nodeDefinitions, type StepNodeType } from "../nodes/node-registry"
import { Editor } from "./editor"
import type { AddNodeFn } from "./canvas"
import { validateGraph } from "../lib/validate-graph"

export function RightSidebar({ workflowId, addNode }: { workflowId: string; addNode: AddNodeFn }) {
  const selectedNode = useStore((s) => s.nodes.find((n) => n.selected))
  const [tab, setTab] = useState("toolbar")
  const [runState, setRunState] = useState<{ runId: string; publicAccessToken: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const { getNodes, getEdges } = useReactFlow()

  const [deleteState, deleteAction, deletePending] = useActionState(deleteWorkflowAction, null)

  useEffect(() => {
    setTab(selectedNode ? "editor" : "toolbar")
  }, [selectedNode])

  const handleRun = useCallback(() => {

    startTransition(async () => {
        
      const graph = {nodes: getNodes() as StepNodeType[], edges:getEdges()}
      const problems = validateGraph(graph)

      console.log('problems : ',problems)

      if(problems.length > 0){
        toast.error(problems[0])
        return
      }

      const result = await runWorkflowAction({ id: workflowId, graph })

      console.log('Run result : ',result)

      setRunState(result)
    })
  }, [workflowId, getNodes, getEdges])

  const handleReset = useCallback(() => setRunState(null), [])

  return (
    <ResizablePanel defaultSize={320} minSize={280} maxSize={576} className="flex flex-col">
      <div className="flex items-center justify-between border-b px-2 py-4">
        <form action={deleteAction}>
          <input type="hidden" name="workflowId" value={workflowId} />
          <Button variant="ghost" size="sm" className="cursor-pointer gap-1.5 text-destructive hover:text-destructive" disabled={deletePending}>
            {deletePending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
            Delete Workflow
          </Button>
        </form>
        
        <div className="flex items-center justify-center">
          {runState ? (
            <RunControls runState={runState} onReset={handleReset} />
          ) : (
            <Button size="sm" className="cursor-pointer gap-1.5" onClick={handleRun} disabled={isPending}>
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
              {isPending ? "Running..." : "Run"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col">
          <TabsList className="mx-2 mt-2 w-auto">
            <TabsTrigger value="toolbar" className="flex-1">Toolbar</TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="toolbar" className="min-h-0 flex-1 overflow-y-auto p-2">
            <Toolbar addNode={addNode} />
          </TabsContent>

          <TabsContent value="editor" className="min-h-0 flex-1 overflow-y-auto p-2">
            <Editor />
          </TabsContent>
        </Tabs>
      </div>
    </ResizablePanel>
  )
}

function RunControls({
  runState,
  onReset,
}: {
  runState: { runId: string; publicAccessToken: string }
  onReset: () => void
}) {
  const { run, error } = useRealtimeRun(runState.runId, {
    accessToken: runState.publicAccessToken,
    skipColumns: ["payload", "output"],
  })

  const completed = run?.status === "COMPLETED"
  const failed = run?.status === "FAILED"

  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!completed) {
      setCountdown(0)
      return
    }
    setCountdown(10)
    const interval = setInterval(() => setCountdown((c) => (c > 1 ? c - 1 : 0)), 1000)
    const timeout = setTimeout(onReset, 10000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [completed, onReset])

  if (error) {
    return (
      <Button size="sm" variant="destructive" className="cursor-pointer gap-1.5" onClick={onReset} title={error.message}>
        <XCircle className="size-3.5 text-red-500" />
        Connection lost — retry
      </Button>
    )
  }

  if (completed) {
    return (
      <Button size="sm" variant="outline" className="cursor-pointer gap-1.5" onClick={onReset} title="Run again">
        <RunStatusIcon status="COMPLETED" />
        Completed
        {countdown > 0 && <span className="text-xs text-muted-foreground tabular-nums">({countdown}s)</span>}
      </Button>
    )
  }

  if (failed) {
    return (
      <Button size="sm" variant="destructive" className="cursor-pointer gap-1.5" onClick={onReset}>
        <RunStatusIcon status="FAILED" />
        Try again
      </Button>
    )
  }

  return (
    <Button size="sm" disabled className="cursor-pointer gap-1.5">
      <RunStatusIcon status={run?.status} />
      {run?.status ? "Running..." : "Waiting..."}
    </Button>
  )
}

function Toolbar({ addNode }: { addNode: AddNodeFn }) {
  const categories = [
    { value: "triggers", label: "Triggers", nodes: nodeDefinitions.filter((n) => n.kind === "trigger") },
    { value: "actions", label: "Actions", nodes: nodeDefinitions.filter((n) => n.kind === "action") },
  ] as const

  const handleAdd = (type: string, label: string) => {
    const result = addNode(type)
    if (!result.success) {
      toast.error(result.reason ?? "Failed to add node")
    }
  }

  return (
    <Accordion type="multiple" defaultValue={["triggers", "actions"]}>
      {categories.map(({ value, label, nodes }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger className="cursor-pointer">{label}</AccordionTrigger>
          <AccordionContent className="space-y-1">
            {nodes.map((def) => (
              <button
                key={def.type}
                onClick={() => handleAdd(def.type, def.label)}
                className="flex cursor-pointer w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <div
                  className="flex size-5 items-center justify-center rounded"
                  style={{ backgroundColor: def.accent + "20", color: def.accent }}
                >
                  <def.icon className="size-3" />
                </div>
                {def.label}
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function RunStatusIcon({ status }: { status?: string }) {
  if (!status) return <Timer className="size-3.5 text-muted-foreground animate-pulse" />
  if (status === "COMPLETED") return <CheckCircle2 className="size-3.5 text-emerald-500" />
  if (status === "FAILED") return <XCircle className="size-3.5 text-red-500" />
  return <Loader2 className="size-3.5 text-muted-foreground animate-spin" />
}
