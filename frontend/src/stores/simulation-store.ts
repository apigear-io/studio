import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface ISimulationEvent {
  timestamp: number;
  source: string;
  type: string;
  symbol: string;
  data: Record<string, unknown>;
}

export const useSimulationStore = defineStore('sim', {
  state: () => ({
    limit: 500 as number,
    events: [] as ISimulationEvent[],
  }),
  actions: {
    clear() {
      this.events = [];
    },
    init() {
      console.log('start simulation');
      this.events = [];
      EventsOn('sim', (event) => {
        console.log('sim event', event);
        this.events.unshift(event);
        // limit the number of events
        if (this.events.length > this.limit) {
          this.events.pop();
        }
      });
    },
  },
});
