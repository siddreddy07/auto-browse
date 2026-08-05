"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useStore } from "@xyflow/react"
import toposort from "toposort"
import { CheckCircle2, Loader2, Play, Timer, XCircle } from "lucide-react"
import { MarkdownViewer } from "@/components/ui/markdown"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Route } from "@/components/animate-ui/icons/route"
import { Clock3 } from "@/components/animate-ui/icons/clock-3"
import { RotateCw } from "@/components/animate-ui/icons/rotate-cw"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import { nodeDefinitions, type NodeStatus, type StepNodeData } from "../nodes/node-registry"
import { SessionReplay } from "./session-replay"
import { getWorkflowRunsAction } from "../actions"
import type { Run } from "@/lib/schema"
import { useWorkflows } from "./workflows-provider"

export function TopologyPanel({ workflowId, name }: { workflowId: string; name?: string }) {
  const nodes = useStore((s) => s.nodes)
  const edges = useStore((s) => s.edges)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [runs, setRuns] = useState<Run[]>([])
  const [replaying, setReplaying] = useState<Run | null>(null)
  const [replayPlaylists, setReplayPlaylists] = useState<Record<string, string>>({})
  const replayReadyRef = useRef(new Set<string>())
  const { runSessionIds } = useWorkflows()

  const prefetchReplay = useCallback(async (runId: string) => {
    try {
      const res = await fetch(`/api/replays/${runId}?pageId=0`)
      if (!res.ok) return
      const playlist = await res.text()
      if (!playlist.trim()) return
      replayReadyRef.current.add(runId)
      setReplayPlaylists((prev) => (prev[runId] === playlist ? prev : { ...prev, [runId]: playlist }))
    } catch {
      // ignore, will retry on next poll
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const data = await getWorkflowRunsAction(workflowId)
      if (!cancelled) setRuns(data)
      for (const run of data) {
        if (run.status === "success" && !replayReadyRef.current.has(run.id)) {
          void prefetchReplay(run.id)
        }
      }
    }
    void load()
    const interval = setInterval(() => void load(), 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [workflowId, runSessionIds, prefetchReplay])

  const fallbackSessionLabel = useState(() => `Workflow`)[0]

  const order = useMemo(() => {
    const ids = nodes.map((n) => n.id)
    const pairs = edges
      .filter((e) => ids.includes(e.source) && ids.includes(e.target))
      .map((e) => [e.source, e.target] as [string, string])
    try {
      return toposort.array(ids, pairs)
    } catch {
      return ids
    }
  }, [nodes, edges])

  if (nodes.length === 0) {
    return (
      <div className="flex size-full items-center justify-center p-4 text-sm text-muted-foreground">
        No nodes yet
      </div>
    )
  }

  const byId = new Map(nodes.map((n) => [n.id, n]))

  const sessions = (() => {
    const groups = new Map<string, { id: string; label: string; nodeIds: string[] }>()
    for (const id of order) {
      const data = byId.get(id)?.data as StepNodeData | undefined
      const label =
        typeof data?.sessionId === "string" && data.sessionId ? data.sessionId : fallbackSessionLabel
      let group = groups.get(label)
      if (!group) {
        group = { id: label, label, nodeIds: [] }
        groups.set(label, group)
      }
      group.nodeIds.push(id)
    }
    return [...groups.values()]
  })()

  const selectedNode = selectedId ? byId.get(selectedId) : undefined
  const selectedData = selectedNode?.data as StepNodeData | undefined
  const selectedDef = selectedData ? nodeDefinitions.find((d) => d.type === selectedData.type) : undefined
  const selectedStatus = selectedData?.status as NodeStatus | undefined
  const selectedHasOutput = selectedStatus === "done" && selectedData?.output !== undefined && selectedData.output !== ""
  const selectedHasError = selectedStatus === "failed" && Boolean(selectedData?.error)

  return (
    <>
      <ResizablePanelGroup orientation="horizontal" className="size-full overflow-hidden">
      <ResizablePanel defaultSize={50} minSize={15} className="flex flex-col border-r">
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {runs.length > 0 && (
          <Accordion type="multiple" defaultValue={[]} className="mb-3">
            <AccordionItem value="sessions">
              <AnimateIcon asChild animateOnHover>
                <AccordionTrigger className="py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} className="shrink-0" />
                    <span>Sessions</span>
                  </span>
                </AccordionTrigger>
              </AnimateIcon>
              <AccordionContent className="px-0">
                <div className="flex flex-col gap-1">
                  {runs.map((run) => (
                    <div key={run.id} className="flex items-center gap-2 rounded-md border bg-card py-1.5 pl-2 pr-1.5">
                      <RunStatusIcon status={run.status} />
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{run.id}</span>
                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                        {run.createdAt.toLocaleTimeString()}
                      </span>
                      {run.status === "success" && (
                        <AnimateIcon asChild animateOnHover>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 cursor-pointer gap-1 px-2 text-[10px]"
                            disabled={!replayPlaylists[run.id]}
                            onClick={() => setReplaying(run)}
                          >
                            {replayPlaylists[run.id] ? <RotateCw size={12} /> : <Loader2 className="size-3 animate-spin" />}
                            Replay
                          </Button>
                        </AnimateIcon>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <Accordion type="multiple" defaultValue={sessions.map((s) => s.id)} className="gap-2">
          {sessions.map((session) => (
            <AccordionItem key={session.id} value={session.id}>
              <AnimateIcon asChild animateOnHover>
                <AccordionTrigger className="gap-1.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Route size={14} className="shrink-0" />
                    <span className="truncate">{name || session.label}</span>
                  </span>
                </AccordionTrigger>
              </AnimateIcon>
              <AccordionContent className="px-0">
                <div className="flex flex-col">
                  {session.nodeIds.map((id, i) => {
                    const node = byId.get(id)
                    const data = node?.data as StepNodeData | undefined
                    const def = data ? nodeDefinitions.find((d) => d.type === data.type) : undefined
                    if (!node || !data || !def) return null

                    const status = data.status as NodeStatus | undefined
                    const active = status === "running" || status === "done" || status === "failed"
                    const isLast = i === session.nodeIds.length - 1
                    const clickable =
                      (status === "done" && data.output !== undefined && data.output !== "") ||
                      (status === "failed" && Boolean(data.error))
                    const isSelected = id === selectedId

                    return (
                      <div key={id} className="flex items-stretch">
                        <div className="flex w-5 shrink-0 flex-col items-center">
                          <span
                            className={`mb-1 mt-1 flex size-4 items-center justify-center rounded-full text-[9px] tabular-nums leading-none ${
                              status === "done" ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </span>
                          {!isLast && <span className="w-px flex-1 bg-border" />}
                        </div>
                        <div className="mb-2 min-w-0 flex-1 pl-2">
                          <button
                            type="button"
                            onClick={() => setSelectedId(id)}
                            className={`block w-full rounded-md text-left outline-none ${
                              clickable ? "cursor-pointer" : "cursor-default"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-2 rounded-md border bg-card py-1.5 pl-2 pr-2 transition-colors ${
                                status === "running"
                                  ? "border-blue-500/70 bg-blue-500/5"
                                  : status === "failed"
                                    ? "border-red-500/70"
                                    : status === "done"
                                      ? "border-emerald-500/40"
                                      : "border-border/60"
                              } ${active ? "" : "opacity-60"} ${
                                clickable ? "hover:border-emerald-500/60 hover:bg-emerald-500/5" : ""
                              } ${isSelected ? "ring-2 ring-ring" : ""}`}
                            >
                              <div
                                className="flex size-5 shrink-0 items-center justify-center rounded"
                                style={{ backgroundColor: def.accent + "20", color: def.accent }}
                              >
                                <def.icon className="size-3" />
                              </div>
                              <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                {String(data.displayLabel || def.label)}
                              </span>
                              {status === "done" || status === "failed" ? (
                                <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                                  {typeof data.durationMs === "number" ? formatDuration(data.durationMs) : "—"}
                                </span>
                              ) : null}
                              <StatusIndicator status={status} />
                            </div>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col p-3">
        {selectedHasOutput || selectedHasError ? (
          <>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {selectedDef && (
                <div
                  className="flex size-4 items-center justify-center rounded"
                  style={{ backgroundColor: selectedDef.accent + "20", color: selectedDef.accent }}
                >
                  <selectedDef.icon className="size-2.5" />
                </div>
              )}
              <span className="truncate">{String(selectedData?.displayLabel || selectedDef?.label || "")}</span>
              <span className="ml-auto shrink-0 text-[10px] font-normal text-muted-foreground">
                {selectedHasError ? "Error" : "Output"}
              </span>
            </div>
            <div className="mt-2 min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/30 p-2">
              {selectedHasError ? (
                <p className="whitespace-pre-wrap break-words text-xs text-red-500">{String(selectedData?.error)}</p>
              ) : (
                <OutputView output={selectedData?.output} />
              )}
            </div>
          </>
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-sm text-muted-foreground">
            Select a completed node to view its output
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>

      <Dialog open={Boolean(replaying)} onOpenChange={(open) => { if (!open) setReplaying(null) }}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Session Replay</DialogTitle>
            {replaying && (
              <DialogDescription className="truncate font-mono">{replaying.id}</DialogDescription>
            )}
          </DialogHeader>
          {replaying && (
            <SessionReplay
              sessionId={replaying.id}
              playlist={replayPlaylists[replaying.id]}
              className="aspect-video w-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatDuration(ms: number): string {
  const seconds = ms / 1000
  const formatted = seconds % 1 === 0 ? seconds.toFixed(0) : seconds.toFixed(2)
  return `${formatted}s`
}

function StatusIndicator({ status }: { status?: NodeStatus }) {
  if (status === "running") return <Loader2 className="size-3.5 shrink-0 animate-spin text-blue-500" />
  if (status === "done") return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
  if (status === "failed") return <XCircle className="size-3.5 shrink-0 text-red-500" />
  if (status === "pending") return <Timer className="size-3.5 shrink-0 text-muted-foreground/60" />
  return <span className="size-3.5 shrink-0 rounded-full border border-dashed border-border" />
}

function RunStatusIcon({ status }: { status: Run["status"] }) {
  if (status === "running") return <Loader2 className="size-3.5 shrink-0 animate-spin text-blue-500" />
  if (status === "success") return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
  if (status === "failed") return <XCircle className="size-3.5 shrink-0 text-red-500" />
  return <Timer className="size-3.5 shrink-0 text-muted-foreground/60" />
}

function OutputView({ output }: { output: unknown }) {
  if (output === undefined || output === null || output === "") {
    return <p className="text-xs text-muted-foreground">No output</p>
  }

  if (typeof output === "string") {
    return <MarkdownViewer content={output} className="text-xs" />
  }

  if (typeof output === "object") {
    return <JsonView value={output} />
  }

  return <p className="text-xs">{String(output)}</p>
}

function JsonView({ value }: { value: unknown }) {
  const json = useMemo(() => JSON.stringify(value, null, 2), [value])

  const parts: ReactNode[] = useMemo(() => {
    const nodes: ReactNode[] = []
    const regex =
      /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false)\b|\bnull\b|(-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g
    let lastIndex = 0
    let m: RegExpExecArray | null

    while ((m = regex.exec(json)) !== null) {
      if (m.index > lastIndex) nodes.push(json.slice(lastIndex, m.index))
      const [, str, colon, bool, null_, number] = m
      let className = "text-foreground"
      if (str) {
        className = colon ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400"
      } else if (bool) {
        className = "text-violet-600 dark:text-violet-400"
      } else if (null_) {
        className = "text-amber-600 dark:text-amber-400"
      } else if (number) {
        className = "text-orange-600 dark:text-orange-400"
      }
      nodes.push(
        <span key={m.index} className={className}>
          {m[0]}
        </span>,
      )
      lastIndex = regex.lastIndex
    }

    if (lastIndex < json.length) nodes.push(json.slice(lastIndex))
    return nodes
  }, [json])

  return (
    <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
      {parts}
    </pre>
  )
}
