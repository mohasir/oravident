export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
} as const;

export const ROLE_IDS = {
  [ROLES.SUPERADMIN]: 'd538dd40-0c5d-4e23-8bc1-7f858b621cef',
  [ROLES.ADMIN]: '3c7770c2-d540-4efb-aa7c-b72dc230ea50',
  [ROLES.DOCTOR]: '0910164d-b1ca-4641-9af5-a1facb99d72e',
  [ROLES.RECEPTIONIST]: '83626286-d0a9-4078-b999-e716249d3a34',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
export type RoleKeyType = keyof typeof ROLES;
