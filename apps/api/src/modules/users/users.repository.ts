import { Database } from '@core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserFiltersDTO } from '@modules/users/users.schema.ts';
import { users } from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and, sql } from 'drizzle-orm';

export class UserRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: UserFiltersDTO) {
    const result = await this.db.query.users.findFirst({
      where: (u, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(u.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      // By default we don't return passwordHash unless explicitly asked or handled by resource
      columns: {
        passwordHash: false,
      },
    });

    return result;
  }

  async exists(filters: UserFiltersDTO): Promise<boolean> {
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

  async findMany(
    filters: UserFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    // 1. Get total count
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where((u) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(u.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      });

    const total = Number(countResult[0].count);

    // 2. Get data
    const data = await this.db.query.users.findMany({
      where: (u, { eq, and }) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(u.id, filters.id));
        if (filters.email) conditions.push(eq(u.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(u.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      orderBy: (u, { desc }) => [desc(u.createdAt)],
      columns: { passwordHash: false },
      ...(pagination
        ? this.getPaginationConfig(pagination.page, pagination.limit)
        : {}),
    });

    return { data, total };
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
