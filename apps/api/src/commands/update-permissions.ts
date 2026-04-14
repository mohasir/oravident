import { db } from "@/core/db/index.ts";
import { permissions } from "@/core/db/schema/permissions.ts";
import { permissionsMatrix }  from '@/core/guard/index.ts';

async function syncPermissions() {
  console.log("🌱 Building permissions from matrix...");

  const dataToInsert = permissionsMatrix.flatMap(({ resource, actions }) => 
    actions.map((action) => ({
      code: `${action}-${resource}`,
      resource,
      action,
      displayName: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
    }))
  );

  console.log(`🚀 Syncing ${dataToInsert.length} permissions to the database...`);

  try {
    await db.insert(permissions)
      .values(dataToInsert)
      .onConflictDoNothing({ target: permissions.code });

    console.log("✅ Permissions synced successfully.");
  } catch (error) {
    console.error("❌ Failed to sync permissions:", error);
  } finally {
    process.exit(0);
  }
}

syncPermissions();
