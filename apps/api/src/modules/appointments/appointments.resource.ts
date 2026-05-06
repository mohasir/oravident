import { AppointmentSelect } from '@core/db/schema/appointments.ts';
import { PatientSelect } from '@core/db/schema/patients.ts';
import { WorkerSelect } from '@core/db/schema/workers.ts';
import { ServiceSelect } from '@core/db/schema/services.ts';
import { AppointmentStatusSelect } from '@core/db/schema/appointment_statuses.ts';
import { formatDate } from '@common/utils/date.ts';

export type Select = AppointmentSelect;

export interface AppointmentJoined {
  appointment: AppointmentSelect;
  patient: PatientSelect | null;
  worker: WorkerSelect | null;
  service: ServiceSelect | null;
  status: AppointmentStatusSelect | null;
}

export const appointmentResource = (appointment: Select) => {
  return {
    id: appointment.id,
    clinicId: appointment.clinicId,
    branchId: appointment.branchId,
    patientId: appointment.patientId,
    workerId: appointment.workerId,
    serviceId: appointment.serviceId,
    statusId: appointment.statusId,
    startsAt: formatDate(appointment.startsAt),
    endsAt: formatDate(appointment.endsAt),
    notes: appointment.notes,
    price: appointment.price,
    discountAmount: appointment.discountAmount,
    taxAmount: appointment.taxAmount,
    cancelledAt: formatDate(appointment.cancelledAt),
    cancelledBy: appointment.cancelledBy,
    cancelReason: appointment.cancelReason,
    createdBy: appointment.createdBy,
    version: appointment.version,
    isActive: appointment.isActive,
    createdAt: formatDate(appointment.createdAt),
    updatedAt: formatDate(appointment.updatedAt),
  };
};

const formatFullName = (data: { firstName: string; secondName?: string | null; lastName: string; secondLastName?: string | null } | null) => {
  if (!data) return null;
  return [data.firstName, data.secondName, data.lastName, data.secondLastName]
    .filter(Boolean)
    .join(' ');
};

export const appointmentWithRelationsResource = (data: AppointmentJoined) => {
  const { appointment, patient, worker, service, status } = data;
  return {
    ...appointmentResource(appointment),
    patient: patient ? {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      fullName: formatFullName(patient),
    } : null,
    worker: worker ? {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      fullName: formatFullName(worker),
      prefix: worker.prefix,
      specialty: worker.specialty,
    } : null,
    service: service ? {
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
    } : null,
    status: status ? {
      id: status.id,
      name: status.name,
      color: status.color,
    } : null,
  };
};

export const appointmentCollectionResource = (
  appointments: Select[],
) => {
  return appointments.map(appointmentResource);
};

export const appointmentWithRelationsCollectionResource = (
  data: AppointmentJoined[],
) => {
  return data.map(appointmentWithRelationsResource);
};
