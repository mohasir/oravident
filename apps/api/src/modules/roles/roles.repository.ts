import { db, Database } from '@/core/db/index.ts';
import { roles, rolePermissions, permissions } from '@/core/db/schema/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { eq, and, or, isNull } from 'drizzle-orm';
import { RoleFilters } from './roles.schema.ts';

export class RolesRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: RoleFilters) {
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

  async exists(filters: RoleFilters): Promise<boolean> {
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

  async createClinicRole(
    clinicId: string,
    name: string,
    displayName: string,
    description?: string,
  ) {
    const [newRole] = await this.db
      .insert(roles)
      .values({
        clinicId,
        name,
        displayName,
        description,
        isSystem: false,
      })
      .returning();
    return newRole;
  }

  async deleteClinicRole(clinicId: string, roleId: string) {
    return await this.db
      .delete(roles)
      .where(
        and(
          eq(roles.id, roleId),
          eq(roles.clinicId, clinicId),
          eq(roles.isSystem, false),
        ),
      )
      .returning();
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
