import { ReactFlowProvider } from "@xyflow/react"
import { Room } from "@/features/workflows/components/Room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { liveblocks } from "@/lib/liveblocks"
import { getWorkflow } from "@/features/workflows/data"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

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

  return(
    <Room roomId={id}>
      <ReactFlowProvider>
        <WorkflowShell workflowId={id} name={workflow.name} />
      </ReactFlowProvider>
    </Room>
  )

}
