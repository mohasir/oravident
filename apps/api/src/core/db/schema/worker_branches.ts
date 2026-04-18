import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { workers } from './workers.ts';
import { branches } from './branches.ts';

export const workerBranches = pgTable(
  'worker_branches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clinicId: uuid('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'restrict' }),
    workerId: uuid('worker_id')
      .notNull()
      .references(() => workers.id, { onDelete: 'cascade' }),
    branchId: uuid('branch_id')
      .notNull()
      .references(() => branches.id, { onDelete: 'cascade' }),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('worker_branch_idx').on(table.workerId, table.branchId),
  ],
);

export type WorkerBranchTable = typeof workerBranches;
export type WorkerBranchColumn = keyof WorkerBranchSelect;

export type WorkerBranchSelect = typeof workerBranches.$inferSelect;
export type WorkerBranchInsert = typeof workerBranches.$inferInsert;
export type WorkerBranchUpdate = Partial<
  Omit<WorkerBranchInsert, 'id' | 'createdAt'>
>;
