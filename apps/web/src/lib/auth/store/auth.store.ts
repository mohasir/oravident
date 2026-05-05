import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { decodeAccessToken } from '../helpers/jwt';
import type { AuthSession, MeProfile } from '@/features/auth/services/types';

interface AuthState {
  accessToken: string | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (accessToken: string) => void;
  setSession: (accessToken: string, profile: MeProfile) => void;
  clearAuth: () => void;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      session: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (accessToken) => {
        set({ accessToken, isAuthenticated: true });
      },

      setSession: (accessToken, profile) => {
        const decoded = decodeAccessToken(accessToken);
        const session: AuthSession = {
          ...profile,
          permissions: decoded?.permissions ?? [],
          tenantId: decoded?.tenantId,
        };
        set({ accessToken, session, isAuthenticated: true });
      },

      clearAuth: () => {
        set({ accessToken: null, session: null, isAuthenticated: false });
      },

      setHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        isHydrated: state.isHydrated,
      }),
    },
  ),
);
