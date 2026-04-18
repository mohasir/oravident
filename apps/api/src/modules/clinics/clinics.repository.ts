import { BaseRepository } from '@/core/shared/BaseRepository.ts';
import { Database } from '@core/db/index.ts';
import { clinics } from '@core/db/schema/clinics.ts';
import { ClinicFiltersDTO } from './clinics.schema.ts';
import { eq, and, sql } from 'drizzle-orm';

export class ClinicsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  async findOne(filters: ClinicFiltersDTO) {
    const result = await this.db.query.clinics.findFirst({
      where: (c, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(c.id, filters.id));
        if (filters.name) conditions.push(eq(c.name, filters.name));
        if (filters.slug) conditions.push(eq(c.slug, filters.slug));
        if (filters.email) conditions.push(eq(c.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(c.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
    });

    return result;
  }

  async exists(filters: ClinicFiltersDTO): Promise<boolean> {
    const result = await this.db.query.clinics.findFirst({
      where: (c, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(c.id, filters.id));
        if (filters.name) conditions.push(eq(c.name, filters.name));
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

  async findMany(
    filters: ClinicFiltersDTO = {},
    pagination?: { page: number; limit: number },
  ) {
    // 1. Get total count with filters
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(clinics)
      .where((c) => {
        const conditions = [];
        if (filters.id) conditions.push(eq(c.id, filters.id));
        if (filters.name) conditions.push(eq(c.name, filters.name));
        if (filters.slug) conditions.push(eq(c.slug, filters.slug));
        if (filters.email) conditions.push(eq(c.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(c.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      });

    const total = Number(countResult[0].count);

    // 2. Get paginated data
    const data = await this.db.query.clinics.findMany({
      where: (clinic, { eq, and }) => {
        const conditions = [];

        if (filters.id) conditions.push(eq(clinic.id, filters.id));
        if (filters.name) conditions.push(eq(clinic.name, filters.name));
        if (filters.slug) conditions.push(eq(clinic.slug, filters.slug));
        if (filters.email) conditions.push(eq(clinic.email, filters.email));
        if (filters.isActive !== undefined)
          conditions.push(eq(clinic.isActive, filters.isActive));

        return conditions.length > 0 ? and(...conditions) : undefined;
      },
      orderBy: (clinic, { desc }) => [desc(clinic.createdAt)],
      ...(pagination
        ? this.getPaginationConfig(pagination.page, pagination.limit)
        : {}),
    });

    return { data, total };
  }

  async create(values: typeof clinics.$inferInsert) {
    const [newClinic] = await this.db
      .insert(clinics)
      .values(values)
      .returning();

    return newClinic;
  }

  async update(id: string, values: Partial<typeof clinics.$inferInsert>) {
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
