import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receptionistsService } from '@/features/receptionists/services/receptionists.service';
import type {
  GetReceptionistsParams,
  CreateReceptionistDTO,
  UpdateReceptionistDTO,
} from '@/features/receptionists/types';

export const RECEPTIONIST_KEYS = {
  all: ['receptionists'] as const,
  lists: () => [...RECEPTIONIST_KEYS.all, 'list'] as const,
  list: (params?: GetReceptionistsParams) =>
    [...RECEPTIONIST_KEYS.lists(), params] as const,
  detail: (id: string) => [...RECEPTIONIST_KEYS.all, id] as const,
};

export function useReceptionistsQuery(params?: GetReceptionistsParams) {
  return useQuery({
    queryKey: RECEPTIONIST_KEYS.list(params),
    queryFn: () => receptionistsService.getAll(params),
  });
}

export function useQueryReceptionist(id: string) {
  return useQuery({
    queryKey: RECEPTIONIST_KEYS.detail(id),
    queryFn: () => receptionistsService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreateReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReceptionistDTO) => receptionistsService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: RECEPTIONIST_KEYS.lists() }),
  });
}

export function useMutationUpdateReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReceptionistDTO }) =>
      receptionistsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: RECEPTIONIST_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: RECEPTIONIST_KEYS.detail(id) });
    },
  });
}

export function useMutationDeleteReceptionist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => receptionistsService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: RECEPTIONIST_KEYS.lists() }),
  });
}
