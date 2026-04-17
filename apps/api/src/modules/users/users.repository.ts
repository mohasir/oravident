import { Database } from '@core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserFilters } from '@modules/users/users.schema.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and } from 'drizzle-orm';

export class UserRepository extends BaseRepository {
  private readonly defaultUserFilters: UserFilters = { isActive: true };
  private readonly defaultHiddenColumns = { passwordHash: false } as const;

  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserFilters) {
    const finalFilters = { ...this.defaultUserFilters, ...filters };

    const result = await this.db.query.users.findFirst({
      where: (userTable, { eq, and }) => {
        const conditions = (
          Object.keys(finalFilters) as Array<keyof typeof userTable>
        )
          .filter((key) => finalFilters[key as keyof UserFilters] !== undefined)
          .map((key) =>
            eq(userTable[key], finalFilters[key as keyof UserFilters]!),
          );

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: this.defaultHiddenColumns,
    });

    return result;
  }

  async exists(filters: UserFilters): Promise<boolean> {
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

  async findActiveUserWorkerById(id: string) {
    const rows = await this.db
      .select({
        id: users.id,
        email: users.email,
        worker: {
          clinicId: workers.clinicId,
        },
      })
      .from(users)
      .leftJoin(workers, eq(users.id, workers.userId))
      .where(and(eq(users.id, id), eq(users.isActive, true)))
      .limit(1);

    return rows[0];
  }
}
