import { defineStore } from 'pinia';
import { RecentProjects, RefreshProject } from "../wailsjs/go/main/App";

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: { documents: [] },
    recent: [],
  }),
  getters: {
    documents: (state) => state.project.documents,
    modules: (state) => state.project.documents.filter(doc => doc.type === 'module'),
    solutions: (state) => state.project.documents.filter(doc => doc.type === 'solution'),
    scenarios: (state) => state.project.documents.filter(doc => doc.type === 'scenario'),
  },
  actions: {
    init() {
      console.log('init project store');
      window.runtime.EventsOn("ProjectChanged", this.sync)
    },
    async sync() {
      console.log('sync project store');
      this.project = await RefreshProject();
      this.recent = await RecentProjects();
    },
  }
});
