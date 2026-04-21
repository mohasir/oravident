import { db } from "@/core/db/index.ts";
import { roles } from "@/core/db/schema/roles.ts";
import { permissions } from "@/core/db/schema/permissions.ts";
import { rolePermissions } from "@/core/db/schema/role_permissions.ts";
import { rolesPermissionsMatrix, ROLE_IDS, RoleType } from "@repo/guards";
import { isNull } from "drizzle-orm";

async function syncRolePermissions() {
  console.log("🛡️  Starting Global Roles and Permissions sync...");

  try {
    const allPermissions = await db.select().from(permissions);

    if (allPermissions.length === 0) {
      console.log("⚠️  No permissions found in the database. Run 'update-permissions' first.");
      process.exit(0);
    }

    console.log("Creating/Verifying Global Roles (System Roles)...");
    const globalRoles = await db.select().from(roles).where(isNull(roles.clinicId));
    
    for (const config of rolesPermissionsMatrix) {
      let dbRole = globalRoles.find(role => role.name === config.role);
      
      if (!dbRole) {
        const [newRole] = await db.insert(roles).values({
          id: ROLE_IDS[config.role as RoleType],
          name: config.role,
          displayName: config.role.charAt(0).toUpperCase() + config.role.slice(1),
          isSystem: true,
        }).returning();

        if (!newRole) {
          throw new Error(`Failed to create global role: ${config.role}`);
        }

        dbRole = newRole;
        globalRoles.push(newRole);
      }
    }

    const dataToInsert: { roleId: string; permissionId: string }[] = [];

    for (const config of rolesPermissionsMatrix) {
      
      const systemRole = globalRoles.find(role => role.name === config.role);

      if (!systemRole) continue;

      for (const permissionCode of config.permissions) {
        const dbPermission = allPermissions.find(
          p => p.code === permissionCode
        );

        if (dbPermission) {
          dataToInsert.push({
            roleId: systemRole.id,
            permissionId: dbPermission.id
          });
        }
      }
    }

    if (dataToInsert.length === 0) {
      console.log("No new relationships to insert.");
      process.exit(0);
    }

    console.log(`Linking ${dataToInsert.length} pairs (Role <-> Permission)...`);

    await db.insert(rolePermissions)
      .values(dataToInsert)
      .onConflictDoNothing();

    console.log("✅ Global Roles and Permissions linked successfully.");

  } catch (error) {
    console.error("❌ Failed to sync RolePermissions:", error);
  } finally {
    process.exit(0);
  }
}

syncRolePermissions();
