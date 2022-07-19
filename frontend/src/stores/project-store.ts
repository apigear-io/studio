import { defineStore } from 'pinia';
import { RecentProjects, RefreshCurrentProject } from '../wailsjs/go/main/App';
import { main } from '../wailsjs/go/models';
import { EventsOn } from '../wailsjs/runtime/runtime';

const nullProject = main.ProjectInfo.createFrom({
  name: 'NONE',
  path: '',
  documents: [],
});

export const useProjectStore = defineStore('project', {
  state: () => ({
    project: nullProject,
    recent: [] as string[],
  }),
  getters: {
    documents: (state) => state.project?.documents,
    modules: (state) =>
      state.project?.documents.filter((doc) => doc.type === 'module'),
    solutions: (state) =>
      state.project?.documents.filter((doc) => doc.type === 'solution'),
    scenarios: (state) =>
      state.project?.documents.filter((doc) => doc.type === 'scenario'),
  },
  actions: {
    init() {
      console.log('init project store');
      EventsOn('ProjectChanged', this.sync);
    },
    async sync() {
      console.log('sync project store');
      try {
        this.project = (await RefreshCurrentProject()) as main.ProjectInfo;
        this.recent = await RecentProjects();
      } catch (e) {
        console.error(e);
      }
    },
  },
});
