import type { Route } from 'next';
import { PERMISSIONS, type PermissionType } from '@repo/guards';
import {
  Activity,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CalendarClock,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Phone,
  Settings,
  ShieldCheck,
  Stethoscope,
  User,
  UserCog,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href?: Route;
  icon?: string;
  guard?: PermissionType[];
  children?: NavItem[];
}

export interface NavGroup {
  group?: string;
  items: NavItem[];
}

export const ADMIN_MENU: NavGroup[] = [
  {
    items: [
      {
        label: 'common.menu.dashboard',
        href: '/admin',
        icon: 'dashboard',
      },
    ],
  },
  {
    group: 'common.menu.groups.agenda',
    items: [
      {
        label: 'common.menu.appointments',
        href: '/admin/appointments',
        icon: 'appointments',
        guard: [PERMISSIONS.LIST_APPOINTMENT],
      },
      {
        label: 'common.menu.patients',
        href: '/admin/patients',
        icon: 'patients',
        guard: [PERMISSIONS.LIST_PATIENT],
      },
    ],
  },
  {
    group: 'common.menu.groups.team',
    items: [
      {
        label: 'common.menu.users',
        icon: 'users',
        children: [
          {
            label: 'common.menu.doctors',
            href: '/admin/workers/doctors',
            icon: 'doctor',
            guard: [PERMISSIONS.LIST_WORKER],
          },
          {
            label: 'common.menu.receptionists',
            href: '/admin/workers/receptionists',
            icon: 'receptionist',
            guard: [PERMISSIONS.LIST_WORKER],
          },
          {
            label: 'common.menu.admins',
            href: '/admin/users',
            icon: 'admin',
            guard: [PERMISSIONS.LIST_USER],
          },
          {
            label: 'common.menu.invitations',
            href: '/admin/invitations',
            icon: 'invitation',
            guard: [PERMISSIONS.LIST_USER],
          },
        ],
      },
      {
        label: 'common.menu.roles',
        href: '/admin/roles',
        icon: 'roles',
        guard: [PERMISSIONS.LIST_ROLE],
      },
    ],
  },
  {
    group: 'common.menu.groups.clinic',
    items: [
      {
        label: 'common.menu.branches',
        href: '/admin/branches',
        icon: 'branch',
        guard: [PERMISSIONS.LIST_BRANCH],
      },
      {
        label: 'common.menu.services',
        href: '/admin/services',
        icon: 'services',
        guard: [PERMISSIONS.LIST_SERVICE],
      },
      {
        label: 'common.menu.schedules',
        href: '/admin/schedules',
        icon: 'schedule',
        guard: [PERMISSIONS.LIST_SCHEDULE],
      },
    ],
  },
  {
    group: 'common.menu.groups.settings',
    items: [
      {
        label: 'common.menu.clinicSettings',
        href: '/admin/clinic',
        icon: 'clinic',
        guard: [PERMISSIONS.LIST_CLINIC],
      },
      {
        label: 'common.menu.profile',
        href: '/admin/profile',
        icon: 'profile',
      },
    ],
  },
];

export const IconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  appointments: CalendarClock,
  patients: Activity,
  users: Users,
  doctor: Stethoscope,
  receptionist: Phone,
  admin: UserCog,
  invitation: UserPlus,
  roles: ShieldCheck,
  branch: Building2,
  services: Briefcase,
  schedule: Clock,
  clinic: Building,
  profile: User,
  settings: Settings,
  logout: LogOut,
  // legacy keys
  bookings: Calendar,
  quotes: FileText,
  availability: Clock,
  tenant: Building2,
};

// backward compat
export type MenuItem = NavItem;
