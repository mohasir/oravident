import { and, eq } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  branchServices,
  BranchServiceTable,
  BranchServiceInsert,
  BranchServiceSelect,
} from '@core/db/schema/branch_services.ts';
import { BranchServiceFiltersDTO } from './branch_services.schema.ts';

export class BranchServicesRepository extends BaseRepository<
  BranchServiceTable,
  BranchServiceFiltersDTO
> {
  constructor(db: Database) {
    super(db, branchServices);
  }

  async upsert(values: BranchServiceInsert): Promise<BranchServiceSelect> {
    const [record] = await this.db
      .insert(branchServices)
      .values(values)
      .onConflictDoUpdate({
        target: [branchServices.branchId, branchServices.serviceId],
        set: {
          priceOverride: values.priceOverride,
          isActive: values.isActive,
          updatedAt: new Date(),
        },
      })
      .returning();
    return record;
  }

  async remove(branchId: string, serviceId: string): Promise<boolean> {
    const [deleted] = await this.db
      .delete(branchServices)
      .where(
        and(
          eq(branchServices.branchId, branchId),
          eq(branchServices.serviceId, serviceId),
        ),
      )
      .returning();
    return !!deleted;
  }

  async isServiceAvailable(branchId: string, serviceId: string): Promise<boolean> {
    const override = await this.findOne({ branchId, serviceId } as BranchServiceFiltersDTO, {
      columns: { id: branchServices.id, isActive: branchServices.isActive },
    });
    // No record = implicitly available; record with isActive=true = available
    return !override || override.isActive === true;
  }
}
