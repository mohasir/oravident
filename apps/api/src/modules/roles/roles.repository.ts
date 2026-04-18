import { Database } from '@/core/db/index.ts';
import {
  roles,
  rolePermissions,
  permissions,
} from '@/core/db/schema/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { eq, and, or, sql } from 'drizzle-orm';
import { RoleFiltersDTO } from './roles.schema.ts';

export class RolesRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: RoleFiltersDTO) {
    const result = await this.db.query.roles.findFirst({
      where: (r, { eq, and, isNull }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(r.id, filters.id));
        if (filters.name) conditions.push(eq(r.name, filters.name));

        if (filters.clinicId === null) {
          conditions.push(isNull(r.clinicId));
        } else if (filters.clinicId) {
          conditions.push(eq(r.clinicId, filters.clinicId));
        }

        if (filters.isSystem !== undefined) {
          conditions.push(eq(r.isSystem, filters.isSystem));
        }

        if (filters.isActive !== undefined) {
          conditions.push(eq(r.isActive, filters.isActive));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: RoleFiltersDTO): Promise<boolean> {
    const result = await this.db.query.roles.findFirst({
      where: (r, { eq, and, isNull }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(r.id, filters.id));
        if (filters.name) conditions.push(eq(r.name, filters.name));

        if (filters.clinicId === null) {
          conditions.push(isNull(r.clinicId));
        } else if (filters.clinicId) {
          conditions.push(eq(r.clinicId, filters.clinicId));
        }

        if (filters.isSystem !== undefined) {
          conditions.push(eq(r.isSystem, filters.isSystem));
        }

        if (filters.isActive !== undefined) {
          conditions.push(eq(r.isActive, filters.isActive));
        }

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async findMany(
    filters: RoleFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    // 1. Get total count
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(roles)
      .where((r) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(r.id, filters.id));
        if (filters.name) conditions.push(eq(r.name, filters.name));
        if (filters.clinicId === null) {
          conditions.push(sql`${r.clinicId} IS NULL`);
        } else if (filters.clinicId) {
          conditions.push(eq(r.clinicId, filters.clinicId));
        }
        if (filters.isSystem !== undefined)
          conditions.push(eq(r.isSystem, filters.isSystem));
        if (filters.isActive !== undefined)
          conditions.push(eq(r.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      });

    const total = Number(countResult[0].count);

    // 2. Get data
    const data = await this.db.query.roles.findMany({
      where: (r, { eq, and, isNull }) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(r.id, filters.id));
        if (filters.name) conditions.push(eq(r.name, filters.name));

        if (filters.clinicId === null) {
          conditions.push(isNull(r.clinicId));
        } else if (filters.clinicId) {
          conditions.push(eq(r.clinicId, filters.clinicId));
        }

        if (filters.isSystem !== undefined)
          conditions.push(eq(r.isSystem, filters.isSystem));
        if (filters.isActive !== undefined)
          conditions.push(eq(r.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      orderBy: (r, { desc }) => [desc(r.createdAt)],
      ...(pagination
        ? this.getPaginationConfig(pagination.page, pagination.limit)
        : {}),
    });

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

  async create(values: typeof roles.$inferInsert) {
    const [newRole] = await this.db.insert(roles).values(values).returning();
    return newRole;
  }

  async update(id: string, values: Partial<typeof roles.$inferInsert>) {
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
