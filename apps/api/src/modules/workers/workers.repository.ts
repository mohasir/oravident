import { Database } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import {
  workers,
  WorkerTable,
  WorkerInsert,
  WorkerUpdate,
} from '@/core/db/schema/workers.ts';
import { WorkerFiltersDTO } from './workers.schema.ts';
import { eq, desc } from 'drizzle-orm';

export class WorkersRepository extends BaseRepository<
  WorkerTable,
  WorkerFiltersDTO
> {
  constructor(db: Database) {
    super(db, workers);
  }

  async findAll(
    filters: WorkerFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    const countQuery = this.applyFilters(this.totalQuery(), filters);
    const dataQuery = this.db.select().from(this.table).$dynamic();

    this.applyFilters(dataQuery, filters);

    if (pagination) {
      this.withPagination(
        dataQuery,
        desc(workers.createdAt),
        pagination.page,
        pagination.limit,
      );
    }

    const [totalCountResult, data] = await Promise.all([countQuery, dataQuery]);

    const total = Number(totalCountResult[0]?.count ?? 0);
    return { data, total };
  }

  async create(values: WorkerInsert) {
    const [newWorker] = await this.db
      .insert(workers)
      .values(values)
      .returning();

    return newWorker;
  }

  async update(id: string, values: WorkerUpdate) {
    const [updatedWorker] = await this.db
      .update(workers)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(workers.id, id))
      .returning();

    return updatedWorker;
  }

  async delete(id: string) {
    const [deletedWorker] = await this.db
      .delete(workers)
      .where(eq(workers.id, id))
      .returning();

    return deletedWorker;
  }
}
