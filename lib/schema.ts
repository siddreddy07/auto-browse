import { StepNodeType } from "@/features/workflows/nodes/node-registry";
import { Edge } from "@xyflow/react";
import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const runStatusEnum = pgEnum("run_status", ["idle", "success", "failed", "running"]);

export const shareLevelEnum = pgEnum("share_level", ["org", "restrict", "all"]);




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
  workflowId: text("workflow_id"),
  shareLevel: shareLevelEnum("share_level").default("org").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect & { shared: boolean }


export const runs = pgTable("runs", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  workflowId: text("workflow_id").notNull(),
  userId: text("user_id"),
  status: runStatusEnum("status").default("idle").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Run = typeof runs.$inferSelect
