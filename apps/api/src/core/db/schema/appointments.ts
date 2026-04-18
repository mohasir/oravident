import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { branches } from './branches.ts';
import { patients } from './patients.ts';
import { workers } from './workers.ts';
import { services } from './services.ts';
import { users } from './users.ts';
import { appointmentStatuses } from './appointment_statuses.ts';

export const appointments = pgTable(
  'appointments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clinicId: uuid('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'restrict' }),
    branchId: uuid('branch_id')
      .notNull()
      .references(() => branches.id, { onDelete: 'restrict' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    workerId: uuid('worker_id')
      .notNull()
      .references(() => workers.id, { onDelete: 'restrict' }),
    serviceId: uuid('service_id').references(() => services.id, {
      onDelete: 'set null',
    }),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    statusId: uuid('status_id')
      .notNull()
      .references(() => appointmentStatuses.id, { onDelete: 'restrict' }),
    notes: text('notes'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
    discountAmount: numeric('discount_amount', {
      precision: 10,
      scale: 2,
    }).default('0'),
    taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).default('0'),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancelledBy: uuid('cancelled_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    cancelReason: text('cancel_reason'),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    version: integer('version').default(1).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('appointments_clinic_idx').on(table.clinicId),
    index('appointments_patient_idx').on(table.patientId),
    index('appointments_branch_idx').on(table.branchId),
    index('appointments_starts_at_idx').on(table.startsAt),
  ],
);

export type AppointmentTable = typeof appointments;
export type AppointmentColumn = keyof AppointmentSelect;

export type AppointmentSelect = typeof appointments.$inferSelect;
export type AppointmentInsert = typeof appointments.$inferInsert;
export type AppointmentUpdate = Partial<
  Omit<AppointmentInsert, 'id' | 'createdAt'>
>;
