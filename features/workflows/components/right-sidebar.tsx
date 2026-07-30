"use client"

import { useActionState, useEffect, useState } from "react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import type { helloWorldTask } from "@/trigger/example"
import { Button } from "@/components/ui/button"
import { ResizablePanel } from "@/components/ui/resizable"
import { Play, Loader2, CheckCircle2, XCircle, Timer } from "lucide-react"
import { runWorkflowAction } from "../actions"

import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { nodeDefinitions } from "../node-registry"
import { useNodeSelection } from "./workflows-provider"
import { Editor } from "./editor"

export function RightSidebar() {
  const { selectedNode } = useNodeSelection()
  const [tab, setTab] = useState("toolbar")
  const [state, action, pending] = useActionState(runWorkflowAction, null)

  useEffect(() => {
    setTab(selectedNode ? "editor" : "toolbar")
  }, [selectedNode])

  const { run } = useRealtimeRun<typeof helloWorldTask>(state?.runId, {
    accessToken: state?.publicAccessToken ?? "",
    enabled: !!state?.runId,
    skipColumns: ["payload", "output"],
  })

  return (
    <ResizablePanel defaultSize={320} minSize={280} maxSize={576} className="flex flex-col">
      <div className="flex items-center justify-center border-b p-4">
        {!state?.runId ? (
          <form action={action}>
            <Button className="cursor-pointer" type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Play />}
              {pending ? "Running..." : "Run"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <RunStatusIcon status={run?.status} />
            <span className="text-sm font-medium">{run?.status ?? "Waiting..."}</span>
            {run?.status === "COMPLETED" && (
              <span className="text-xs text-muted-foreground">{run.output?.message}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col">
          <TabsList className="mx-2 mt-2 w-auto">
            <TabsTrigger value="toolbar" className="flex-1">Toolbar</TabsTrigger>
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="toolbar" className="overflow-auto p-2">
            <Toolbar />
          </TabsContent>

          <TabsContent value="editor" className="overflow-auto p-2">
            <Editor node={selectedNode} />
          </TabsContent>
        </Tabs>
      </div>
    </ResizablePanel>
  )
}

function Toolbar() {
  const triggerNodes = nodeDefinitions.filter((n) => n.kind === "trigger")
  const actionNodes = nodeDefinitions.filter((n) => n.kind === "action")
  const { addNode } = useNodeSelection()

  const handleAdd = (type: string, label: string) => {
    const result = addNode(type)
    if (!result.success) {
      toast.error(result.reason ?? "Failed to add node")
    }
  }

  return (
    <Accordion type="multiple" defaultValue={["triggers", "actions"]}>
      <AccordionItem value="triggers">
        <AccordionTrigger>Triggers</AccordionTrigger>
        <AccordionContent className="space-y-1">
          {triggerNodes.map((def) => (
            <button
              key={def.type}
              onClick={() => handleAdd(def.type, def.label)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
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

      <AccordionItem value="actions">
        <AccordionTrigger>Actions</AccordionTrigger>
        <AccordionContent className="space-y-1">
          {actionNodes.map((def) => (
            <button
              key={def.type}
              onClick={() => handleAdd(def.type, def.label)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
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
    </Accordion>
  )
}

function RunStatusIcon({ status }: { status?: string }) {
  if (!status) return <Timer className="size-5 text-muted-foreground animate-pulse" />
  if (status === "COMPLETED") return <CheckCircle2 className="size-5 text-emerald-500" />
  if (status === "FAILED") return <XCircle className="size-5 text-red-500" />
  return <Loader2 className="size-5 text-muted-foreground animate-spin" />
}
