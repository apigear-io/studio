import { create } from "zustand";
import { RecentProjects, RefreshCurrentProject } from "../wailsjs/go/main/App";

export type Document = {
  name: string;
  path: string;
  type: string;
};

export type Project = {
  name: string;
  path: string;
  documents: Document[];
};

type ProjectState = {
  project: Project | null;
  recent: string[];
};

type ProjectActions = {
  setProject: (project: Project) => void;
  setRecent: (recent: string[]) => void;
  refresh: () => Promise<void>;
  getDocuments: (type: string) => Document[];
};

export const useProjectStore = create<ProjectState & ProjectActions>(
  (set, get) => ({
    project: null,
    recent: [],
    setProject: (project) => set({ project }),
    setRecent: (recent) => set({ recent }),
    getDocuments: (type: string) => {
      const project = get().project;
      if (!project) {
        return [];
      }
      return project.documents.filter((doc) => doc.type === type);
    },

    refresh: async () => {
      const recent = await RecentProjects();
      set({ recent });
      const project: Project = await RefreshCurrentProject();
      set({ project });
    },
  })
);
