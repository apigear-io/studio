import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface ISimuEvent {
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
  },
});
