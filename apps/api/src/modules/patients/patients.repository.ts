import { Database } from '@core/db/index.ts';
import {
  patients,
  PatientInsert,
  PatientSelect,
  PatientUpdate,
  PatientTable,
} from '@core/db/schema/patients.ts';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { PatientFiltersDTO } from '@modules/patients/patients.schema.ts';

export class PatientsRepository extends BaseRepository<
  PatientTable,
  PatientFiltersDTO
> {
  constructor(db: Database) {
    super(db, patients);
  }

  async create(data: PatientInsert): Promise<PatientSelect | undefined> {
    const [newPatient] = await this.db
      .insert(patients)
      .values(data)
      .returning();
    return newPatient;
  }

  async update(id: string, values: PatientUpdate) {
    const [updatedPatient] = await this.db
      .update(patients)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async delete(id: string): Promise<boolean> {
    const [deletedPatient] = await this.db
      .update(patients)
      .set({ isActive: false })
      .where(eq(patients.id, id))
      .returning();
    return !!deletedPatient;
  }
}
