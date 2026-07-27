"use server"

import { auth } from "@clerk/nextjs/server"
import { listWorkflows } from "./data"

export async function getWorkflows() {
  const { orgId } = await auth()

  if (!orgId) {
    return []
  }

  return listWorkflows(orgId)
}
