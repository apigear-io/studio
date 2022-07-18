import { defineStore } from "pinia";
import { RecentProjects, RefreshProject } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";
import { EventsOn } from "../wailsjs/runtime/runtime";

export const useProjectStore = defineStore("project", {
  state: () => ({
    project: null as main.Project | null,
    recent: [] as string[],
  }),
  getters: {
    documents: (state) => state.project?.documents,
    modules: (state) =>
      state.project?.documents.filter((doc) => doc.type === "module"),
    solutions: (state) =>
      state.project?.documents.filter((doc) => doc.type === "solution"),
    scenarios: (state) =>
      state.project?.documents.filter((doc) => doc.type === "scenario"),
  },
  actions: {
    init() {
      console.log("init project store");
      EventsOn("ProjectChanged", this.sync);
    },
    async sync() {
      console.log("sync project store");
      try {
        this.project = (await RefreshProject()) as main.Project;
        this.recent = await RecentProjects();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
