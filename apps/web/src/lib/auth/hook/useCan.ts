import { usePermissions } from './usePermissions';
import type { PermissionType, RoleType } from '@repo/guards';

export function useCan() {
  const { roles, permissions, isSuperadmin, isLoading } = usePermissions();

  const resolveAccess = (fn: () => boolean) => {
    if (isLoading) return false;
    if (isSuperadmin) return true;
    return fn();
  };

  const can = (required: PermissionType[]): boolean => {
    return resolveAccess(
      () => !required.length || required.some((p) => permissions.includes(p)),
    );
  };

  const canAll = (required: PermissionType[]): boolean => {
    return resolveAccess(
      () => !required.length || required.every((p) => permissions.includes(p)),
    );
  };

  const hasRole = (required: RoleType[]): boolean => {
    return resolveAccess(
      () => !required.length || required.some((r) => roles.includes(r)),
    );
  };

  const canWithRole = (
    required: PermissionType[],
    requiredRoles: RoleType[],
  ): boolean => {
    return resolveAccess(() => can(required) && hasRole(requiredRoles));
  };

  return { can, canAll, hasRole, canWithRole, isSuperadmin, isLoading };
}
