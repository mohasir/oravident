import { pgTable, uuid, varchar, text, integer, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { clinics } from "./clinics.ts";
import { branches } from "./branches.ts";
import { DB_LIMITS } from "../constants.ts";
import { genderEnum } from "../enums.ts";

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "restrict" }),
  primaryBranchId: uuid("primary_branch_id").references(() => branches.id, { onDelete: "set null" }),
  firstName: varchar("first_name", { length: DB_LIMITS.NAME }).notNull(),
  secondName: varchar("second_name", { length: DB_LIMITS.NAME }),
  lastName: varchar("lastname", { length: DB_LIMITS.NAME }).notNull(),
  secondLastName: varchar("second_lastname", { length: DB_LIMITS.NAME }),
  idNumber: varchar("id_number", { length: DB_LIMITS.ID_NUMBER }),
  email: varchar("email", { length: DB_LIMITS.EMAIL }),
  phone: varchar("phone", { length: DB_LIMITS.PHONE }).notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: genderEnum("gender"),
  address: text("address"),
  medicalNotes: text("medical_notes"),
  totalAppointments: integer("total_appointments").default(0).notNull(),
  lastAppointmentAt: timestamp("last_appointment_at", { withTimezone: true }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});
