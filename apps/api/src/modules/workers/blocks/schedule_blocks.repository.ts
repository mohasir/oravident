import { and, eq, gt, lt } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  scheduleBlocks,
  ScheduleBlockTable,
  ScheduleBlockInsert,
  ScheduleBlockUpdate,
  ScheduleBlockSelect,
} from '@core/db/schema/schedule_blocks.ts';
import { ScheduleBlockFiltersDTO } from './schedule_blocks.schema.ts';

export class ScheduleBlocksRepository extends BaseRepository<
  ScheduleBlockTable,
  ScheduleBlockFiltersDTO
> {
  constructor(db: Database) {
    super(db, scheduleBlocks);
  }

  async create(values: ScheduleBlockInsert) {
    const [block] = await this.db
      .insert(scheduleBlocks)
      .values(values)
      .returning();
    return block;
  }

  async update(id: string, values: ScheduleBlockUpdate) {
    const [block] = await this.db
      .update(scheduleBlocks)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(scheduleBlocks.id, id))
      .returning();
    return block;
  }

  async delete(id: string) {
    const [deleted] = await this.db
      .delete(scheduleBlocks)
      .where(eq(scheduleBlocks.id, id))
      .returning();
    return !!deleted;
  }

  async findOverlapping(workerId: string, startsAt: Date, endsAt: Date): Promise<ScheduleBlockSelect[]> {
    return this.db
      .select()
      .from(scheduleBlocks)
      .where(
        and(
          eq(scheduleBlocks.workerId, workerId),
          lt(scheduleBlocks.startAt, endsAt),
          gt(scheduleBlocks.endAt, startsAt),
        ),
      ) as unknown as Promise<ScheduleBlockSelect[]>;
  }
}
