import { NAV_ITEMS } from './constants/items';
import type { NavGroup } from './types';
import { ROLES } from '@repo/guards';

export const CLINIC_OWNER_MENU_CONFIG: NavGroup[] = [
  {
    items: [NAV_ITEMS.DASHBOARD],
  },
  {
    group: 'common.menu.groups.agenda',
    items: [NAV_ITEMS.APPOINTMENTS, NAV_ITEMS.PATIENTS],
  },
  /* {
    group: 'common.menu.groups.team',
    items: [NAV_ITEMS.DOCTORS, NAV_ITEMS.RECEPTIONISTS],
  }, */
  {
    group: 'common.menu.groups.clinic',
    items: [
      NAV_ITEMS.BRANCHES,
      NAV_ITEMS.SERVICES,
      // NAV_ITEMS.SCHEDULES
    ],
  },
];

export const RECEPTIONIST_MENU_CONFIG: NavGroup[] = [
  {
    items: [NAV_ITEMS.DASHBOARD],
  },
  {
    group: 'common.menu.groups.agenda',
    items: [NAV_ITEMS.APPOINTMENTS, NAV_ITEMS.PATIENTS],
  },
  {
    group: 'common.menu.groups.settings',
    items: [NAV_ITEMS.PROFILE],
  },
];

export const SUPERADMIN_MENU_CONFIG: NavGroup[] = [
  {
    items: [NAV_ITEMS.DASHBOARD],
  },
  {
    group: 'common.menu.groups.agenda',
    items: [NAV_ITEMS.APPOINTMENTS, NAV_ITEMS.PATIENTS],
  },
  {
    group: 'common.menu.groups.team',
    items: [
      NAV_ITEMS.ALL_USERS,
      NAV_ITEMS.DOCTORS,
      NAV_ITEMS.RECEPTIONISTS,
      NAV_ITEMS.CLINIC_OWNERS,
      NAV_ITEMS.INVITATIONS,
    ],
  },
  {
    group: 'common.menu.groups.clinic',
    items: [NAV_ITEMS.BRANCHES, NAV_ITEMS.SERVICES, NAV_ITEMS.SCHEDULES],
  },
  {
    group: 'common.menu.groups.settings',
    items: [NAV_ITEMS.CLINIC_SETTINGS, NAV_ITEMS.PROFILE, NAV_ITEMS.ROLES],
  },
];

export const ADMIN_MENU = {
  [ROLES.ADMIN]: CLINIC_OWNER_MENU_CONFIG,
  [ROLES.RECEPTIONIST]: RECEPTIONIST_MENU_CONFIG,
  [ROLES.SUPERADMIN]: SUPERADMIN_MENU_CONFIG,
} as const;
