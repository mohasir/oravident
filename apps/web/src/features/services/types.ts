import type { Row } from '@tanstack/react-table';

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetServicesParams {
  page?: number;
  limit?: number;
  clinicId?: string;
  name?: string;
  isActive?: boolean;
}

export interface CreateServiceDTO {
  name: string;
  description?: string;
  durationMinutes: number;
  price?: string;
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: string;
  isActive?: boolean;
}

export interface ServicesTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (service: Service) => void;
  onDeactivate: (service: Service) => void;
}

export interface ServiceActionsCellProps {
  row: Row<Service>;
  handlers: ServicesTableHandlers;
}
