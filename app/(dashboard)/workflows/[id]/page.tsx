import type { Workflow } from "@/lib/schema"
import { ReactFlowProvider } from "@xyflow/react"
import { Room } from "@/features/workflows/components/Room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { liveblocks } from "@/lib/liveblocks"
import { getWorkflow } from "@/features/workflows/data"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import toposort from "toposort"
import { DesktopOnly } from "@/components/desktop-only"
import {
  MobileWorkflowView,
  type MobileStep,
} from "@/features/workflows/components/mobile-workflow-view"

function orderedSteps(graph: Workflow["graph"]): MobileStep[] {
  const nodes = graph?.nodes ?? []
  const edges = graph?.edges ?? []
  let order: string[] = nodes.map((n) => n.id)
  try {
    const sorted = toposort.array(order, edges.map((e) => [e.source, e.target]))
    order = sorted
  } catch {}
  return order.flatMap((id) => {
    const n = nodes.find((x) => x.id === id)
    if (!n) return []
    const d = n.data ?? {}
    const detail = [d.url, d.instruction, d.subject, d.to].find(
      (v) => typeof v === "string" && v
    )
    return [
      {
        id: n.id,
        type: String(d.type),
        label: typeof d.displayLabel === "string" ? d.displayLabel : undefined,
        detail: detail as string | undefined,
      },
    ]
  })
}

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const {orgId} = await auth()
  if (!orgId) notFound()

  const workflow = await getWorkflow(orgId,id)
  if(!workflow) notFound()

  await liveblocks.getOrCreateRoom(id, {
    organizationId: orgId,
    defaultAccesses: ["room:write"],
  })

  return (
    <>
      <div className="flex flex-1 flex-col md:hidden">
        <MobileWorkflowView
          name={workflow.name}
          steps={orderedSteps(workflow.graph)}
        />
      </div>
      <DesktopOnly>
        <Room roomId={id}>
          <ReactFlowProvider>
            <WorkflowShell workflowId={id} name={workflow.name} />
          </ReactFlowProvider>
        </Room>
      </DesktopOnly>
    </>
  )

}
