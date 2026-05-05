import { create } from 'zustand';

interface LoaderState {
  isVisible: boolean;
  message: string | null;
  show: (message?: string) => void;
  hide: () => void;
}

export const useLoaderStore = create<LoaderState>()((set) => ({
  isVisible: false,
  message: null,
  show: (message) => set({ isVisible: true, message: message ?? null }),
  hide: () => set({ isVisible: false, message: null }),
}));
