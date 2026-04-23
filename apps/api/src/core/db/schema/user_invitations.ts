import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { roles } from './roles.ts';
import { users } from './users.ts';
import { DB_LIMITS } from '@core/db/constants.ts';

export const userInvitations = pgTable(
  'user_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: DB_LIMITS.EMAIL }).notNull(),
    clinicId: uuid('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancelledBy: uuid('cancelled_by').references(() => users.id, {
      onDelete: 'set null',
    }),
  },
  (table) => [uniqueIndex('clinic_email_idx').on(table.clinicId, table.email)],
);

export type UserInvitationTable = typeof userInvitations;
export type UserInvitationColumn = keyof UserInvitationSelect;

export type UserInvitationSelect = typeof userInvitations.$inferSelect;
export type UserInvitationInsert = typeof userInvitations.$inferInsert;
export type UserInvitationUpdate = Partial<
  Omit<UserInvitationInsert, 'id' | 'createdAt'>
>;
