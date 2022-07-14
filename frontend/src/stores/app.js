import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';
export const useAppStore = defineStore('app', {
  state: () => ({
    monEventLimit: 500,
    monEventItems: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    clear() {
      this.monEvents = [];
    },
    addEvent(event) {
      console.log('addEvent', event);
      // insert event at the beginning of the array
    },
    startMonitoring() {
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
