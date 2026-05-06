import type { Row } from '@tanstack/react-table';

export interface Receptionist {
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

export interface GetReceptionistsParams {
  page?: number;
  limit?: number;
  clinicId?: string;
  userId?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface CreateReceptionistDTO {
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
}

export interface UpdateReceptionistDTO extends Partial<Omit<CreateReceptionistDTO, 'userId'>> {
  isActive?: boolean;
}

export interface ReceptionistsTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (receptionist: Receptionist) => void;
  onDelete: (receptionist: Receptionist) => void;
}

export interface ReceptionistActionsCellProps {
  row: Row<Receptionist>;
  handlers: ReceptionistsTableHandlers;
}
