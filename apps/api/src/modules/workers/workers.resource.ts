import { WorkerSelect } from '@/core/db/schema/workers.ts';
import { formatDate, formatDateOnly } from '@common/utils/date.ts';

export type Worker = WorkerSelect;

export const workerResource = (worker: Worker) => {
  return {
    id: worker.id,
    clinicId: worker.clinicId,
    userId: worker.userId,
    roleId: worker.roleId,
    firstName: worker.firstName,
    secondName: worker.secondName,
    lastName: worker.lastName,
    secondLastName: worker.secondLastName,
    phone: worker.phone,
    dateOfBirth: formatDateOnly(worker.dateOfBirth),
    gender: worker.gender,
    prefix: worker.prefix,
    specialty: worker.specialty,
    idNumber: worker.idNumber,
    licenseNumber: worker.licenseNumber,
    calendarColor: worker.calendarColor,
    contractType: worker.contractType,
    isActive: worker.isActive,
    createdAt: formatDate(worker.createdAt),
  };
};

export const workerCollectionResource = (workers: Worker[]) => {
  return workers.map(workerResource);
};
