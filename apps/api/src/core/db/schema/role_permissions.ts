import { pgTable, uuid, uniqueIndex } from 'drizzle-orm/pg-core';
import { roles } from './roles.ts';
import { permissions } from './permissions.ts';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (table) => [
    uniqueIndex('role_perm_pk_idx').on(table.roleId, table.permissionId),
  ],
);

export type RolePermissionTable = typeof rolePermissions;
export type RolePermissionColumn = keyof RolePermissionSelect;

export type RolePermissionSelect = typeof rolePermissions.$inferSelect;
export type RolePermissionInsert = typeof rolePermissions.$inferInsert;
export type RolePermissionUpdate = Partial<
  Omit<RolePermissionInsert, 'id' | 'createdAt'>
>;
