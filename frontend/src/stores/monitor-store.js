import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export const useMonitorStore = defineStore('mon', {
  state: () => ({
    monEventLimit: 500,
    monEventItems: [],
  }),
  actions: {
    clear() {
      this.monEvents = [];
    },
    init() {
      console.log('start monitoring');
      this.monEventItems = [];
      EventsOn("mon", (event) => {
        console.log('mon event', event);
        this.monEventItems.unshift(event);
        // limit the number of events
        if (this.monEventItems.length > this.monEventLimit) {
          this.monEventItems.pop();
        }
      })
    }
  },
});
