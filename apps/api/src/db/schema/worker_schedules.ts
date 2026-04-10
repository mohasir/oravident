import { pgTable, uuid, smallint, time, boolean, uniqueIndex, timestamp } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";
import { workers } from "./workers.ts";
import { branches } from "./branches.ts";

export const workerSchedules = pgTable("worker_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  workerId: uuid("worker_id").notNull().references(() => workers.id, { onDelete: "cascade" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  dayOfWeek: smallint("day_of_week").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("worker_schedule_idx").on(table.workerId, table.branchId, table.dayOfWeek),
]);
