"use client"

import {
  useEffect,
  useState,
  useTransition,
  useCallback,
  useActionState,
} from "react"
import { useStore, useReactFlow } from "@xyflow/react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { Button } from "@/components/ui/button"
import { ResizablePanel } from "@/components/ui/resizable"
import {
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Timer,
  Info,
  Lock,
  Crown,
} from "lucide-react"
import { Trash } from "@/components/animate-ui/icons/trash"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { runWorkflowAction, deleteWorkflowAction } from "../actions"
import { useWorkflows } from "./workflows-provider"
import { runWorkflowTask } from "../tasks/run-workflow"

import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { nodeDefinitions, type StepNodeType } from "../nodes/node-registry"
import { Editor } from "./editor"
import type { AddNodeFn } from "./canvas"
import { validateGraph } from "../lib/validate-graph"
import { useOrgPlan } from "../hooks/use-org-plan"

export function RightSidebar({
  workflowId,
  addNode,
}: {
  workflowId: string
  addNode: AddNodeFn
}) {
  const selectedNode = useStore((s) => s.nodes.find((n) => n.selected))
  const [tab, setTab] = useState("toolbar")
  const [runState, setRunState] = useState<{
    runId: string
    publicAccessToken: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()
  const { getNodes, getEdges, setNodes, setCenter } = useReactFlow()
  const { setRunSessionId } = useWorkflows()

  const [, deleteAction, deletePending] = useActionState(
    deleteWorkflowAction,
    null
  )

  const [lastSelectedId, setLastSelectedId] = useState<string | undefined>(
    selectedNode?.id
  )
  if (lastSelectedId !== selectedNode?.id) {
    setLastSelectedId(selectedNode?.id)
    setTab(selectedNode ? "editor" : "toolbar")
  }

  const handleRun = useCallback(() => {
    startTransition(async () => {
      const graph = { nodes: getNodes() as StepNodeType[], edges: getEdges() }
      const problems = validateGraph(graph)

      if (problems.length > 0) {
        problems.forEach((p) => toast.error(p.message))

        const first = problems.find((p) => p.nodeId)
        if (first) {
          setNodes((nds) =>
            nds.map((n) => ({ ...n, selected: n.id === first.nodeId }))
          )
          const target = getNodes().find((n) => n.id === first.nodeId)
          if (target) {
            setCenter(
              target.position.x + (target.measured?.width ?? 200) / 2,
              target.position.y + (target.measured?.height ?? 80) / 2,
              { zoom: 1.15, duration: 500 }
            )
          }
        }
        return
      }

      const result = await runWorkflowAction({ id: workflowId, graph })

      setRunState(result)
    })
  }, [workflowId, getNodes, getEdges, setNodes, setCenter])

  const handleReset = useCallback(() => setRunState(null), [])

  return (
    <ResizablePanel
      defaultSize={320}
      minSize={280}
      maxSize={576}
      className="flex flex-col"
    >
      <div className="flex items-center justify-between border-b px-2 py-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <AnimateIcon asChild animateOnHover>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer gap-1.5 text-destructive hover:text-destructive"
              >
                {deletePending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash size={14} />
                )}
                Delete Workflow
              </Button>
            </AnimateIcon>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Trash size={24} />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete workflow?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                workflow and its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form action={deleteAction}>
              <input type="hidden" name="workflowId" value={workflowId} />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AnimateIcon asChild animateOnHover>
                  <AlertDialogAction
                    type="submit"
                    variant="destructive"
                    disabled={deletePending}
                  >
                    {deletePending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash size={14} />
                    )}
                    Delete
                  </AlertDialogAction>
                </AnimateIcon>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center justify-center">
          {runState ? (
            <RunControls
              runState={runState}
              onReset={handleReset}
              onSessionId={(sessionId) =>
                setRunSessionId(runState.runId, sessionId)
              }
            />
          ) : (
            <Button
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={handleRun}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" />
              )}
              {isPending ? "Running..." : "Run"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex h-full flex-col"
        >
          <TabsList className="mx-2 mt-2 w-auto">
            <TabsTrigger value="toolbar" className="flex-1">
              Toolbar
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="toolbar"
            className="min-h-0 flex-1 overflow-y-auto p-2"
          >
            <Toolbar addNode={addNode} />
          </TabsContent>

          <TabsContent
            value="editor"
            className="min-h-0 flex-1 overflow-y-auto p-2"
          >
            <Editor />
          </TabsContent>
        </Tabs>
      </div>
    </ResizablePanel>
  )
}

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELED",
  "CRASHED",
  "SYSTEM_FAILURE",
  "TIMED_OUT",
  "EXPIRED",
])

