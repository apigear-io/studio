import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface IMonitorEvent {
  id: string;
  timestamp: number;
  source: string;
  type: string;
  symbol: string;
  data: Record<string, unknown>;
}

export const useMonitorStore = defineStore('mon', {
  state: () => ({
    limit: 500 as number,
    events: [] as IMonitorEvent[],
  }),
  actions: {
    clear() {
      this.events = [];
    },
    init() {
      console.log('start monitoring');
      this.events = [];
      EventsOn('mon', (event) => {
        console.log('mon event', event);
        this.events.unshift(event);
        // limit the number of events
        if (this.events.length > this.limit) {
          this.events.pop();
        }
      });
    },
  },
});
