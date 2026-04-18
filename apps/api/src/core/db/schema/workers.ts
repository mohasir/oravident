import {
  pgTable,
  uuid,
  varchar,
  date,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { users } from './users.ts';
import { roles } from './roles.ts';
import { DB_LIMITS } from '@core/db/constants.ts';
import { genderEnum, contractTypeEnum } from '@core/db/enums.ts';

export const workers = pgTable(
  'workers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clinicId: uuid('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'restrict' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
    firstName: varchar('first_name', { length: DB_LIMITS.NAME }).notNull(),
    secondName: varchar('second_name', { length: DB_LIMITS.NAME }),
    lastName: varchar('lastname', { length: DB_LIMITS.NAME }).notNull(),
    secondLastName: varchar('second_lastname', { length: DB_LIMITS.NAME }),
    phone: varchar('phone', { length: DB_LIMITS.PHONE }).notNull(),
    dateOfBirth: date('date_of_birth'),
    gender: genderEnum('gender').notNull(),
    prefix: varchar('prefix', { length: DB_LIMITS.PREFIX }),
    specialty: varchar('specialty', { length: DB_LIMITS.NAME }),
    idNumber: varchar('id_number', { length: DB_LIMITS.ID_NUMBER }),
    licenseNumber: varchar('license_number', { length: DB_LIMITS.SHORT_NAME }),
    calendarColor: varchar('calendar_color', {
      length: DB_LIMITS.COLOR_HEX,
    }).default('#3B82F6'),
    contractType: contractTypeEnum('contract_type').default('FULL_TIME'),
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
    uniqueIndex('worker_clinic_user_idx').on(table.clinicId, table.userId),
  ],
);

export type WorkerTable = typeof workers;
export type WorkerColumn = keyof WorkerSelect;

export type WorkerSelect = typeof workers.$inferSelect;
export type WorkerInsert = typeof workers.$inferInsert;
export type WorkerUpdate = Partial<Omit<WorkerInsert, 'id' | 'createdAt'>>;
