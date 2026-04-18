import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { appointments } from './appointments.ts';
import { appointmentStatuses } from './appointment_statuses.ts';
import { users } from './users.ts';
import { actionSourceEnum } from '@core/db/enums.ts';

export const appointmentStatusHistory = pgTable(
  'appointment_status_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    appointmentId: uuid('appointment_id')
      .notNull()
      .references(() => appointments.id, { onDelete: 'cascade' }),
    statusId: uuid('status_id')
      .notNull()
      .references(() => appointmentStatuses.id, { onDelete: 'restrict' }),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    appointmentVersion: integer('appointment_version').notNull().default(1),
    source: actionSourceEnum('source').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('appointment_history_id_idx').on(table.appointmentId),
    index('appointment_history_created_idx').on(table.createdAt),
  ],
);

export type AppointmentStatusHistoryTable = typeof appointmentStatusHistory;
export type AppointmentStatusHistoryColumn =
  keyof AppointmentStatusHistorySelect;

export type AppointmentStatusHistorySelect =
  typeof appointmentStatusHistory.$inferSelect;
export type AppointmentStatusHistoryInsert =
  typeof appointmentStatusHistory.$inferInsert;
export type AppointmentStatusHistoryUpdate = Partial<
  Omit<AppointmentStatusHistoryInsert, 'id' | 'createdAt'>
>;
