import { defineStore } from 'pinia';

import { EventsOn } from '../wailsjs/runtime/runtime';

export interface ILogEvent {
  time: number;
  level: string;
  topic: string;
  message: string;
}


const solutionTopics = ['app', 'gen', 'sol'];

export const useLogStore = defineStore('log', {
  state: () => ({
    limit: 500 as number,
    events: [] as ILogEvent[],
    solutionEvents: [] as ILogEvent[],
    recordingSolutionRun: false as boolean,
  }),
  actions: {
    clear() {
      this.events = [];
    },
    startRecordSolutionRun() {
      console.log('start recording gen logs');
      this.solutionEvents = [];
      this.recordingSolutionRun = true;
    },
    stopRecordingSolutionRun() {
      console.log('stop recording gen logs');
      this.recordingSolutionRun = false;
    },
    pushEvent(event: ILogEvent) {
      // check limit and pop
      if (this.events.length > this.limit) {
        this.events.pop();
      }
      this.events.unshift(event);
    },
    pushSolutionEvent(event: ILogEvent) {
      if (this.recordingSolutionRun) {
        // check limit and pop
        if (this.solutionEvents.length > this.limit) {
          this.solutionEvents.pop();
        }
        this.solutionEvents.unshift(event);
      }
    },
    init() {
      console.log('init log store');
      this.events = [];
      EventsOn('log', (data) => {
        const event = JSON.parse(data);
        this.pushEvent(event)
        this.pushSolutionEvent(event)
      });
    },
  },
});
