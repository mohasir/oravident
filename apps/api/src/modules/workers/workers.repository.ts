import { Database } from '@/core/db/index.ts';
import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import {
  workers,
  WorkerTable,
  WorkerInsert,
  WorkerUpdate,
} from '@/core/db/schema/workers.ts';
import { WorkerFiltersDTO } from './workers.schema.ts';
import { eq, and, notInArray } from 'drizzle-orm';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';

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
    const demoWorkerIds = [
      DEMO_IDS.WORKER_ADMIN,
      DEMO_IDS.WORKER_DOCTOR,
      DEMO_IDS.WORKER_RECEPTION,
    ];

    const [deletedService] = await this.db
      .update(workers)
      .set({ isActive: false })
      .where(and(eq(workers.id, id), notInArray(workers.id, demoWorkerIds)))
      .returning();
    return !!deletedService;
  }
}
