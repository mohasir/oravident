import { PROTECTED_API } from '@/lib/http/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/http/types';
import type {
  Appointment,
  AppointmentStatus,
  GetAppointmentsParams,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../types';

export const appointmentsService = {
  async getAll(
    params?: GetAppointmentsParams,
  ): Promise<PaginatedResponse<Appointment>> {
    const response = await PROTECTED_API.get<PaginatedResponse<Appointment>>(
      '/appointments',
      {
        params,
      },
    );

    return response.data;
  },

  getById: (id: string) =>
    PROTECTED_API.get<ApiResponse<Appointment>>(`/appointments/${id}`).then(
      (response) => response.data,
    ),

  create: (data: CreateAppointmentDTO) =>
    PROTECTED_API.post<ApiResponse<Appointment>>('/appointments', data).then(
      (response) => response.data,
    ),

  update: (id: string, data: UpdateAppointmentDTO) =>
    PROTECTED_API.patch<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      data,
    ).then((r) => r.data),

  delete: (id: string) => PROTECTED_API.delete(`/appointments/${id}`),

  getStatuses: () =>
    PROTECTED_API.get<ApiResponse<AppointmentStatus[]>>('/appointments/statuses').then(
      (r) => r.data,
    ),
};
