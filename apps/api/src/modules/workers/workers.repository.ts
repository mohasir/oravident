import { Database } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { WorkerFiltersDTO } from './workers.schema.ts';
import { eq, and, sql } from 'drizzle-orm';

export class WorkersRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: WorkerFiltersDTO) {
    const result = await this.db.query.workers.findFirst({
      where: (w, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(w.id, filters.id));
        if (filters.clinicId) conditions.push(eq(w.clinicId, filters.clinicId));
        if (filters.userId) conditions.push(eq(w.userId, filters.userId));
        if (filters.roleId) conditions.push(eq(w.roleId, filters.roleId));
        if (filters.isActive !== undefined)
          conditions.push(eq(w.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: WorkerFiltersDTO): Promise<boolean> {
    const result = await this.db.query.workers.findFirst({
      where: (w, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(w.id, filters.id));
        if (filters.clinicId) conditions.push(eq(w.clinicId, filters.clinicId));
        if (filters.userId) conditions.push(eq(w.userId, filters.userId));
        if (filters.roleId) conditions.push(eq(w.roleId, filters.roleId));
        if (filters.isActive !== undefined)
          conditions.push(eq(w.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async findMany(
    filters: WorkerFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    // 1. Get total count
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(workers)
      .where((w) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(w.id, filters.id));
        if (filters.clinicId) conditions.push(eq(w.clinicId, filters.clinicId));
        if (filters.userId) conditions.push(eq(w.userId, filters.userId));
        if (filters.roleId) conditions.push(eq(w.roleId, filters.roleId));
        if (filters.isActive !== undefined)
          conditions.push(eq(w.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      });

    const total = Number(countResult[0].count);

    // 2. Get data
    const data = await this.db.query.workers.findMany({
      where: (w, { eq, and }) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(w.id, filters.id));
        if (filters.clinicId) conditions.push(eq(w.clinicId, filters.clinicId));
        if (filters.userId) conditions.push(eq(w.userId, filters.userId));
        if (filters.roleId) conditions.push(eq(w.roleId, filters.roleId));
        if (filters.isActive !== undefined)
          conditions.push(eq(w.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      orderBy: (w, { desc }) => [desc(w.createdAt)],
      ...(pagination
        ? this.getPaginationConfig(pagination.page, pagination.limit)
        : {}),
    });

    return { data, total };
  }

  async create(values: typeof workers.$inferInsert) {
    const [newWorker] = await this.db
      .insert(workers)
      .values(values)
      .returning();

    return newWorker;
  }

  async update(id: string, values: Partial<typeof workers.$inferInsert>) {
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
