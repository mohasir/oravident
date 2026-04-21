export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
} as const;

export const ROLE_IDS = {
  [ROLES.SUPERADMIN]: 'D538DD40-0C5D-4E23-8BC1-7F858B621CEF',
  [ROLES.ADMIN]: '3C7770C2-D540-4EFB-AA7C-B72DC230EA50',
  [ROLES.DOCTOR]: '0910164D-B1CA-4641-9AF5-A1FACB99D72E',
  [ROLES.RECEPTIONIST]: '83626286-D0A9-4078-B999-E716249D3A34',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
export type RoleKeyType = keyof typeof ROLES;
