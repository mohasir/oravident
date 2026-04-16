import { Database } from '@core/db/index.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and, SQL } from 'drizzle-orm';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { rolePermissions } from '@/core/db/schema/role_permissions.ts';
import { roles } from '@/core/db/schema/roles.ts';
import { permissions } from '@/core/db/schema/permissions.ts';
import { WorkerProfileRow, UserFilters } from '@modules/users/users.schema.ts';

export class AuthRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  private mapToUserWithPermissions(rows: WorkerProfileRow[]) {
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

  async findUser(filters: UserFilters) {
    const finalFilters = { isActive: true, ...filters };

    const conditions: (SQL | undefined)[] = [
      finalFilters.id ? eq(users.id, finalFilters.id) : undefined,
      finalFilters.email ? eq(users.email, finalFilters.email) : undefined,
      finalFilters.isActive !== undefined
        ? eq(users.isActive, finalFilters.isActive)
        : undefined,
    ];

    const rows = await this.db
      .select({
        user: {
          id: users.id,
          email: users.email,
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

    return this.mapToUserWithPermissions(rows);
  }

  async userExists(filters: UserFilters): Promise<boolean> {
    const result = await this.db.query.users.findFirst({
      where: (u, { eq, and }) => {
        const conditions = (Object.keys(filters) as Array<keyof typeof u>)
          .filter((key) => filters[key as keyof UserFilters] !== undefined)
          .map((key) => eq(u[key], filters[key as keyof UserFilters]!));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async updatePassword(userId: string, passwordHash: string) {
    await this.db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));
  }
}
