import { PERMISSIONS } from '@repo/guards';
import type { NavItem } from '../types';

export const DASHBOARD_ITEM: NavItem = {
  label: 'common.menu.dashboard',
  href: '/admin',
  icon: 'dashboard',
};

export const APPOINTMENTS_ITEM: NavItem = {
  label: 'common.menu.appointments',
  href: '/admin/appointments',
  icon: 'appointments',
  guard: [PERMISSIONS.LIST_APPOINTMENT],
};

export const PATIENTS_ITEM: NavItem = {
  label: 'common.menu.patients',
  href: '/admin/patients',
  icon: 'patients',
  guard: [PERMISSIONS.LIST_PATIENT],
};

export const ALL_USERS_ITEM: NavItem = {
  label: 'common.menu.allUsers',
  href: '/admin/users',
  icon: 'users',
  guard: [PERMISSIONS.LIST_USER],
};

export const DOCTORS_ITEM: NavItem = {
  label: 'common.menu.doctors',
  href: '/admin/workers/doctors',
  icon: 'doctor',
  guard: [PERMISSIONS.LIST_WORKER],
};

export const RECEPTIONISTS_ITEM: NavItem = {
  label: 'common.menu.receptionists',
  href: '/admin/workers/receptionists',
  icon: 'receptionist',
  guard: [PERMISSIONS.LIST_WORKER],
};

export const CLINIC_OWNERS_ITEM: NavItem = {
  label: 'common.menu.owners',
  href: '/admin/clinic-owners',
  icon: 'admin',
  guard: [PERMISSIONS.LIST_USER],
};

export const INVITATIONS_ITEM: NavItem = {
  label: 'common.menu.invitations',
  href: '/admin/invitations',
  icon: 'invitation',
  guard: [PERMISSIONS.LIST_USER],
};

export const ROLES_ITEM: NavItem = {
  label: 'common.menu.roles',
  href: '/admin/roles',
  icon: 'roles',
  guard: [PERMISSIONS.LIST_ROLE],
};

export const BRANCHES_ITEM: NavItem = {
  label: 'common.menu.branches',
  href: '/admin/branches',
  icon: 'branch',
  guard: [PERMISSIONS.LIST_BRANCH],
};

export const SERVICES_ITEM: NavItem = {
  label: 'common.menu.services',
  href: '/admin/services',
  icon: 'services',
  guard: [PERMISSIONS.LIST_SERVICE],
};

export const SCHEDULES_ITEM: NavItem = {
  label: 'common.menu.schedules',
  href: '/admin/schedules',
  icon: 'schedule',
  guard: [PERMISSIONS.LIST_SCHEDULE],
};

export const CLINIC_SETTINGS_ITEM: NavItem = {
  label: 'common.menu.clinicSettings',
  href: '/admin/clinic',
  icon: 'clinic',
  guard: [PERMISSIONS.LIST_CLINIC],
};

export const PROFILE_ITEM: NavItem = {
  label: 'common.menu.profile',
  href: '/admin/profile',
  icon: 'profile',
};

export const NAV_ITEMS = {
  DASHBOARD: DASHBOARD_ITEM,
  APPOINTMENTS: APPOINTMENTS_ITEM,
  PATIENTS: PATIENTS_ITEM,
  ALL_USERS: ALL_USERS_ITEM,
  DOCTORS: DOCTORS_ITEM,
  RECEPTIONISTS: RECEPTIONISTS_ITEM,
  CLINIC_OWNERS: CLINIC_OWNERS_ITEM,
  INVITATIONS: INVITATIONS_ITEM,
  ROLES: ROLES_ITEM,
  BRANCHES: BRANCHES_ITEM,
  SERVICES: SERVICES_ITEM,
  SCHEDULES: SCHEDULES_ITEM,
  CLINIC_SETTINGS: CLINIC_SETTINGS_ITEM,
  PROFILE: PROFILE_ITEM,
} as const;
