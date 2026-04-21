import { gte, lte } from 'drizzle-orm';
import { PgSelect } from 'drizzle-orm/pg-core';
import { Database } from '@core/db/index.ts';
import {
  appointments,
  AppointmentInsert,
  AppointmentSelect,
  AppointmentUpdate,
  AppointmentTable,
} from '@core/db/schema/appointments.ts';
import { eq } from 'drizzle-orm';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { AppointmentFiltersDTO } from '@modules/appointments/appointments.schema.ts';

export class AppointmentsRepository extends BaseRepository<
  AppointmentTable,
  AppointmentFiltersDTO
> {
  constructor(db: Database) {
    super(db, appointments);
  }

  async create(data: AppointmentInsert): Promise<AppointmentSelect | undefined> {
    const [newAppointment] = await this.db
      .insert(appointments)
      .values(data)
      .returning();
    return newAppointment;
  }

  async update(id: string, values: AppointmentUpdate) {
    const [updatedAppointment] = await this.db
      .update(appointments)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async delete(id: string): Promise<boolean> {
    const [deletedAppointment] = await this.db
      .update(appointments)
      .set({ isActive: false })
      .where(eq(appointments.id, id))
      .returning();
    return !!deletedAppointment;
  }

  protected override applyFilters<T extends PgSelect>(
    qb: T,
    filters: AppointmentFiltersDTO,
  ) {
    const { startDate, endDate, ...rest } = filters;

    super.applyFilters(qb, rest);

    if (startDate) {
      qb.where(gte(appointments.startsAt, new Date(startDate)));
    }
    if (endDate) {
      qb.where(lte(appointments.startsAt, new Date(endDate)));
    }

    return qb;
  }
}
