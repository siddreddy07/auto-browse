import { db } from "@/lib/db";
import { agents, type Agent } from "@/lib/schema";
import { desc, eq, isNull, or } from "drizzle-orm";

export async function createAgent({
  name,
  orgId,
  createdBy,
  apiKey,
  modelName,
  prompt,
}: {
  name: string;
  orgId: string | null;
  createdBy: string;
  apiKey: string;
  modelName: string;
  prompt: string;
}) {
  const [row] = await db
    .insert(agents)
    .values({
      name,
      orgId,
      createdBy,
      apiKey,
      modelName,
      prompt,
    })
    .returning();

  return {
    ...row,
    shared: row.orgId === null,
  } satisfies Agent;
}

export async function listAgents(orgId: string | null, userId: string) {
  const rows = await db
    .select()
    .from(agents)
    .where(
      orgId
        ? or(eq(agents.orgId, orgId), isNull(agents.orgId))
        : isNull(agents.orgId)
    )
    .orderBy(desc(agents.createdAt));

  return rows.map((row) => ({
    ...row,
    shared: row.orgId === null,
  })) satisfies Agent[];
}

export async function getAgentById(id: string) {
  const [row] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, id));

  if (!row) return undefined;

  return {
    ...row,
    shared: row.orgId === null,
  } satisfies Agent;
}
