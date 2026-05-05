import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { User, GetUsersParams, CreateUserDTO, UpdateUserDTO } from '../types';

export const usersService = {
  getAll: (params?: GetUsersParams) =>
    PROTECTED_API.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data),

  create: (data: CreateUserDTO) =>
    PROTECTED_API.post<ApiResponse<User>>('/users', data).then((r) => r.data),

  update: (id: string, data: UpdateUserDTO) =>
    PROTECTED_API.patch<ApiResponse<User>>(`/users/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    PROTECTED_API.delete(`/users/${id}`),
};
