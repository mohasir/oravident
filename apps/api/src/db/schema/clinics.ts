import {pgTable, uuid, varchar, jsonb, boolean, timestamp} from "drizzle-orm/pg-core";
import { DB_LIMITS } from "./constants.ts";

export const clinics = pgTable("clinics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: DB_LIMITS.NAME }).notNull(),
  slug: varchar("slug", { length: DB_LIMITS.SLUG }).unique().notNull(),
  email: varchar("email", { length: DB_LIMITS.EMAIL }).notNull(),
  phone: varchar("phone", { length: DB_LIMITS.PHONE }), // E.164
  logoUrl: varchar("logo_url", { length: DB_LIMITS.URL }),
  timeZone: varchar("timezone", { length: DB_LIMITS.TIMEZONE }).default("America/Managua").notNull(),
  settings: jsonb("settings").default({}),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});