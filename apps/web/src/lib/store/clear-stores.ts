import { useAuthStore } from '@/lib/auth/store/auth.store';
import { useConfigStore } from '@/lib/config/store/config.store';
import { useLoaderStore } from '@/lib/loader/store/loader.store';
import Cookies from 'js-cookie';

/**
 * Clears all the application's Zustand stores.
 * Useful for logging out or resetting the application state.
 */
export const clearAllStores = () => {
  // Clear auth store
  useAuthStore.getState().clearAuth();

  // Clear session cookie
  Cookies.remove('auth-session');

  // Clear config store (branches, selected branch)
  useConfigStore.getState().clear();

  // Reset loader state just in case
  useLoaderStore.getState().hide();
};
