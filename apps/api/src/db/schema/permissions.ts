import {pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import { DB_LIMITS } from "./constants.ts";

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  resource: varchar("resource", { length: DB_LIMITS.SHORT_NAME }).notNull(),
  action: varchar("action", { length: 20 }).notNull(),
  displayName: varchar("display_name", { length: DB_LIMITS.SHORT_NAME }),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("perm_resource_action_idx").on(table.resource, table.action)
]);
