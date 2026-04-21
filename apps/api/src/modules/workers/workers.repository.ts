import { Database } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import {
  workers,
  WorkerTable,
  WorkerInsert,
  WorkerUpdate,
} from '@/core/db/schema/workers.ts';
import { WorkerFiltersDTO } from './workers.schema.ts';
import { eq } from 'drizzle-orm';

export class WorkersRepository extends BaseRepository<
  WorkerTable,
  WorkerFiltersDTO
> {
  constructor(db: Database) {
    super(db, workers);
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
    const [deletedService] = await this.db
      .update(workers)
      .set({ isActive: false })
      .where(eq(workers.id, id))
      .returning();
    return !!deletedService;
  }
}
