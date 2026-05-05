import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { Branch, GetBranchesParams, CreateBranchDTO, UpdateBranchDTO } from '../types';

export const branchesService = {
  getAll: (params?: GetBranchesParams) =>
    PROTECTED_API.get<PaginatedResponse<Branch>>('/branches', { params }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Branch>>(`/branches/${id}`).then((r) => r.data),

  create: (data: CreateBranchDTO) =>
    PROTECTED_API.post<ApiResponse<Branch>>('/branches', data).then((r) => r.data),

  update: (id: string, data: UpdateBranchDTO) =>
    PROTECTED_API.patch<ApiResponse<Branch>>(`/branches/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    PROTECTED_API.delete(`/branches/${id}`),
};
