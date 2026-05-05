import type { Row } from '@tanstack/react-table';

export interface Patient {
  id: string;
  clinicId: string;
  primaryBranchId: string | null;
  firstName: string;
  secondName: string | null;
  lastName: string;
  secondLastName: string | null;
  idNumber: string | null;
  email: string | null;
  phone: string;
  dateOfBirth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  address: string | null;
  medicalNotes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetPatientsParams {
  page?: number;
  limit?: number;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreatePatientDTO {
  primaryBranchId?: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  idNumber?: string;
  email?: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  medicalNotes?: string;
}

export interface UpdatePatientDTO {
  primaryBranchId?: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  secondLastName?: string;
  idNumber?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  medicalNotes?: string;
  isActive?: boolean;
}

export interface PatientsTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export interface PatientActionsCellProps {
  row: Row<Patient>;
  handlers: PatientsTableHandlers;
}
