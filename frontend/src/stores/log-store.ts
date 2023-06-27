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
    startRecordGenLogs() {
      console.log('start recording gen logs');
    },
    stopRecordGenLogs() {
      console.log('stop recording gen logs');
    },
    init() {
      console.log('init log store');
      this.list = [];
      EventsOn('log', (data) => {
        const event = JSON.parse(data);
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
