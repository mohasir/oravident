import type { PermissionType } from '../core/permissions';

export function usePermissions() {
  const { data: session, status } = {} as any;
  const isLoading = status === 'loading';

  return {
    roles: session?.user?.roles ?? [],
    permissions: session?.user?.permissions ?? ([] as PermissionType[]),
    isSuperadmin: session?.user?.isSuperadmin ?? false,
    isLoading,
  };
}
