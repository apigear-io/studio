import { AppShell } from "@mantine/core";
import AppHeader from "../components/AppHeader";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import AppFooter from "../components/AppFooter";

export default function ProjectLayout() {
  return (
    <AppShell
      header={<AppHeader />}
      navbar={<NavigationBar />}
      footer={<AppFooter />}
    >
      <Outlet />
    </AppShell>
  );
}
