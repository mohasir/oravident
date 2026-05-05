import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { Patient, GetPatientsParams, CreatePatientDTO, UpdatePatientDTO } from '../types';

export const patientsService = {
  getAll: (params?: GetPatientsParams) =>
    PROTECTED_API.get<PaginatedResponse<Patient>>('/patients', { params }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Patient>>(`/patients/${id}`).then((r) => r.data),

  create: (data: CreatePatientDTO) =>
    PROTECTED_API.post<ApiResponse<Patient>>('/patients', data).then((r) => r.data),

  update: (id: string, data: UpdatePatientDTO) =>
    PROTECTED_API.patch<ApiResponse<Patient>>(`/patients/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    PROTECTED_API.delete(`/patients/${id}`),
};
