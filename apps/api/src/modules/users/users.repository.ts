import { Database } from '@core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { UserFiltersDTO } from '@modules/users/users.schema.ts';
import {
  users,
  UserTable,
  UserInsert,
  UserUpdate,
  publicUserColumns,
} from '@/core/db/schema/users.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { eq, and, sql, desc } from 'drizzle-orm';

export class UserRepository extends BaseRepository<UserTable, UserFiltersDTO> {
  constructor(db: Database) {
    super(db, users);
  }

  async findOne(filters: UserFiltersDTO) {
    const query = this.db.select(publicUserColumns).from(this.table).$dynamic();
    this.applyFilters(query, filters);

    const [result] = await query.limit(1);
    return result || null;
  }

  async findAll(
    filters: UserFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    const countQuery = this.applyFilters(this.totalQuery(), filters);
    const dataQuery = this.db
      .select(publicUserColumns)
      .from(this.table)
      .$dynamic();

    this.applyFilters(dataQuery, filters);

    if (pagination) {
      this.withPagination(
        dataQuery,
        desc(users.createdAt),
        pagination.page,
        pagination.limit,
      );
    }

    const [totalCountResult, data] = await Promise.all([countQuery, dataQuery]);

    const total = Number(totalCountResult[0]?.count ?? 0);
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

  async create(values: UserInsert) {
    const [newUser] = await this.db.insert(users).values(values).returning();
    return newUser;
  }

  async update(id: string, values: UserUpdate) {
    const [updatedUser] = await this.db
      .update(users)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
}
