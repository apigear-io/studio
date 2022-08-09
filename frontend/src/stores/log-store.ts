import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface ILogEvent {
  time: number;
  level: string;
  topic: string;
  message: string;
}

export const useLogStore = defineStore('log', {
  state: () => ({
    limit: 500 as number,
    list: [] as ILogEvent[],
  }),
  actions: {
    clear() {
      this.list = [];
    },
    init() {
      console.log('start log capturing');
      this.list = [];
      EventsOn('log', (event) => {
        console.log('log event', event);
        this.list.unshift(event);
        // limit the number of events
        if (this.list.length > this.limit) {
          this.list.pop();
        }
      });
    },
  },
});
