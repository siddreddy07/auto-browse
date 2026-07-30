import { StepNodeType } from "@/features/workflows/node-registry";
import { Edge } from "@xyflow/react";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";




export type workflowGraph = {nodes: StepNodeType[]; edges:Edge[]}

export const workflows = pgTable("workflows", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  graph: jsonb("graph").$type<workflowGraph>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect


export const agents = pgTable("agents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdBy: text("created_by").notNull(),
  orgId: text("org_id"),
  apiKey: text("api_key").notNull(),
  prompt: text("prompt").notNull(),
  modelName: text("model_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect & { shared: boolean }
