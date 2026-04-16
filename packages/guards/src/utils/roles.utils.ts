import { ROLES } from '../constants/roles.ts';
import type { RoleType } from '../constants/roles.ts';

export const isSuperAdmin = (role: RoleType): boolean => role === ROLES.SUPERADMIN;
export const isAdmin = (role: RoleType): boolean => role === ROLES.ADMIN;
export const isDoctor = (role: RoleType): boolean => role === ROLES.DOCTOR;
export const isReceptionist = (role: RoleType): boolean => role === ROLES.RECEPTIONIST;
