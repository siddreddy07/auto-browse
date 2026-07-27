import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  graph: jsonb("graph").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
