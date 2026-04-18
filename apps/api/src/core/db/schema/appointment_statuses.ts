import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { DB_LIMITS } from '@core/db/constants.ts';

export const appointmentStatuses = pgTable('appointment_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: DB_LIMITS.COLOR_HEX }),
  bgColor: varchar('bg_color', { length: DB_LIMITS.COLOR_HEX }),
});

export type AppointmentStatusTable = typeof appointmentStatuses;
export type AppointmentStatusColumn = keyof AppointmentStatusSelect;

export type AppointmentStatusSelect = typeof appointmentStatuses.$inferSelect;
export type AppointmentStatusInsert = typeof appointmentStatuses.$inferInsert;
export type AppointmentStatusUpdate = Partial<
  Omit<AppointmentStatusInsert, 'id'>
>;
