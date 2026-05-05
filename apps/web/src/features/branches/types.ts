import type { Row } from '@tanstack/react-table';

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
  slug: string;
  address: string;
  email?: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  color?: string;
  settings?: Record<string, unknown>;
}

export interface UpdateBranchDTO {
  name?: string;
  slug?: string;
  address?: string;
  email?: string;
  phone?: string;
  latitude?: string;
  longitude?: string;
  color?: string;
  settings?: Record<string, unknown>;
}

export interface BranchesTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (branch: Branch) => void;
  onDeactivate: (branch: Branch) => void;
}

export interface BranchActionsCellProps {
  row: Row<Branch>;
  handlers: BranchesTableHandlers;
}
