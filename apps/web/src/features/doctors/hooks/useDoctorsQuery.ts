import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsService } from '@/features/doctors/services/doctors.service';
import type {
  GetDoctorsParams,
  CreateDoctorDTO,
  UpdateDoctorDTO,
} from '@/features/doctors/types';

export const DOCTOR_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_KEYS.all, 'list'] as const,
  list: (params?: GetDoctorsParams) =>
    [...DOCTOR_KEYS.lists(), params] as const,
  detail: (id: string) => [...DOCTOR_KEYS.all, id] as const,
};

export function useDoctorsQuery(params?: GetDoctorsParams) {
  return useQuery({
    queryKey: DOCTOR_KEYS.list(params),
    queryFn: () => doctorsService.getAll(params),
  });
}

export function useQueryDoctor(id: string) {
  return useQuery({
    queryKey: DOCTOR_KEYS.detail(id),
    queryFn: () => doctorsService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDoctorDTO) => doctorsService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() }),
  });
}

export function useMutationUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDoctorDTO }) =>
      doctorsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.detail(id) });
    },
  });
}

export function useMutationDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorsService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.lists() }),
  });
}
