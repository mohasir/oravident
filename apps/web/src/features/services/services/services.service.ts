import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { Service, GetServicesParams, CreateServiceDTO, UpdateServiceDTO } from '../types';

export const servicesService = {
  getAll: (params?: GetServicesParams) =>
    PROTECTED_API.get<PaginatedResponse<Service>>('/services', { params }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Service>>(`/services/${id}`).then((r) => r.data),

  create: (data: CreateServiceDTO) =>
    PROTECTED_API.post<ApiResponse<Service>>('/services', data).then((r) => r.data),

  update: (id: string, data: UpdateServiceDTO) =>
    PROTECTED_API.patch<ApiResponse<Service>>(`/services/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    PROTECTED_API.delete(`/services/${id}`),
};
