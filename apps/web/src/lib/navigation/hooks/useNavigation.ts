import { useAuthStore } from '@/lib/auth';
import { ADMIN_MENU } from '../config';
import { ROLES } from '@repo/guards';
import type { NavGroup } from '../types';

export function useNavigation() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return {
      menu: [] as NavGroup[],
      role: null,
      isPlatformAdmin: false,
      isLoading: true,
    };
  }

  const roleName = session.role?.name;
  const isPlatformAdmin = session.isPlatformAdmin;

  const menu = isPlatformAdmin
    ? ADMIN_MENU[ROLES.SUPERADMIN]
    : roleName && roleName in ADMIN_MENU
      ? ADMIN_MENU[roleName as keyof typeof ADMIN_MENU]
      : [];

  return {
    menu,
    role: roleName,
    isPlatformAdmin,
    isLoading: false,
  };
}
