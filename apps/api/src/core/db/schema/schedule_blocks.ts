import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { workers } from './workers.ts';
import { branches } from './branches.ts';

export const scheduleBlocks = pgTable('schedule_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinics.id, { onDelete: 'restrict' }),
  workerId: uuid('worker_id')
    .notNull()
    .references(() => workers.id, { onDelete: 'cascade' }),
  branchId: uuid('branch_id').references(() => branches.id, {
    onDelete: 'cascade',
  }),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  reason: varchar('reason', { length: 200 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ScheduleBlockTable = typeof scheduleBlocks;
export type ScheduleBlockColumn = keyof ScheduleBlockSelect;

export type ScheduleBlockSelect = typeof scheduleBlocks.$inferSelect;
export type ScheduleBlockInsert = typeof scheduleBlocks.$inferInsert;
export type ScheduleBlockUpdate = Partial<
  Omit<ScheduleBlockInsert, 'id' | 'createdAt'>
>;
