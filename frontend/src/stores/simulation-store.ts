import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface ISimuEvent {
  timestamp: string;
  type: string;
  symbol: string;
  name: string;
  args: Array<unknown>;
  kwargs: Record<string, unknown>;
}

export const useSimulationStore = defineStore('sim', {
  state: () => ({
    limit: 500 as number,
    events: [] as ISimuEvent[],
    running: {} as Record<string, boolean>,
  }),
  actions: {
    clear() {
      this.events = [];
    },
    init() {
      console.log('init simu store');
      this.events = [];
      EventsOn('sim', (event) => {
        console.log('sim event', event);
        this.events.unshift(event as ISimuEvent);
        // limit the number of events
        if (this.events.length > this.limit) {
          this.events.pop();
        }
      });
    },
    start(id: string) {
      this.running[id] = true;
    },
    stop(id: string) {
      this.running[id] = false;
    },
  },
});
