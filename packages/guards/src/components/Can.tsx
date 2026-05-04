import type { ReactNode } from 'react';
import { useCan } from '../hooks/useCan';
import type { PermissionCode } from '../data/permissions';
import type { RoleType } from '../data/roles';

interface CanProps {
  allowed?:     PermissionCode[];
  allRequired?: PermissionCode[];
  roles?:       RoleType[];
  fallback?:    ReactNode;
  children:     ReactNode;
}

export function Can({
  allowed,
  allRequired,
  roles,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAll, hasRole, canWithRole, isLoading } = useCan();

  if (isLoading) return null;

  const hasAccess = (): boolean => {
    if (allRequired?.length)              return canAll(allRequired);
    if (allowed?.length && roles?.length) return canWithRole(allowed, roles);
    if (allowed?.length)                  return can(allowed);
    if (roles?.length)                    return hasRole(roles);
    return true;
  };

  return <>{hasAccess() ? children : fallback}</>;
}
