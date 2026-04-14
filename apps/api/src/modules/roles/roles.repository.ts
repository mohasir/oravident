import { db } from "@/core/db/index.ts";
import { roles, rolePermissions, permissions } from "@/core/db/schema/index.ts";
import { eq, and, isNull } from "drizzle-orm";

export class RolesRepository {

  async findSystemRoles() {
    return await db.select()
      .from(roles)
      .where(isNull(roles.clinicId));
  }

  async findRolesByClinic(clinicId: string) {
    return await db.select()
      .from(roles)
      .where(eq(roles.clinicId, clinicId));
  }

  async findById(roleId: string) {
    const [role] = await db.select()
      .from(roles)
      .where(eq(roles.id, roleId));
    return role;
  }

  async createClinicRole(clinicId: string, name: string, displayName: string, description?: string) {
    const [newRole] = await db.insert(roles).values({
      clinicId,
      name,
      displayName,
      description,
      isSystem: false,
    }).returning();
    return newRole;
  }

  async deleteClinicRole(clinicId: string, roleId: string) {
    return await db.delete(roles)
      .where(and(
        eq(roles.id, roleId),
        eq(roles.clinicId, clinicId),
        eq(roles.isSystem, false)
      ))
      .returning();
  }

  async findPermissionsByRole(roleId: string) {
    const result = await db.select({
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

export const rolesRepository = new RolesRepository();
