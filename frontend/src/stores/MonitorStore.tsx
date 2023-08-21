import { create } from "zustand";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";

export type MonitorEvent = {
  id: string;
  timestamp: number;
  source: string;
  type: string;
  symbol: string;
  data: Record<string, unknown>;
};

type MonitorState = {
  events: MonitorEvent[];
};

type MonitorActions = {
  clear(): void;
  init(): void;
};

const limit = 500;

export const useMonitorStore = create<MonitorState & MonitorActions>(
  (set, get) => ({
    events: [],
    clear: () => {
      set({ events: [] });
    },
    init: async () => {
      console.log("init monitor");
      const { clear } = get();
      clear();
      EventsOff("mon");
      EventsOn("mon", (event: MonitorEvent) => {
        console.log("monitor event", event);
        const { events } = get();
        const newEvents = [event, ...events];
        if (newEvents.length > limit) {
          newEvents.shift();
        }
        set({ events: newEvents });
      });
    },
  })
);
