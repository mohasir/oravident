import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesService } from '@/features/services/services/services.service';
import type {
  GetServicesParams,
  CreateServiceDTO,
  UpdateServiceDTO,
} from '@/features/services/types';

export const SERVICE_KEYS = {
  all: ['services'] as const,
  lists: () => [...SERVICE_KEYS.all, 'list'] as const,
  list: (params?: GetServicesParams) =>
    [...SERVICE_KEYS.lists(), params] as const,
  detail: (id: string) => [...SERVICE_KEYS.all, id] as const,
};

export function useServicesQuery(params?: GetServicesParams) {
  return useQuery({
    queryKey: SERVICE_KEYS.list(params),
    queryFn: () => servicesService.getAll(params),
  });
}

export function useQueryService(id: string) {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(id),
    queryFn: () => servicesService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceDTO) => servicesService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() }),
  });
}

export function useMutationUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceDTO }) =>
      servicesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.detail(id) });
    },
  });
}

export function useMutationDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.lists() }),
  });
}
