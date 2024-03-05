import { create } from "zustand";
import { CheckUpdate, VersionInfo, CliVersionInfo } from "../wailsjs/go/main/App";

type AppState = {
  isLoading: boolean;
  error: string;
  currentVersion: string;
  latestVersion: string;
  cliVersion: string;
  commitHash: string;
  commitDate: string;
};

type AppActions = {
  refresh: () => void;
  init(): void;
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  currentVersion: "",
  latestVersion: "",
  cliVersion: "",
  commitHash: "",
  commitDate: "",
  isLoading: false,
  error: "",
  refresh: async () => {
    set({ isLoading: true });
    console.log("refresh app store");
    try {
      const info = await VersionInfo();
      console.log("info", info);
      if (info) {
        set({
          currentVersion: info.version,
          commitHash: info.commit,
          commitDate: info.date,
        });
      }
      const cli_info = await CliVersionInfo();
      console.log("cli info", cli_info);
      if (cli_info) {
        set({
          cliVersion: cli_info.version,
        });
      }
      const rel = await CheckUpdate();
      console.log("rel", rel);
      if (rel) {
        set({ latestVersion: rel.version });
      }
    } catch (error) {
      console.error(error);
      set({ error: String(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  init: async () => {
    console.log("init app store");
    const refresh = get().refresh;
    refresh();
  },
}));