function RunControls({
  runState,
  onReset,
  onSessionId,
}: {
  runState: { runId: string; publicAccessToken: string }
  onReset: () => void
  onSessionId: (sessionId: string) => void
}) {
  const [settled, setSettled] = useState(false)
  const { run, error } = useRealtimeRun<typeof runWorkflowTask>(
    runState.runId,
    {
      accessToken: runState.publicAccessToken,
      skipColumns: ["payload"],
      onComplete: () => setSettled(true),
    }
  )

  const terminal =
    settled ||
    Boolean(run?.finishedAt) ||
    (run?.status ? TERMINAL_STATUSES.has(run.status) : false)

  const completed = terminal && run?.status === "COMPLETED"
  const failed = terminal && !completed

  const sessionId = run?.output?.browserbaseSessionId

  useEffect(() => {
    if (completed && sessionId) {
      onSessionId(sessionId)
    }
  }, [completed, sessionId, onSessionId])

  const [countdown, setCountdown] = useState(0)
  const [prevCompleted, setPrevCompleted] = useState(completed)
  if (completed !== prevCompleted) {
    setPrevCompleted(completed)
    setCountdown(completed ? 15 : 0)
  }

  useEffect(() => {
    if (!completed) return
    const interval = setInterval(
      () => setCountdown((c) => (c > 1 ? c - 1 : 0)),
      1000
    )
    const timeout = setTimeout(onReset, 15000)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [completed, onReset])

  if (completed) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer gap-1.5"
        onClick={onReset}
        disabled={countdown > 0}
        title={countdown > 0 ? `Runs again in ${countdown}s` : "Run again"}
      >
        <RunStatusIcon status="COMPLETED" />
        Completed
        {countdown > 0 && (
          <span className="text-xs text-muted-foreground tabular-nums">
            ({countdown}s)
          </span>
        )}
      </Button>
    )
  }

  if (failed) {
    return (
      <Button
        size="sm"
        variant="destructive"
        className="cursor-pointer gap-1.5"
        onClick={onReset}
      >
        <RunStatusIcon status="FAILED" />
        Try again
      </Button>
    )
  }

  if (error) {
    return (
      <Button
        size="sm"
        variant="destructive"
        className="cursor-pointer gap-1.5"
        onClick={onReset}
        title={error.message}
      >
        <XCircle className="size-3.5 text-red-500" />
        Connection lost — retry
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
  const { isPro } = useOrgPlan()
  const categories = [
    {
      value: "triggers",
      label: "Triggers",
      nodes: nodeDefinitions.filter((n) => n.kind === "trigger"),
    },
    {
      value: "actions",
      label: "Actions",
      nodes: nodeDefinitions.filter((n) => n.kind === "action"),
    },
  ] as const

  const handleAdd = (type: string) => {
    const result = addNode(type)
    if (!result.success && result.reason) {
      toast.error(result.reason)
    }
  }

  return (
    <Accordion type="multiple" defaultValue={["triggers", "actions"]}>
      {categories.map(({ value, label, nodes }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger className="cursor-pointer">
            {label}
          </AccordionTrigger>
          <AccordionContent className="space-y-1">
            {nodes.map((def) => {
              const locked = Boolean(def.premium && !isPro)
              const disabled = Boolean(def.disabled)
              return (
                <HoverCard key={def.type}>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => handleAdd(def.type)}
                      disabled={disabled}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted ${locked ? "opacity-70" : ""} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      <div
                        className="flex size-5 items-center justify-center rounded"
                        style={{
                          backgroundColor: def.accent + "20",
                          color: def.accent,
                        }}
                      >
                        <def.icon className="size-3" />
                      </div>
                      {def.label}
                      {def.disabled ? (
                        <Badge
                          variant="outline"
                          className="ms-auto gap-1 px-1.5 text-[10px] font-semibold"
                        >
                          Soon
                        </Badge>
                      ) : def.premium ? (
                        <Badge
                          variant="outline"
                          className="ms-auto gap-1 px-1.5 text-[10px] font-semibold"
                        >
                          <Crown className="text-amber-500" />
                          Pro
                        </Badge>
                      ) : (
                        <Info className="ms-auto size-3.5 shrink-0 text-muted-foreground/50" />
                      )}
                      {locked && (
                        <Lock className="size-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-xs leading-relaxed">
                    {def.desc}
                    {def.disabled && (
                      <p className="mt-1.5 flex items-center gap-1 font-medium text-muted-foreground">
                        Not available yet
                      </p>
                    )}
                    {def.premium && (
                      <p className="mt-1.5 flex items-center gap-1 font-medium text-amber-500">
                        <Crown className="size-3" />
                        {locked ? "Pro plan required" : "Premium · Pro"}
                      </p>
                    )}
                  </HoverCardContent>
                </HoverCard>
              )
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function RunStatusIcon({ status }: { status?: string }) {
  if (!status)
    return <Timer className="size-3.5 animate-pulse text-muted-foreground" />
  if (status === "COMPLETED")
    return <CheckCircle2 className="size-3.5 text-emerald-500" />
  if (status === "FAILED") return <XCircle className="size-3.5 text-red-500" />
  return <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
}
