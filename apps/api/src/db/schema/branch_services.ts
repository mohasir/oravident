import { pgTable, uuid, numeric, uniqueIndex } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";
import { branches } from "./branches.ts";
import { services } from "./services.ts";

export const branchServices = pgTable("branch_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  branchId: uuid("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  priceOverride: numeric("price_override", { precision: 10, scale: 2 }),
}, (table) => [
  uniqueIndex("branch_service_idx").on(table.branchId, table.serviceId),
]);
