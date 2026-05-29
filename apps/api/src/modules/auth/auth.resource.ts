import { formatDate } from '@common/utils/date.ts';

type MeData = {
  id: string;
  email: string;
  isPlatformAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  worker: {
    id: string;
    clinicId: string;
    firstName: string;
    secondName: string | null;
    lastName: string;
    secondLastName: string | null;
    phone: string;
    dateOfBirth: string | null;
    gender: string;
    prefix: string | null;
    specialty: string | null;
    idNumber: string | null;
    licenseNumber: string | null;
    calendarColor: string | null;
    contractType: string | null;
  } | null;
  clinic: {
    id: string;
    name: string;
    slug: string;
    email: string;
    phone: string | null;
    logoUrl: string | null;
    timeZone: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  role: {
    id: string;
    name: string;
    displayName: string | null;
  } | null;
};

const buildFullName = (worker: NonNullable<MeData['worker']>): string => {
  return [
    worker.prefix,
    worker.firstName,
    worker.secondName,
    worker.lastName,
    worker.secondLastName,
  ]
    .filter(Boolean)
    .join(' ');
};

export const meResource = (data: MeData) => ({
  id: data.id,
  email: data.email,
  isPlatformAdmin: data.isPlatformAdmin,
  isActive: data.isActive,
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
  worker: data.worker
    ? {
        id: data.worker.id,
        clinicId: data.worker.clinicId,
        fullName: buildFullName(data.worker),
        firstName: data.worker.firstName,
        secondName: data.worker.secondName,
        lastName: data.worker.lastName,
        secondLastName: data.worker.secondLastName,
        phone: data.worker.phone,
        dateOfBirth: data.worker.dateOfBirth,
        gender: data.worker.gender,
        prefix: data.worker.prefix,
        specialty: data.worker.specialty,
        idNumber: data.worker.idNumber,
        licenseNumber: data.worker.licenseNumber,
        calendarColor: data.worker.calendarColor,
        contractType: data.worker.contractType,
      }
    : null,
  clinic: data.clinic
    ? {
        id: data.clinic.id,
        name: data.clinic.name,
        slug: data.clinic.slug,
        email: data.clinic.email,
        phone: data.clinic.phone,
        logoUrl: data.clinic.logoUrl,
        timeZone: data.clinic.timeZone,
        createdAt: data.clinic.createdAt,
        updatedAt: data.clinic.updatedAt,
      }
    : null,
  role: data.role
    ? {
        id: data.role.id,
        name: data.role.name,
        displayName: data.role.displayName,
      }
    : null,
});
