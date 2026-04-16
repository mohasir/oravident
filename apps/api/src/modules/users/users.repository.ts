import { Database } from '@core/db/index.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and, SQL } from 'drizzle-orm';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { rolePermissions } from '@/core/db/schema/role_permissions.ts';
import { roles } from '@/core/db/schema/roles.ts';
import { permissions } from '@/core/db/schema/permissions.ts';
import { WorkerProfileRow } from './users.schema.ts';

export class UserRepository extends BaseRepository {

  constructor(db: Database) {
    super(db);
  }

  private async queryUser(where: SQL | undefined) {
    const [user] = await this.db.select()
      .from(users)
      .where(where)
      .limit(1);

    return user;
  }

  private async queryUserExists(where: SQL | undefined) {
    const result = await this.db.select({ id: users.id })
      .from(users)
      .where(where)
      .limit(1);
    
    return result.length > 0;
  }

  private mapToUserWithPermissions(rows: WorkerProfileRow[]) {
    if (!rows.length) return null;

    const firstRow = rows[0];

    if(!firstRow) return null;

    const { user, worker, role } = firstRow;
    
    const permissionsList = rows
      .map(row => row.permission?.code)
      .filter((code): code is string => !!code);

    return {
      user,
      worker,
      role,
      permissions: permissionsList
    };
  }

  private async queryWorkerProfile(where: SQL | undefined) {
    const rows = await this.db.select({
      user: {
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash
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
      }
    })
      .from(users)
      .leftJoin(
        workers,
        eq(users.id, workers.userId)
      )
      .leftJoin(
        roles,
        eq(workers.roleId, roles.id)
      )
      .leftJoin(
        rolePermissions,
        eq(roles.id, rolePermissions.roleId)
      )
      .leftJoin(
        permissions,
        eq(rolePermissions.permissionId, permissions.id)
      )
      .where(where);

    return this.mapToUserWithPermissions(rows);
  }

  async findActiveById(id: string) {
    return this.queryUser(
      and(
        eq(users.id, id),
        eq(users.isActive, true)
      )
    );
  }

  async findActiveUserWorkerById(id: string) {
    return this.queryWorkerProfile(
      and(
        eq(users.id, id),
        eq(users.isActive, true)
      )
    );
  }

  async findActiveUserWorkerByEmail(email: string) {
    return this.queryWorkerProfile(
      and(
        eq(users.email, email),
        eq(users.isActive, true)
      )
    );
  }

  async existsByEmail(email: string) {
    return this.queryUserExists(
      eq(users.email, email)
    );
  }
}