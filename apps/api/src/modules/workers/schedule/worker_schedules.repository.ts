import { and, eq } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  workerSchedules,
  WorkerScheduleTable,
  WorkerScheduleInsert,
  WorkerScheduleUpdate,
} from '@core/db/schema/worker_schedules.ts';
import { WorkerScheduleFiltersDTO } from './worker_schedules.schema.ts';

export class WorkerSchedulesRepository extends BaseRepository<
  WorkerScheduleTable,
  WorkerScheduleFiltersDTO
> {
  constructor(db: Database) {
    super(db, workerSchedules);
  }

  async create(values: WorkerScheduleInsert) {
    const [schedule] = await this.db
      .insert(workerSchedules)
      .values(values)
      .returning();
    return schedule;
  }

  async update(id: string, values: WorkerScheduleUpdate) {
    const [schedule] = await this.db
      .update(workerSchedules)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(workerSchedules.id, id))
      .returning();
    return schedule;
  }

  async delete(id: string) {
    const [deleted] = await this.db
      .update(workerSchedules)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(workerSchedules.id, id), eq(workerSchedules.isActive, true)))
      .returning();
    return !!deleted;
  }

  async hasSchedulesForWorkerBranch(workerId: string, branchId: string): Promise<boolean> {
    return this.exists({ workerId, branchId } as WorkerScheduleFiltersDTO);
  }
}
