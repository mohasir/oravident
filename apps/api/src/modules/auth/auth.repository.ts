import { Database } from '@core/db/index.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and, SQL } from 'drizzle-orm';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { rolePermissions } from '@/core/db/schema/role_permissions.ts';
import { roles } from '@/core/db/schema/roles.ts';
import { permissions } from '@/core/db/schema/permissions.ts';
import {
  WorkerProfileRowDTO,
  UserFiltersDTO,
} from '@modules/users/users.schema.ts';

export class AuthRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  private mapToUserWithPermissions(rows: WorkerProfileRowDTO[]) {
    if (!rows.length) return null;
    const firstRow = rows[0];
    if (!firstRow) return null;

    const { user, worker, role } = firstRow;
    const permissionsList = rows
      .map((row) => row.permission?.code)
      .filter((code): code is string => !!code);

    return {
      user,
      worker,
      role,
      permissions: permissionsList,
    };
  }

  async findUser(filters: UserFiltersDTO) {
    const conditions: (SQL | undefined)[] = [
      filters.id ? eq(users.id, filters.id) : undefined,
      filters.email ? eq(users.email, filters.email) : undefined,
      filters.isActive !== undefined
        ? eq(users.isActive, filters.isActive)
        : undefined,
    ];

    const rows = await this.db
      .select({
        user: {
          id: users.id,
          email: users.email,
          isSuperadmin: users.isPlatformAdmin,
          passwordHash: users.passwordHash,
        },
        worker: {
          clinicId: workers.clinicId,
        },
        role: {
          id: roles.id,
          name: roles.name,
        },
        permission: {
          id: permissions.id,
          code: permissions.code,
        },
      })
      .from(users)
      .leftJoin(workers, eq(users.id, workers.userId))
      .leftJoin(roles, eq(workers.roleId, roles.id))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(and(...(conditions.filter(Boolean) as SQL[])));

    console.log(JSON.stringify(rows.length, null, 2));

    return this.mapToUserWithPermissions(rows as WorkerProfileRowDTO[]);
  }

  async userExists(filters: UserFiltersDTO): Promise<boolean> {
    const result = await this.db.query.users.findFirst({
      where: (u, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(u.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async updatePassword(userId: string, passwordHash: string, tx?: Database) {
    const conn = tx ?? this.db;
    await conn.update(users).set({ passwordHash }).where(eq(users.id, userId));
  }
}
