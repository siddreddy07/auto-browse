"use server"

import { auth as clerkAuth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { helloWorldTask } from "@/trigger/example"
import { auth, tasks } from "@trigger.dev/sdk"
import { createWorkflow, listWorkflows } from "./data"

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

  revalidatePath("/(dashboard)", "layout")
  redirect(`/workflow/${workflow.id}`)
}

export async function runWorkflowAction() {
  const { orgId } = await clerkAuth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", {
    message: "Hello from Right-Sidebar !",
  })

  const publicAccessToken = await auth.createPublicToken({
    scopes: { read: { runs: [handle.id] } },
  })

  return { runId: handle.id, publicAccessToken }
}
