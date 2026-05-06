import type { Row } from '@tanstack/react-table';

export interface BranchSchedule {
  id: string;
  dayOfWeek: number;
  dayName: string;
  openTime: string;
  closeTime: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  clinicId: string;
  name: string;
  slug: string;
  address: string;
  email: string | null;
  phone: string | null;
  latitude: string | null;
  longitude: string | null;
  settings: Record<string, unknown> | null;
  isActive: boolean;
  color: string | null;
  createdAt: string;
  schedules: BranchSchedule[];
}

export interface GetBranchesParams {
  page?: number;
  limit?: number;
  name?: string;
  slug?: string;
  email?: string;
  isActive?: boolean;
}

export interface CreateBranchDTO {
  name: string;
  address: string;
  email?: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  color?: string;
  settings?: Record<string, unknown>;
  schedules?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
}

export interface UpdateBranchDTO {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  color?: string;
  settings?: Record<string, unknown>;
  schedules?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
}

export interface BranchesTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (branch: Branch) => void;
  onDeactivate: (branch: Branch) => void;
  onViewSchedule: (branch: Branch) => void;
}

export interface BranchActionsCellProps {
  row: Row<Branch>;
  handlers: BranchesTableHandlers;
}
