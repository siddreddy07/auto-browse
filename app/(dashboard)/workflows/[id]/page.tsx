import { Room } from "@/features/workflows/components/Room"
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return(
    <Room roomId={id}>
        <WorkflowShell workflowId={id} />
    </Room>
  )

}
