import { NavItem, NavGroup } from '@/lib/navigation';

export interface NavMenuItemProps {
  item: NavItem;
}

export interface isGroupVisibleProps {
  group: NavGroup;
  can: (permissions: string[]) => boolean;
}
