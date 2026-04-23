import { and, eq, gt, gte, isNull, lt, lte, ne, or, SQL } from 'drizzle-orm';
import { PgSelect } from 'drizzle-orm/pg-core';
import { Database } from '@core/db/index.ts';
import {
  appointments,
  AppointmentInsert,
  AppointmentSelect,
  AppointmentUpdate,
  AppointmentTable,
} from '@core/db/schema/appointments.ts';
import { BaseRepository } from '@core/shared/BaseRepository.ts';
import { AppointmentFiltersDTO } from '@modules/appointments/appointments.schema.ts';

export class AppointmentsRepository extends BaseRepository<
  AppointmentTable,
  AppointmentFiltersDTO
> {
  constructor(db: Database) {
    super(db, appointments);
  }

  async create(
    data: AppointmentInsert,
  ): Promise<AppointmentSelect | undefined> {
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

  async findOverlapping(params: {
    startsAt: Date;
    endsAt: Date;
    workerId?: string;
    patientId?: string;
    excludeId?: string;
  }) {
    const { startsAt, endsAt, workerId, patientId, excludeId } = params;

    const conditions: SQL[] = [
      eq(appointments.isActive, true),
      isNull(appointments.cancelledAt),
      lt(appointments.startsAt, endsAt),
      gt(appointments.endsAt, startsAt),
    ];

    const identityConditions: SQL[] = [];

    if (workerId) {
      identityConditions.push(eq(appointments.workerId, workerId));
    }

    if (patientId) {
      identityConditions.push(eq(appointments.patientId, patientId));
    }

    if (identityConditions.length > 0) {
      conditions.push(or(...identityConditions)!);
    }

    if (excludeId) {
      conditions.push(ne(appointments.id, excludeId));
    }

    return this.select().where(and(...conditions)) as unknown as Promise<
      AppointmentSelect[]
    >;
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
