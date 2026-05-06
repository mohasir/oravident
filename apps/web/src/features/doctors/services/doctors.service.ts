import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type {
  Doctor,
  GetDoctorsParams,
  CreateDoctorDTO,
  UpdateDoctorDTO,
} from '@/features/doctors/types';

export const doctorsService = {
  getAll: (params?: GetDoctorsParams) =>
    PROTECTED_API.get<PaginatedResponse<Doctor>>('/doctors', { params }).then(
      (r) => r.data,
    ),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Doctor>>(`/doctors/${id}`).then(
      (r) => r.data,
    ),

  create: (data: CreateDoctorDTO) =>
    PROTECTED_API.post<ApiResponse<Doctor>>('/doctors', data).then(
      (r) => r.data,
    ),

  update: (id: string, data: UpdateDoctorDTO) =>
    PROTECTED_API.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data).then(
      (r) => r.data,
    ),

  delete: (id: string) => PROTECTED_API.delete(`/doctors/${id}`),
};
