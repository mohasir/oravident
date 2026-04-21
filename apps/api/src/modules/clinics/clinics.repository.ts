import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  clinics,
  ClinicTable,
  ClinicInsert,
  ClinicUpdate,
} from '@core/db/schema/clinics.ts';
import { ClinicFiltersDTO } from '@modules/clinics/clinics.schema.ts';
import { eq, and, ne } from 'drizzle-orm';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';

export class ClinicsRepository extends BaseRepository<
  ClinicTable,
  ClinicFiltersDTO
> {
  constructor(db: Database) {
    super(db, clinics);
  }

  async create(values: ClinicInsert) {
    const [newClinic] = await this.db
      .insert(clinics)
      .values(values)
      .returning();

    return newClinic;
  }

  async update(id: string, values: ClinicUpdate) {
    const [updatedClinic] = await this.db
      .update(clinics)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(clinics.id, id))
      .returning();

    return updatedClinic;
  }

  async delete(id: string) {
    const [deletedService] = await this.db
      .update(clinics)
      .set({ isActive: false })
      .where(and(eq(clinics.id, id), ne(clinics.id, DEMO_IDS.CLINIC)))
      .returning();
    return !!deletedService;
  }
}
