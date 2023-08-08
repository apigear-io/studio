import { create } from "zustand";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";

export type SimuEvent = {
  timestamp: number;
  type: string;
  symbol: string;
  name: string;
  args: unknown[];
  kwargs: Record<string, unknown>;
  error: string;
};

const limit = 500;

type SimuState = {
  events: SimuEvent[];
  running: Record<string, boolean>;
};

type SimuActions = {
  clear: () => void;
  start(path: string): void;
  stop(path: string): void;
  init(): void;
};

export const useSimuStore = create<SimuState & SimuActions>((set, get) => ({
  events: [],
  running: {},
  clear: () => {
    set({ events: [] });
  },
  start: (path: string) => {
    console.log("startSimu", path);
    const running = { ...get().running };
    running[path] = true;
    set({ running });
  },
  stop: (path: string) => {
    console.log("stopSimu", path);
    const running = { ...get().running };
    delete running[path];
    set({ running });
  },
  init: async () => {
    const { clear: clearEvents } = get();
    clearEvents();
    EventsOff("sim");
    EventsOn("sim", (event: SimuEvent) => {
      console.log("simu event", event);
      const { events } = get();
      const newEvents = [event, ...events];
      if (newEvents.length > limit) {
        newEvents.shift();
      }
      set({ events: newEvents });
    });
  },
}));
