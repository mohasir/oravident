import {pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import {clinics} from "./clinics.ts";
import { DB_LIMITS } from "../constants.ts";

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  name: varchar("name", { length: DB_LIMITS.SHORT_NAME }).notNull(),
  displayName: varchar("display_name", { length: DB_LIMITS.SHORT_NAME }),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("role_clinic_name_idx").on(table.clinicId, table.name)
]);