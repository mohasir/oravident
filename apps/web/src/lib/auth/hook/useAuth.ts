import { useCallback } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/lib/auth/store/auth.store';
import { clearAllStores } from '@/lib/store/clear-stores';
import { ApiError } from '@/lib/http/ApiError';
import Cookies from 'js-cookie';
import type { LoginSchema } from '@/features/auth/schemas/login.schema';

export function useAuth() {
  const signIn = useCallback(async (data: LoginSchema) => {
    try {
      const { accessToken } = await authService.login(data);

      Cookies.set('auth-session', 'true', { expires: 7 });

      useAuthStore.getState().setAuth(accessToken);

      const meResponse = await authService.getMe(accessToken);

      if (meResponse?.data) {
        useAuthStore.getState().setSession(accessToken, meResponse.data);
      }
      useAuthStore.getState().setHydrated(true);
    } catch (err) {
      clearAllStores();
      throw ApiError.from(err);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      Cookies.remove('auth-session');
      clearAllStores();
    }
  }, []);

  const initAuth = useCallback(async () => {
    try {
      const accessToken = await authService.refreshToken();
      useAuthStore.getState().setAuth(accessToken);

      const meResponse = await authService.getMe(accessToken);
      if (meResponse.data) {
        useAuthStore.getState().setSession(accessToken, meResponse.data);
      }
    } catch (err) {
      clearAllStores();
      throw ApiError.from(err);
    }
  }, []);

  return { signIn, signOut, initAuth };
}
