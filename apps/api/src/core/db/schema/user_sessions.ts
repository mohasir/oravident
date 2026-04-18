import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.ts';

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  isValid: boolean('is_valid').default(true).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserSessionTable = typeof userSessions;
export type UserSessionColumn = keyof UserSessionSelect;

export type UserSessionSelect = typeof userSessions.$inferSelect;
export type UserSessionInsert = typeof userSessions.$inferInsert;
export type UserSessionUpdate = Partial<
  Omit<UserSessionInsert, 'id' | 'createdAt'>
>;
