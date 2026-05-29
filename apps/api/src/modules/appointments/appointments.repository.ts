import {
  and,
  count,
  eq,
  getTableColumns,
  gt,
  gte,
  isNull,
  lt,
  lte,
  ne,
  or,
  SQL,
} from 'drizzle-orm';
import { Database } from '@core/db/index.ts';
import {
  appointments,
  AppointmentInsert,
  AppointmentSelect,
  AppointmentUpdate,
} from '@core/db/schema/appointments.ts';
import { patients } from '@core/db/schema/patients.ts';
import { workers } from '@core/db/schema/workers.ts';
import { services } from '@core/db/schema/services.ts';
import { appointmentStatuses } from '@core/db/schema/appointment_statuses.ts';
import { AppointmentFiltersDTO } from '@modules/appointments/appointments.schema.ts';
import { branches } from '@/core/db/schema/branches.ts';
import { clinics } from '@/core/db/schema/clinics.ts';

export class AppointmentsRepository {
  constructor(private readonly db: Database) {}

  private getBaseSelect() {
    return this.db
      .select({
        appointment: appointments,
        clinic: clinics,
        branch: branches,
        patient: patients,
        worker: workers,
        service: services,
        status: appointmentStatuses,
      })
      .from(appointments)
      .leftJoin(clinics, eq(appointments.clinicId, clinics.id))
      .leftJoin(branches, eq(appointments.branchId, branches.id))
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(workers, eq(appointments.workerId, workers.id))
      .leftJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(
        appointmentStatuses,
        eq(appointments.statusId, appointmentStatuses.id),
      );
  }

  private applyFilters(filters: AppointmentFiltersDTO) {
    const { startDate, endDate, ...rest } = filters;
    const conditions: SQL[] = [];
    const columns = getTableColumns(appointments);

    const clinicId = filters?.clinicId;

    if (clinicId) {
      conditions.push(eq(appointments.clinicId, clinicId));
    }

    for (const key in rest) {
      const value = rest[key as keyof typeof rest];
      if (value === undefined) continue;

      const column = columns[key as keyof typeof columns];
      if (!column) continue;

      if (value === null) {
        conditions.push(isNull(column));
      } else {
        conditions.push(eq(column, value));
      }
    }

    if (rest.isActive === undefined) {
      conditions.push(eq(appointments.isActive, true));
    }

    if (startDate) {
      conditions.push(gte(appointments.startsAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(appointments.startsAt, new Date(endDate)));
    }

    return conditions;
  }

  async findOne(filters: AppointmentFiltersDTO) {
    const conditions = this.applyFilters(filters);
    const [result] = await this.getBaseSelect()
      .where(and(...conditions))
      .limit(1);

    return result || null;
  }

  async findAll(
    filters: AppointmentFiltersDTO,
    pagination?: { page?: number; limit?: number },
  ) {
    const conditions = this.applyFilters(filters);

    const dataQuery = this.getBaseSelect()
      .where(and(...conditions))
      .orderBy(appointments.startsAt)
      .$dynamic();

    if (pagination?.page && pagination?.limit) {
      dataQuery
        .limit(pagination.limit)
        .offset((pagination.page - 1) * pagination.limit);
    }

    const countQuery = this.db
      .select({ count: count() })
      .from(appointments)
      .where(and(...conditions));

    const [data, [totalResult]] = await Promise.all([dataQuery, countQuery]);

    return {
      data,
      total: Number(totalResult?.count ?? 0),
    };
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

    return this.db
      .select()
      .from(appointments)
      .where(and(...conditions)) as unknown as Promise<AppointmentSelect[]>;
  }

  async delete(id: string): Promise<boolean> {
    const [deletedAppointment] = await this.db
      .update(appointments)
      .set({ isActive: false })
      .where(eq(appointments.id, id))
      .returning();
    return !!deletedAppointment;
  }

  async findStatuses() {
    return this.db.select().from(appointmentStatuses);
  }
}
