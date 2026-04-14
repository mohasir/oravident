import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { DB_LIMITS } from "../constants.ts";

export const appointmentStatuses = pgTable("appointment_statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(), 
  color: varchar("color", { length: DB_LIMITS.COLOR_HEX }),
  bgColor: varchar("bg_color", { length: DB_LIMITS.COLOR_HEX }),
});
