"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createAgent, listAgents } from "./data"

export async function getAgents() {
  const { orgId, userId } = await auth()

  if (!userId) {
    return []
  }

  return listAgents(orgId ?? null, userId)
}

export async function createAgentAction({ name }: { name: string }) {
  const { orgId, userId } = await auth()

  if (!userId) {
    throw new Error("Not authenticated")
  }

  const agent = await createAgent({
    name,
    orgId: orgId ?? null,
    createdBy: userId,
  })

  revalidatePath("/(dashboard)", "layout")
  redirect(`/agents/${agent.id}`)
}
