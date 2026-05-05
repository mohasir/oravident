import type { Route } from 'next';
import type { PermissionType } from '@repo/guards';

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

export type MenuItem = NavItem;
