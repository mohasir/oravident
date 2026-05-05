import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesService } from '@/features/branches/services/branches.service';
import type {
  GetBranchesParams,
  CreateBranchDTO,
  UpdateBranchDTO,
} from '@/features/branches/types';

export const BRANCH_KEYS = {
  all: ['branches'] as const,
  lists: () => [...BRANCH_KEYS.all, 'list'] as const,
  list: (params?: GetBranchesParams) =>
    [...BRANCH_KEYS.lists(), params] as const,
  detail: (id: string) => [...BRANCH_KEYS.all, id] as const,
};

export function useBranchesQuery(params?: GetBranchesParams) {
  return useQuery({
    queryKey: BRANCH_KEYS.list(params),
    queryFn: () => branchesService.getAll(params),
  });
}

export function useQueryBranch(id: string) {
  return useQuery({
    queryKey: BRANCH_KEYS.detail(id),
    queryFn: () => branchesService.getById(id),
    enabled: !!id,
  });
}

export function useMutationCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchDTO) => branchesService.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.lists() }),
  });
}

export function useMutationUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchDTO }) =>
      branchesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.detail(id) });
    },
  });
}

export function useMutationDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchesService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.lists() }),
  });
}
