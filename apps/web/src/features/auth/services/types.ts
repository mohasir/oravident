import type { PermissionType } from '@repo/guards';

export interface MeWorker {
  id: string;
  clinicId: string;
  fullName: string;
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
}

export interface MeRole {
  id: string;
  name: string;
  displayName: string | null;
}

export interface MeClinic {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeProfile {
  id: string;
  email: string;
  isPlatformAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  worker: MeWorker | null;
  role: MeRole | null;
  clinic: MeClinic | null;
}

export interface LoginResponse {
  accessToken: string;
}

export interface AuthSession extends MeProfile {
  permissions: PermissionType[];
  tenantId?: string;
}

export type UpdateProfileDTO = Partial<
  Pick<
    MeWorker,
    | 'firstName'
    | 'secondName'
    | 'lastName'
    | 'secondLastName'
    | 'phone'
    | 'prefix'
    | 'specialty'
    | 'calendarColor'
  >
>;
