import { pgTable, uuid, smallint, time, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";
import { branches } from "./branches.ts";

export const branchSchedules = pgTable("branch_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  dayOfWeek: smallint("day_of_week").notNull(),
  openTime: time("open_time").notNull(),
  closeTime: time("close_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
  uniqueIndex("branch_schedule_idx").on(table.branchId, table.dayOfWeek),
]);
