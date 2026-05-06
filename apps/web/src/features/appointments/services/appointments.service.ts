import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type { Appointment, GetAppointmentsParams, CreateAppointmentDTO, UpdateAppointmentDTO } from '../types';

export const appointmentsService = {
  getAll: (params?: GetAppointmentsParams) =>
    PROTECTED_API.get<PaginatedResponse<Appointment>>('/appointments', { params }).then((r) => r.data),

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Appointment>>(`/appointments/${id}`).then((r) => r.data),

  create: (data: CreateAppointmentDTO) =>
    PROTECTED_API.post<ApiResponse<Appointment>>('/appointments', data).then((r) => r.data),

  update: (id: string, data: UpdateAppointmentDTO) =>
    PROTECTED_API.patch<ApiResponse<Appointment>>(`/appointments/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    PROTECTED_API.delete(`/appointments/${id}`),
};
