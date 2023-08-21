import { create } from "zustand";
import {
  NewDocument,
  RecentProjects,
  RefreshCurrentProject,
} from "../wailsjs/go/main/App";

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
  init(): void;
  getDocuments: (type: string) => Document[];
  newDocument: (kind: string, name: string) => Promise<void>;
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
      const project: Project = await RefreshCurrentProject();
      set({ project });
      const recent = await RecentProjects();
      set({ recent });
    },
    init: async () => {
      const { refresh } = get();
      await refresh();
    },
    newDocument: async (kind, name) => {
      const { refresh } = get();
      await NewDocument(kind, name);
      await refresh();
    },
  })
);
