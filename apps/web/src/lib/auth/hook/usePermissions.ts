import { useAuthStore } from '@/lib/auth/store/auth.store';
import type { PermissionType } from '@repo/guards';
import type { RoleType } from '@repo/guards';

export function usePermissions() {
  const session = useAuthStore((s) => s.session);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  return {
    roles: session?.role ? [session.role.name as RoleType] : [],
    permissions: (session?.permissions ?? []) as PermissionType[],
    isSuperadmin: session?.isPlatformAdmin,
    isLoading: !isHydrated,
  };
}
