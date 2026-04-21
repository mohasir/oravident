import { AppointmentSelect } from '@core/db/schema/appointments.ts';
import { formatDate } from '@common/utils/date.ts';

export type Select = AppointmentSelect;

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

export const appointmentCollectionResource = (
  appointments: Select[],
) => {
  return appointments.map(appointmentResource);
};
