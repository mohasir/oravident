import type { Row } from '@tanstack/react-table';

export interface Doctor {
  id: string;
  clinicId: string;
  fullName: string;
  firstName: string;
  secondName: string | null;
  lastName: string;
  secondLastName: string | null;
  phone: string;
  dateOfBirth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idNumber: string | null;
  calendarColor: string | null;
  contractType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN' | null;
  prefix: string | null;
  specialty: string | null;
  licenseNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  role?: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  clinicId?: string;
  userId?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface CreateDoctorDTO {
  userId: string;
  firstName: string;
  secondName?: string;
  lastName: string;
  secondLastName?: string;
  phone: string;
  dateOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idNumber?: string;
  calendarColor?: string;
  contractType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  prefix?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface UpdateDoctorDTO extends Partial<Omit<CreateDoctorDTO, 'userId'>> {
  isActive?: boolean;
}

export interface DoctorsTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export interface DoctorActionsCellProps {
  row: Row<Doctor>;
  handlers: DoctorsTableHandlers;
}
