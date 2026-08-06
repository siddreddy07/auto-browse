import { db } from "@/lib/db";
import { runStatusEnum, runs, workflowGraph, workflows } from "@/lib/schema";
import { and, desc, eq } from "drizzle-orm";
import { validateGraph } from "./lib/validate-graph";

export function listWorkflows(orgId: string) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt));
}

export async function getWorkflow(orgId: string, id: string) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)));

  return workflow;
}

export async function createWorkflow(orgId: string, name: string) {
    
    const [workflow] = await db
                            .insert(workflows)
                            .values({
                              orgId,
                              name,
                              graph: { nodes: [], edges: [] },
                            })
                            .returning()
    
    return workflow
    
}

export async function deleteWorkflow(orgId: string, id: string) {
  const [workflow] = await db
    .delete(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)))
    .returning()

  return workflow
}


export async function saveWorkflowGraph({
  orgId,
  id,
  graph
}: {orgId: string,
  id: string,
  graph:workflowGraph
}
) {

  const problems = validateGraph(graph)

  if(problems.length > 0 ) throw new Error(problems.join(" "))
  
    await db
          .update(workflows)
          .set({graph,updatedAt: new Date()})
          .where(and(eq(workflows.id,id),eq(workflows.orgId,orgId)))
  
}

export type RunStatus = typeof runStatusEnum.enumValues[number]

export async function createRun({
  id,
  orgId,
  workflowId,
  userId,
}: {
  id: string
  orgId: string
  workflowId: string
  userId?: string
}) {
  const [run] = await db
    .insert(runs)
    .values({ id, orgId, workflowId, userId, status: "running" })
    .returning()

  return run
}

export async function updateRunStatus(id: string, status: RunStatus) {
  await db
    .update(runs)
    .set({ status, updatedAt: new Date() })
    .where(eq(runs.id, id))
}

export function listRuns(orgId: string, workflowId: string) {
  return db
    .select()
    .from(runs)
    .where(and(eq(runs.orgId, orgId), eq(runs.workflowId, workflowId)))
    .orderBy(desc(runs.createdAt))
}