import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface IMonitorEvent {
  timestamp: number;
  source: string;
  type: string;
  symbol: string;
  data: Record<string, unknown>;
}

export const useMonitorStore = defineStore('mon', {
  state: () => ({
    monEventLimit: 500 as number,
    monEventItems: [] as IMonitorEvent[],
  }),
  actions: {
    clear() {
      this.monEventItems = [];
    },
    init() {
      console.log('start monitoring');
      this.monEventItems = [];
      EventsOn('mon', (event) => {
        console.log('mon event', event);
        this.monEventItems.unshift(event);
        // limit the number of events
        if (this.monEventItems.length > this.monEventLimit) {
          this.monEventItems.pop();
        }
      });
    },
  },
});
