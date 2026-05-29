'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useAuth } from '@/lib/auth/hook/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import {
  AUTH_ROUTES,
  DEFAULT_REDIRECT_LOGIN,
  PROTECTED_ROUTES,
} from '@/lib/auth/navigation';
import type { Route } from 'next';
import { WrapperLoader } from '../WrapperLoader';

const DISABLE_REFRESH_ON_RELOAD = true;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { initAuth } = useAuth();

  useEffect(() => {
    if (isHydrated) {
      setIsInitializing(false);
      return;
    }

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname?.startsWith(route),
    );

    if (isAuthRoute) {
      setIsInitializing(false);
      return;
    }

    // 3. Initialize session
    const initSession = async () => {
      if (!DISABLE_REFRESH_ON_RELOAD) {
        try {
          await initAuth();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // If refresh fails, we might still have a persisted session that's technically invalid
          // but we let the axios interceptors handle the 401 later if needed.
          // Or we can clear it here.
        }
      } else {
        console.log('Auth refresh on reload is currently disabled by flag.');
      }

      const currentState = useAuthStore.getState();

      // Only redirect if NOT authenticated AND the route IS protected
      const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname?.startsWith(route),
      );

      if (!currentState.isAuthenticated && isProtectedRoute) {
        const loginUrl = `${DEFAULT_REDIRECT_LOGIN}?callbackUrl=${pathname}`;
        router.replace(loginUrl as Route);
        return;
      }

      setHydrated(true);
      setIsInitializing(false);
    };

    initSession();
  }, [isHydrated, pathname, router, initAuth, setHydrated]);

  if (isInitializing) {
    return <WrapperLoader isLoading message="Cargando sesión..." />;
  }

  return <>{children}</>;
}
