import { roles } from '@/core/db/schema/roles.ts';

export type Role = typeof roles.$inferSelect;

export const roleResource = (role: Role) => {
  return {
    id: role.id,
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    clinicId: role.clinicId,
    isSystem: role.isSystem,
    isActive: role.isActive,
    createdAt: role.createdAt,
  };
};

export const roleCollectionResource = (roles: Role[]) => {
  return roles.map(roleResource);
};
