import { create } from "zustand";

interface DashboardState {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeBusinessId: null,
  setActiveBusinessId: (id) => set({ activeBusinessId: id }),
}));
