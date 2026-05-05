'use client';

import { useEffect, useState } from 'react';
import { useConfigStore } from '@/lib/config';
import { branchesService } from '@/features/branches';
import { WrapperLoader } from '@/components/WrapperLoader';
import { useAuthStore } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/lib/auth/navigation';

export function InitProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();

  const handleConfigBranches = async () => {
    const { setBranches, setSelectedBranch } = useConfigStore.getState();

    const response = await branchesService.getAll();
    const fetched = response.data?.items ?? [];
    setBranches(fetched);
    if (fetched.length > 0) {
      setSelectedBranch(fetched[0] ?? null);
    }
  };

  useEffect(() => {
    const { isAuthenticated } = useAuthStore.getState();
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname?.startsWith(route),
    );

    if (isAuthRoute || !isAuthenticated) {
      setIsInitializing(false);
      return;
    }

    const initConfig = async () => {
      try {
        if (session?.isPlatformAdmin) {
          return;
        }

        await handleConfigBranches();
      } catch (error) {
        console.error('Config initialization failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initConfig();
  }, [session, pathname]);

  if (isInitializing) {
    return <WrapperLoader isLoading message="Cargando configuración..." />;
  }

  return <>{children}</>;
}
