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

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<WelcomePage />}></Route>
      <Route path="/project" element={<ProjectLayout />}>
        <Route path="" element={<ProjectPage />}></Route>
        <Route path="modules" element={<ModulesPage />}></Route>
        <Route path="solutions" element={<SolutionsPage />}></Route>
        <Route path="templates" element={<TemplatesPage />}></Route>
        <Route path="simulation" element={<SimulationPage />}></Route>
        <Route path="monitor" element={<MonitorPage />}></Route>
        <Route path="logs" element={<LogsPage />}></Route>
        <Route path="settings" element={<SettingsPage />}></Route>
      </Route>
    </Route>
  )
);

function App() {
  const refresh = useProjectStore((state) => state.refresh);
  useLayoutEffect(() => {
    refresh();
  });
  return (
    <Container fluid p="md">
      <RouterProvider router={router} />;
    </Container>
  );
}

export default App;
