import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import { clinics } from '@core/db/schema/clinics.ts';
import { ClinicFilters } from './clinics.schema.ts';

export class ClinicsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: ClinicFilters) {
    const result = await this.db.query.clinics.findFirst({
      where: (c, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(c.id, filters.id));
        if (filters.slug) conditions.push(eq(c.slug, filters.slug));
        if (filters.email) conditions.push(eq(c.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(c.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: ClinicFilters): Promise<boolean> {
    const result = await this.db.query.clinics.findFirst({
      where: (c, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(c.id, filters.id));
        if (filters.slug) conditions.push(eq(c.slug, filters.slug));
        if (filters.email) conditions.push(eq(c.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(c.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      columns: { id: true },
    });

    return !!result;
  }

  async create(values: typeof clinics.$inferInsert) {
    const [newClinic] = await this.db
      .insert(clinics)
      .values(values)
      .returning();

    return newClinic;
  }
}
