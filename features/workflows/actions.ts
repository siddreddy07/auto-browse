"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createWorkflow, listWorkflows } from "./data"

export async function getWorkflows() {
  const { orgId } = await auth()

  if (!orgId) {
    return []
  }

  return listWorkflows(orgId)
}

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth()

  if (!orgId) {
    throw new Error("No active organization")
  }

  const workflow = await createWorkflow(orgId, name)

  revalidatePath("/(dashboard)", "layout")
  redirect(`/workflow/${workflow.id}`)
}
