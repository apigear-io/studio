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
    genLogs: [] as ILogEvent[],
    genLogsRecording: false,
  }),
  actions: {
    clear() {
      this.list = [];
    },
    startRecordGenLogs() {
      console.log('start recording gen logs');
      this.genLogs = [];
    },
    stopRecordGenLogs() {
      console.log('stop recording gen logs');
      this.genLogs = [];
    },
    init() {
      console.log('start log capturing');
      this.list = [];
      EventsOn('log', (event) => {
        console.log('log event', event);
        this.list.unshift(event);
        if (event.topic === 'gen') {
          this.genLogs.unshift(event);
          if (this.genLogs.length > this.limit) {
            this.genLogs.pop();
          }
        }
        // limit the number of events
        if (this.list.length > this.limit) {
          this.list.pop();
        }
      });
    },
  },
});
