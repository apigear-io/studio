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
    events: [] as ILogEvent[],
    simEvents: [] as ILogEvent[],
    recordSimEvents: false as boolean,
    solutionEvents: [] as ILogEvent[],
    recordingSolutionRun: false as boolean,
  }),
  actions: {
    clear() {
      this.events = [];
      this.simEvents = [];
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
    startRecordSimEvents() {
      this.simEvents = [];
      this.recordSimEvents = true;
    },
    stopRecordSimEvents() {
      this.recordSimEvents = false;
    },
    init() {
      console.log('init log store');
      this.events = [];
      EventsOn('log', (data) => {
        const event = JSON.parse(data);
        this.pushEvent(event);
        this.pushSolutionEvent(event);
        if (event.topic === 'sim') {
          if (this.recordSimEvents) {
            console.log('sim event', event);
            this.simEvents.unshift(event);
            // limit the number of events
            if (this.simEvents.length > this.limit) {
              this.simEvents.pop();
            }
          }
        }
      });
    },
  },
});
