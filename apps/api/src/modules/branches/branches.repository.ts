import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  branches,
  BranchTable,
  BranchInsert,
  BranchUpdate,
} from '@core/db/schema/branches.ts';
import { BranchFiltersDTO } from '@modules/branches/branches.schema.ts';
import { eq, and, ne } from 'drizzle-orm';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';

export class BranchesRepository extends BaseRepository<
  BranchTable,
  BranchFiltersDTO
> {
  constructor(db: Database) {
    super(db, branches);
  }

  async create(values: BranchInsert) {
    const [newBranch] = await this.db
      .insert(branches)
      .values(values)
      .returning();

    return newBranch;
  }

  async update(id: string, values: BranchUpdate) {
    const [updatedBranch] = await this.db
      .update(branches)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(branches.id, id))
      .returning();

    return updatedBranch;
  }

  async delete(id: string) {
    const [deletedService] = await this.db
      .update(branches)
      .set({ isActive: false })
      .where(and(eq(branches.id, id), ne(branches.id, DEMO_IDS.BRANCH)))
      .returning();
    return !!deletedService;
  }
}
