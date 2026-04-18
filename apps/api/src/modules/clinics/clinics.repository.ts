import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import {
  clinics,
  ClinicTable,
  ClinicInsert,
  ClinicUpdate,
} from '@core/db/schema/clinics.ts';
import { ClinicFiltersDTO } from './clinics.schema.ts';
import { eq } from 'drizzle-orm';

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
    const [deletedClinic] = await this.db
      .delete(clinics)
      .where(eq(clinics.id, id))
      .returning();

    return deletedClinic;
  }
}
