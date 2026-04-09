import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";

export const communicationTemplates = pgTable("communication_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").references(() => clinics.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }),
  triggerType: varchar("trigger_type", { length: 50 }),
  channel: varchar("channel", { length: 20 }),
  messageBody: text("message_body"),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
