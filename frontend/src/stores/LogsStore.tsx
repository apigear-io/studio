import { create } from "zustand";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";

export type LogEvent = {
  uuid: string;
  time: number;
  level: string;
  topic: string;
  message: string;
  error: string;
};

const limit = 500;

type LogsState = {
  events: LogEvent[];
  simEvents: LogEvent[];
  recordSimEvents: boolean;
  solutionEvents: LogEvent[];
  recordSolutionEvents: boolean;
};

type LogsActions = {
  clearLogs: () => void;
  startRecordingSimEvents: () => void;
  stopRecordingSimEvents: () => void;
  startRecordingSolutionEvents: () => void;
  stopRecordingSolutionEvents: () => void;
  pushEvent: (event: LogEvent) => void;
  pushSimEvent: (event: LogEvent) => void;
  pushSolutionEvent: (event: LogEvent) => void;
  init(): void;
};

export const useLogsStore = create<LogsState & LogsActions>((set, get) => ({
  events: [],
  simEvents: [],
  recordSimEvents: false,
  solutionEvents: [],
  recordSolutionEvents: false,
  clearLogs: () => {
    set({ events: [], solutionEvents: [], simEvents: [] });
  },
  startRecordingSimEvents: () => {
    set({ simEvents: [], recordSimEvents: true });
  },
  stopRecordingSimEvents: () => {
    set({ recordSimEvents: false });
  },
  startRecordingSolutionEvents: () => {
    set({ solutionEvents: [], recordSolutionEvents: true });
  },
  stopRecordingSolutionEvents: () => {
    set({ recordSolutionEvents: false });
  },
  pushEvent: (event: LogEvent) => {
    const { events } = get();
    const newEvents = [event, ...events];
    if (newEvents.length > limit) {
      newEvents.shift();
    }
    set({ events: newEvents });
  },
  pushSimEvent: (event: LogEvent) => {
    const { simEvents, recordSimEvents } = get();
    if (recordSimEvents) {
      const newEvents = [event, ...simEvents];
      if (newEvents.length > limit) {
        newEvents.shift();
      }
      set({ simEvents: newEvents });
    }
  },
  pushSolutionEvent: (event: LogEvent) => {
    const { solutionEvents, recordSolutionEvents } = get();
    if (recordSolutionEvents) {
      const newEvents = [event, ...solutionEvents];
      if (newEvents.length > limit) {
        newEvents.shift();
      }
      set({ solutionEvents: newEvents });
    }
  },
  init: () => {
    console.log("init logs");
    // make sure we don't have multiple listeners
    EventsOff("log");
    const { pushEvent, pushSimEvent, pushSolutionEvent } = get();
    set({ events: [], solutionEvents: [], simEvents: [] });
    EventsOn("log", (data) => {
      const event = JSON.parse(data);
      pushEvent(event);
      pushSimEvent(event);
      pushSolutionEvent(event);
    });
  },
}));
