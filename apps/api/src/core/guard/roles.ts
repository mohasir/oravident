export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
