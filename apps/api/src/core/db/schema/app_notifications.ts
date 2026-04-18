import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { clinics } from './clinics.ts';
import { branches } from './branches.ts';
import { roles } from './roles.ts';
import { permissions } from './permissions.ts';
import { users } from './users.ts';

export const appNotifications = pgTable('app_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinics.id, { onDelete: 'restrict' }),
  branchId: uuid('branch_id').references(() => branches.id, {
    onDelete: 'cascade',
  }),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').references(() => permissions.id, {
    onDelete: 'cascade',
  }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  actionTrigger: varchar('action_trigger', { length: 50 }),
  title: varchar('title', { length: 150 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AppNotificationTable = typeof appNotifications;
export type AppNotificationColumn = keyof AppNotificationSelect;

export type AppNotificationSelect = typeof appNotifications.$inferSelect;
export type AppNotificationInsert = typeof appNotifications.$inferInsert;
export type AppNotificationUpdate = Partial<
  Omit<AppNotificationInsert, 'id' | 'createdAt'>
>;
