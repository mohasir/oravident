import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '../services/appointments.service';
import type {
  GetAppointmentsParams,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../types';

export const APPOINTMENT_KEYS = {
  all: ['appointments'] as const,
  lists: () => [...APPOINTMENT_KEYS.all, 'list'] as const,
  list: (params?: GetAppointmentsParams) =>
    [...APPOINTMENT_KEYS.lists(), params] as const,
  detail: (id: string) => [...APPOINTMENT_KEYS.all, id] as const,
  statuses: () => [...APPOINTMENT_KEYS.all, 'statuses'] as const,
};

export function useAppointmentsQuery(params?: GetAppointmentsParams) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.list(params),
    queryFn: () => appointmentsService.getAll(params),
  });
}

export function useQueryAppointment(id: string) {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.detail(id),
    queryFn: () => appointmentsService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentDTO) => appointmentsService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() }),
  });
}

export function useMutationUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentDTO }) =>
      appointmentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.detail(id) });
    },
  });
}

export function useMutationDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.lists() }),
  });
}

export function useAppointmentStatusesQuery() {
  return useQuery({
    queryKey: APPOINTMENT_KEYS.statuses(),
    queryFn: () => appointmentsService.getStatuses(),
  });
}
