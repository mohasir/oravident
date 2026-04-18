import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  jsonb,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { DB_LIMITS } from '@core/db/constants.ts';

export const branches = pgTable(
  'branches',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    clinicId: uuid('clinic_id')
      .notNull()
      .references(() => clinics.id, {
        onDelete: 'restrict',
      }),
    name: varchar('name', { length: DB_LIMITS.NAME }).notNull(),
    slug: varchar('slug', { length: DB_LIMITS.SLUG }).notNull(),
    phone: varchar('phone', { length: DB_LIMITS.PHONE }),
    email: varchar('email', { length: DB_LIMITS.EMAIL }),
    address: text('address').notNull(),
    latitude: decimal('latitude', { precision: 10, scale: 7 }),
    longitude: decimal('longitude', { precision: 10, scale: 7 }),
    color: varchar('color', { length: DB_LIMITS.COLOR_HEX }),
    settings: jsonb('settings').default({}),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('clinic_slug_idx').on(table.clinicId, table.slug)],
);

export type BranchTable = typeof branches;
export type BranchColumn = keyof BranchSelect;

export type BranchSelect = typeof branches.$inferSelect;
export type BranchInsert = typeof branches.$inferInsert;
export type BranchUpdate = Partial<Omit<BranchInsert, 'id' | 'createdAt'>>;
