import { db, Database} from "@/core/db/index.ts";
import { roles, rolePermissions, permissions } from "@/core/db/schema/index.ts";
import { BaseRepository } from "@/core/shared/BaseRepository.ts";
import { eq, and, or, isNull } from "drizzle-orm";

export class RolesRepository extends BaseRepository {

  constructor(db: Database){
    super(db);
  }

  async findSystemRoles() {
    return await this.db.select()
      .from(roles)
      .where(isNull(roles.clinicId));
  }

  async findRolesByClinic(clinicId: string) {
    return await this.db.select()
      .from(roles)
      .where(eq(roles.clinicId, clinicId));
  }

  async findById(roleId: string) {
    const [role] = await this.db.select()
      .from(roles)
      .where(eq(roles.id, roleId));
    return role;
  }

  async isValidRoleForClinic(id: string, clinicId: string): Promise<boolean> {
      const result = await this.db.select({ id: roles.id })
        .from(roles)
        .where(
          and(
            eq(roles.id, id),
            eq(roles.isActive, true),
            or(
              eq(roles.isSystem, true),
              eq(roles.clinicId, clinicId),
            ),
          )
        )
        .limit(1);
      
      return result.length > 0;
    }

  async createClinicRole(clinicId: string, name: string, displayName: string, description?: string) {
    const [newRole] = await this.db.insert(roles).values({
      clinicId,
      name,
      displayName,
      description,
      isSystem: false,
    }).returning();
    return newRole;
  }

  async deleteClinicRole(clinicId: string, roleId: string) {
    return await this.db.delete(roles)
      .where(and(
        eq(roles.id, roleId),
        eq(roles.clinicId, clinicId),
        eq(roles.isSystem, false)
      ))
      .returning();
  }

  async findPermissionsByRole(roleId: string) {
    const result = await this.db.select({
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

