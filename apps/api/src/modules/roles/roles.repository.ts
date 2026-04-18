import { Database } from '@/core/db/index.ts';
import {
  roles,
  rolePermissions,
  permissions,
  RoleTable,
  RoleInsert,
  RoleUpdate,
} from '@/core/db/schema/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { eq, and, or, desc } from 'drizzle-orm';
import { RoleFiltersDTO } from './roles.schema.ts';

export class RolesRepository extends BaseRepository<RoleTable, RoleFiltersDTO> {
  constructor(db: Database) {
    super(db, roles);
  }

  async findAll(
    filters: RoleFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    const countQuery = this.applyFilters(this.totalQuery(), filters);
    const dataQuery = this.db.select().from(this.table).$dynamic();

    this.applyFilters(dataQuery, filters);

    if (pagination) {
      this.withPagination(
        dataQuery,
        desc(roles.createdAt),
        pagination.page,
        pagination.limit,
      );
    }

    const [totalCountResult, data] = await Promise.all([countQuery, dataQuery]);

    const total = Number(totalCountResult[0]?.count ?? 0);
    return { data, total };
  }

  async isValidRoleForClinic(id: string, clinicId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: roles.id })
      .from(roles)
      .where(
        and(
          eq(roles.id, id),
          eq(roles.isActive, true),
          or(eq(roles.isSystem, true), eq(roles.clinicId, clinicId)),
        ),
      )
      .limit(1);

    return result.length > 0;
  }

  async create(values: RoleInsert) {
    const [newRole] = await this.db.insert(roles).values(values).returning();
    return newRole;
  }

  async update(id: string, values: RoleUpdate) {
    const [updatedRole] = await this.db
      .update(roles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return updatedRole;
  }

  async delete(id: string) {
    const [deletedRole] = await this.db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning();
    return deletedRole;
  }

  async findPermissionsByRole(roleId: string) {
    const result = await this.db
      .select({
        id: permissions.id,
        code: permissions.code,
        resource: permissions.resource,
        action: permissions.action,
        displayName: permissions.displayName,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return result;
  }
}
