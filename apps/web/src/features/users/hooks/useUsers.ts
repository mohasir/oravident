import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/features/users/services/users.service';
import type { GetUsersParams, CreateUserDTO, UpdateUserDTO } from '@/features/users/types';

export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (params?: GetUsersParams) => [...USER_KEYS.lists(), params] as const,
  detail: (id: string) => [...USER_KEYS.all, id] as const,
};

export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: USER_KEYS.list(params),
    queryFn: () => usersService.getAll(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDTO) => usersService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      usersService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() }),
  });
}
