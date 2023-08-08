import { create } from "zustand";
import { main } from "../wailsjs/go/models";
import {
  GetCacheList,
  GetRegistryList,
  InstallTemplate,
  InstallTemplateFromSource,
  RemoveTemplate,
  UpdateTemplateRegistry,
} from "../wailsjs/go/main/App";

type CacheState = {
  cache: main.RepoInfo[];
  loading: boolean;
  error: unknown;
};

type CacheActions = {
  refresh: () => Promise<void>;
  init: () => void;
  remove: (template: main.RepoInfo) => Promise<void>;
  installFromSource: (url: string) => Promise<void>;
  installFromRegistry: (name: string, version: string) => Promise<void>;
};

export const useCacheStore = create<CacheState & CacheActions>((set, get) => ({
  cache: [],
  loading: false,
  error: "",
  refresh: async () => {
    set({ loading: true });
    try {
      const cache = await GetCacheList();
      set({ cache });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  init: async () => {
    console.log("init cache store");
    const { refresh } = get();
    await refresh();
  },
  remove: async (template) => {
    set({ loading: true });
    const refresh = get().refresh;
    try {
      await RemoveTemplate(template.name);
      await refresh();
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  installFromSource: async (url) => {
    set({ loading: true });
    const refresh = get().refresh;
    try {
      await InstallTemplateFromSource(url);
      await refresh();
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  installFromRegistry: async (name, version) => {
    set({ loading: true });
    const refresh = get().refresh;
    try {
      await InstallTemplate(name, version);
      await refresh();
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
}));

type RegistryState = {
  registry: main.RepoInfo[];
  loading: boolean;
  error: unknown;
};

type RegistryActions = {
  refresh: () => Promise<void>;
  init: () => void;
  update: () => Promise<void>;
};

export const useRegistryStore = create<RegistryState & RegistryActions>(
  (set, get) => ({
    registry: [],
    loading: false,
    error: undefined,
    refresh: async () => {
      set({ loading: true });
      try {
        const registry = await GetRegistryList();
        set({ registry });
      } catch (error) {
        set({ error });
      } finally {
        set({ loading: false });
      }
    },
    init: async () => {
      console.log("init registry store");
      const { update } = get();
      await update();
    },
    update: async () => {
      set({ loading: true });
      const refresh = get().refresh;
      try {
        await UpdateTemplateRegistry();
        await refresh();
      } catch (error) {
        set({ error });
      } finally {
        set({ loading: false });
      }
    },
  })
);
