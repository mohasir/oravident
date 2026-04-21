import { PatientSelect } from '@core/db/schema/patients.ts';
import { formatDate, formatDateOnly } from '@common/utils/date.ts';

export type Select = PatientSelect;

export const patientResource = (patient: Select) => {
  return {
    id: patient.id,
    clinicId: patient.clinicId,
    primaryBranchId: patient.primaryBranchId,
    firstName: patient.firstName,
    secondName: patient.secondName,
    lastName: patient.lastName,
    secondLastName: patient.secondLastName,
    idNumber: patient.idNumber,
    email: patient.email,
    phone: patient.phone,
    dateOfBirth: formatDateOnly(patient.dateOfBirth),
    gender: patient.gender,
    address: patient.address,
    medicalNotes: patient.medicalNotes,
    totalAppointments: patient.totalAppointments,
    lastAppointmentAt: formatDate(patient.lastAppointmentAt),
    isActive: patient.isActive,
    createdAt: formatDate(patient.createdAt),
    updatedAt: formatDate(patient.updatedAt),
  };
};

export const patientCollectionResource = (patients: Select[]) => {
  return patients.map(patientResource);
};
