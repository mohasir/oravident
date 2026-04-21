import { RoleSelect } from '@/core/db/schema/roles.ts';
import { formatDate } from '@common/utils/date.ts';

export type Role = RoleSelect;

export const roleResource = (role: Role) => {
  return {
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    clinicId: role.clinicId,
    isSystem: role.isSystem,
    isActive: role.isActive,
    createdAt: formatDate(role.createdAt),
  };
};

export const roleCollectionResource = (roles: Role[]) => {
  return roles.map(roleResource);
};
