import { create } from "zustand";

type SolutionState = {
  autoRuns: Record<string, boolean>;
};

type SolutionActions = {
  setAutoRun(path: string, on: boolean): void;
};

export const useSolutionStore = create<SolutionState & SolutionActions>(
  (set, get) => ({
    autoRuns: {},
    setAutoRun: (path: string, on: boolean) => {
      console.log("setAutoRun", path, on);
      const autoRuns = { ...get().autoRuns };
      autoRuns[path] = on;
      set({ autoRuns });
    },
  })
);
