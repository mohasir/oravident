import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type {
  Receptionist,
  GetReceptionistsParams,
  CreateReceptionistDTO,
  UpdateReceptionistDTO,
} from '@/features/receptionists/types';

export const receptionistsService = {
  getAll: (params?: GetReceptionistsParams) =>
    PROTECTED_API.get<PaginatedResponse<Receptionist>>('/receptionists', {
      params,
    }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Receptionist>>(`/receptionists/${id}`).then(
      (r) => r.data,
    ),

  create: (data: CreateReceptionistDTO) =>
    PROTECTED_API.post<ApiResponse<Receptionist>>('/receptionists', data).then(
      (r) => r.data,
    ),

  update: (id: string, data: UpdateReceptionistDTO) =>
    PROTECTED_API.patch<ApiResponse<Receptionist>>(
      `/receptionists/${id}`,
      data,
    ).then((r) => r.data),

  delete: (id: string) => PROTECTED_API.delete(`/receptionists/${id}`),
};
