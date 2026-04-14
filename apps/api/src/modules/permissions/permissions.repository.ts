import { db } from "@/core/db/index.ts";
import { permissions } from "@/core/db/schema/index.ts";
import { eq } from "drizzle-orm";

export class PermissionsRepository {

  async findAll() {
    return await db.select().from(permissions);
  }

  async findByCode(code: string) {
    const [permission] = await db.select()
      .from(permissions)
      .where(eq(permissions.code, code));
    return permission;
  }

  async findByResource(resource: string) {
    return await db.select()
      .from(permissions)
      .where(eq(permissions.resource, resource));
  }
}

export const permissionsRepository = new PermissionsRepository();
