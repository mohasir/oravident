import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsService } from '@/features/patients/services/patients.service';
import type {
  GetPatientsParams,
  CreatePatientDTO,
  UpdatePatientDTO,
} from '@/features/patients/types';

export const PATIENT_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_KEYS.all, 'list'] as const,
  list: (params?: GetPatientsParams) =>
    [...PATIENT_KEYS.lists(), params] as const,
  detail: (id: string) => [...PATIENT_KEYS.all, id] as const,
};

export function usePatientsQuery(params?: GetPatientsParams) {
  return useQuery({
    queryKey: PATIENT_KEYS.list(params),
    queryFn: () => patientsService.getAll(params),
  });
}

export function useQueryPatient(id: string) {
  return useQuery({
    queryKey: PATIENT_KEYS.detail(id),
    queryFn: () => patientsService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientDTO) => patientsService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() }),
  });
}

export function useMutationUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientDTO }) =>
      patientsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.detail(id) });
    },
  });
}

export function useMutationDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientsService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PATIENT_KEYS.lists() }),
  });
}
