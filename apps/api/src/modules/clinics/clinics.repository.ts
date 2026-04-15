import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database, db } from '@core/db/index.ts';
import { clinics } from '@core/db/schema//clinics.ts';
import { eq, and } from 'drizzle-orm';

export class ClinicsRepository extends BaseRepository {

  constructor(db: Database) {
    super(db);
  }

  async existsById(id: string) {
    const result = await this.db.select({ id: clinics.id })
      .from(clinics)
      .where(
        and(
          eq(clinics.id, id), 
          eq(clinics.isActive, true)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }
}

export const clinicsRepository = new ClinicsRepository(db);
