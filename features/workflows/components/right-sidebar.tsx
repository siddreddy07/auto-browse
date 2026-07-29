"use client"

import { useActionState } from "react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import type { helloWorldTask } from "@/trigger/example"
import { Button } from "@/components/ui/button"
import { ResizablePanel } from "@/components/ui/resizable"
import { Play, Loader2, CheckCircle2, XCircle, Timer } from "lucide-react"
import { runWorkflowAction } from "../actions"

export function RightSidebar() {
  const [state, action, pending] = useActionState(runWorkflowAction, null)

  const { run } = useRealtimeRun<typeof helloWorldTask>(state?.runId, {
    accessToken: state?.publicAccessToken ?? "",
    enabled: !!state?.runId,
    skipColumns: ["payload", "output"],
  })

  return (
    <ResizablePanel defaultSize={256} minSize={224} maxSize={576} className="p-4">
      <div className="flex items-center justify-center h-full">
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
    </ResizablePanel>
  )
}

function RunStatusIcon({ status }: { status?: string }) {
  if (!status) return <Timer className="size-5 text-muted-foreground animate-pulse" />
  if (status === "COMPLETED") return <CheckCircle2 className="size-5 text-emerald-500" />
  if (status === "FAILED") return <XCircle className="size-5 text-red-500" />
  return <Loader2 className="size-5 text-muted-foreground animate-spin" />
}
