import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Branch } from '@/features/branches/types';

interface ConfigState {
  branches: Branch[];
  selectedBranch: Branch | null;
  setBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branch: Branch | null) => void;
  clear: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      branches: [],
      selectedBranch: null,
      setBranches: (branches) => set({ branches }),
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      clear: () => set({ branches: [], selectedBranch: null }),
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        branches: state.branches,
        selectedBranch: state.selectedBranch,
      }),
    },
  ),
);
