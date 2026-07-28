import { db } from "@/lib/db";
import { workflows } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export function listWorkflows(orgId: string) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt));
}

export async function getWorkflowById(id: string) {
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(eq(workflows.id, id));

  return workflow;
}

export async function createWorkflow(orgId: string, name: string) {
    
    const [workflow] = await db
                            .insert(workflows)
                            .values({
                              orgId,
                              name,
                              graph: {},
                            })
                            .returning()
    
    return workflow
    
}
