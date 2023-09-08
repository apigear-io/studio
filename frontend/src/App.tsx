import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import WelcomePage from "./pages/WelcomePage";
import ProjectLayout from "./layouts/ProjectLayout";
import ProjectPage from "./pages/ProjectPage";
import ModulesPage from "./pages/ModulesPage";
import SolutionsPage from "./pages/SolutionsPage";
import TemplatesPage from "./pages/TemplatesPage";
import SimulationPage from "./pages/SimulationPage";
import MonitorPage from "./pages/MonitorPage";
import LogsPage from "./pages/LogsPage";
import SettingsPage from "./pages/SettingsPage";
import { Container } from "@mantine/core";
import { useProjectStore } from "./stores/ProjectStore";
import { useLayoutEffect } from "react";
import { useLogsStore } from "./stores/LogsStore";
import SimulationEventsPage from "./pages/SimulationEventsPage";
import { useSimuStore } from "./stores/SimuStore";
import { useMonitorStore } from "./stores/MonitorStore";
import { useCacheStore, useRegistryStore } from "./stores/TemplatesStore";
import { useAppStore } from "./stores/AppStore";
import RootPage from "./pages/RootPage";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootPage />}>
      <Route path="" element={<WelcomePage />}></Route>
      <Route path="/project" element={<ProjectLayout />}>
        <Route path="" element={<ProjectPage />}></Route>
        <Route path="modules" element={<ModulesPage />}></Route>
        <Route path="solutions" element={<SolutionsPage />}></Route>
        <Route path="templates" element={<TemplatesPage />}></Route>
        <Route path="simulation" element={<SimulationPage />}></Route>
        <Route path="simulation/events" element={<SimulationEventsPage />} />
        <Route path="monitor" element={<MonitorPage />}></Route>
        <Route path="logs" element={<LogsPage />}></Route>
        <Route path="settings" element={<SettingsPage />}></Route>
      </Route>
    </Route>
  )
);

function App() {
  const initProject = useProjectStore((state) => state.init);
  const initLogs = useLogsStore((state) => state.init);
  const initSimu = useSimuStore((state) => state.init);
  const initMonitor = useMonitorStore((state) => state.init);
  const initCache = useCacheStore((state) => state.init);
  const initRegistry = useRegistryStore((state) => state.init);
  const initApp = useAppStore((state) => state.init);
  useLayoutEffect(() => {
    // run only once
    initProject();
    initLogs();
    initSimu();
    initMonitor();
    initCache();
    initRegistry();
    initApp();
  });
  return (
    <Container fluid>
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
