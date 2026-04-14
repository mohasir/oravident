import { pgTable, uuid, varchar, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";
import { users } from "./users.ts";
import { roles } from "./roles.ts";
import { DB_LIMITS } from "../constants.ts";

export const workers = pgTable("workers", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "restrict" }),
  prefix: varchar("prefix", { length: 20 }), 
  specialty: varchar("specialty", { length: DB_LIMITS.NAME }),
  idNumber: varchar("id_number", { length: DB_LIMITS.ID_NUMBER }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("worker_clinic_user_idx").on(table.clinicId, table.userId),
]);
