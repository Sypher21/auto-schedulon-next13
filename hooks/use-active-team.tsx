import { create } from 'zustand';

interface useActiveTeamInterface {
  id?: string;
  set: (id: string) => void;
  reset: () => void;
}

export const useActiveTeam = create<useActiveTeamInterface>((set) => ({
  id: undefined,
  set: (id: string) => set({ id }),
  reset: () => set({ id: undefined }),
}));