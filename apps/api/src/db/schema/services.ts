import { pgTable, uuid, varchar, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});
