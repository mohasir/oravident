import { Database } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { workers } from '@/core/db/schema/workers.ts';
import { WorkerFilters } from './workers.schema.ts';
import { eq } from 'drizzle-orm';

export class WorkersRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: WorkerFilters) {
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

  async exists(filters: WorkerFilters): Promise<boolean> {
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

  async findByClinicId(clinicId: string) {
    return await this.db.query.workers.findMany({
      where: (w, { eq, and }) =>
        and(eq(w.clinicId, clinicId), eq(w.isActive, true)),
    });
  }
}
