import { WorkerSelect } from '@/core/db/schema/workers.ts';
import { formatDate, formatDateOnly } from '@common/utils/date.ts';

export type Worker = WorkerSelect & {
  user?: {
    id: string;
    email: string;
  };
  role?: {
    id: string;
    name: string;
    displayName: string;
  };
};

export const workerResource = (worker: Worker) => {
  const fullNameParts = [
    worker.prefix,
    worker.firstName,
    worker.secondName,
    worker.lastName,
    worker.secondLastName,
  ].filter(Boolean);

  return {
    id: worker.id,
    clinicId: worker.clinicId,
    fullName: fullNameParts.join(' '),
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
    user: worker.user
      ? {
          id: worker.user.id,
          email: worker.user.email,
        }
      : null,
    role: worker.role
      ? {
          id: worker.role.id,
          name: worker.role.name,
          displayName: worker.role.displayName,
        }
      : null,
    createdAt: formatDate(worker.createdAt),
  };
};

export const workerCollectionResource = (workers: Worker[]) => {
  return workers.map(workerResource);
};
