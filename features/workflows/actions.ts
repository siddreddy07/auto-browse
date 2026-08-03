"use server"

import { auth as clerkAuth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth, tasks, runs } from "@trigger.dev/sdk"
import { createWorkflow, listWorkflows, deleteWorkflow, saveWorkflowGraph } from "./data"
import { liveblocks } from "@/lib/liveblocks"
import { workflowGraph } from "@/lib/schema"
import { runWorkflowTask } from "./tasks/run-workflow"

export async function getWorkflows() {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    return []
  }

  return listWorkflows(orgId)
}

export async function createWorkflowAction(name: string) {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  await liveblocks.getOrCreateRoom(workflow.id, {
    defaultAccesses: [],
    metadata: { title:workflow.name },
    groupsAccesses: { [orgId]: ["room:write"] },
  })

  revalidatePath("/(dashboard)", "layout")
  redirect(`/workflows/${workflow.id}`)
}

export async function deleteWorkflowAction(_prevState: unknown, formData: FormData) {
  const workflowId = formData.get("workflowId") as string

  const { orgId } = await clerkAuth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  await Promise.all([
    deleteWorkflow(orgId, workflowId),
    liveblocks.deleteRoom(workflowId),
  ])

  revalidatePath("/(dashboard)", "layout")
  redirect("/workflows")
}

export async function runWorkflowAction({
  id,
  graph
}:{
  id:string,
  graph:workflowGraph
}) {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  await saveWorkflowGraph({orgId,id,graph})


  const handle = await tasks.trigger<typeof runWorkflowTask>("run-workflow", {
      workflowId: id, orgId
  },{
    tags: [`workflow:${id}`]

  })

  const publicAccessToken = await auth.createPublicToken({
    scopes: { read: { tags: [`workflow:${id}`], runs: [handle.id] } },
  })

  return { runId: handle.id, publicAccessToken }
}

export async function cancelWorkflowRun(runId:string) {

  const {orgId} = await clerkAuth()
  if(!orgId) throw new Error('No active organization')

  await runs.cancel(runId)

}
