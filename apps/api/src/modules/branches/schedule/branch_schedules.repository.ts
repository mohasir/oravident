import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  branchSchedules,
  BranchScheduleTable,
  BranchScheduleInsert,
  BranchScheduleUpdate,
} from '@core/db/schema/branch_schedules.ts';
import { BranchScheduleFiltersDTO } from '@modules/branches/schedule/branch_schedules.schema.ts';
import { and, eq, inArray } from 'drizzle-orm';

export class BranchSchedulesRepository extends BaseRepository<
  BranchScheduleTable,
  BranchScheduleFiltersDTO
> {
  constructor(db: Database) {
    super(db, branchSchedules);
  }

  async create(values: BranchScheduleInsert) {
    const [schedule] = await this.db
      .insert(branchSchedules)
      .values(values)
      .returning();
    return schedule;
  }

  async upsert(values: BranchScheduleInsert) {
    const [schedule] = await this.db
      .insert(branchSchedules)
      .values(values)
      .onConflictDoUpdate({
        target: [branchSchedules.branchId, branchSchedules.dayOfWeek],
        set: {
          openTime: values.openTime,
          closeTime: values.closeTime,
          isActive: true,
          updatedAt: new Date(),
        },
      })
      .returning();
    return schedule;
  }

  async update(id: string, values: BranchScheduleUpdate) {
    const [schedule] = await this.db
      .update(branchSchedules)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(branchSchedules.id, id))
      .returning();
    return schedule;
  }

  async findAllByBranchIds(branchIds: string[]) {
    return this.db
      .select()
      .from(branchSchedules)
      .where(
        and(
          inArray(branchSchedules.branchId, branchIds),
          eq(branchSchedules.isActive, true),
        ),
      )
      .orderBy(branchSchedules.branchId, branchSchedules.dayOfWeek);
  }

  async delete(id: string) {
    const [deleted] = await this.db
      .update(branchSchedules)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(branchSchedules.id, id), eq(branchSchedules.isActive, true)))
      .returning();
    return !!deleted;
  }

  async deleteByBranchId(branchId: string) {
    return this.db
      .update(branchSchedules)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(branchSchedules.branchId, branchId),
          eq(branchSchedules.isActive, true),
        ),
      );
  }
}
