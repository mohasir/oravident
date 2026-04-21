import { Database } from '@core/db/index.ts';
import {
  services,
  ServiceInsert,
  ServiceSelect,
  ServiceUpdate,
  ServiceTable,
} from '@core/db/schema/services.ts';
import { eq, ne } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { ServiceFiltersDTO } from '@modules/services/services.schema.ts';

export class ServicesRepository extends BaseRepository<
  ServiceTable,
  ServiceFiltersDTO
> {
  constructor(db: Database) {
    super(db, services);
  }

  async create(data: ServiceInsert): Promise<ServiceSelect | undefined> {
    const [newService] = await this.db
      .insert(services)
      .values(data)
      .returning();
    return newService;
  }

  async update(id: string, values: ServiceUpdate) {
    const [updatedService] = await this.db
      .update(services)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async delete(id: string): Promise<boolean> {
    const [deletedService] = await this.db
      .update(services)
      .set({ isActive: false })
      .where(eq(services.id, id))
      .returning();
    return !!deletedService;
  }

  protected override applyFilters<
    T extends import('drizzle-orm/pg-core').PgSelect,
  >(qb: T, filters: ServiceFiltersDTO) {
    const { excludeId, ...rest } = filters;

    super.applyFilters(qb, rest);

    if (excludeId) {
      qb.where(ne(services.id, excludeId));
    }

    return qb;
  }
}
