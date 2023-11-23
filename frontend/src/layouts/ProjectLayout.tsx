import { AppShell } from "@mantine/core";
import AppHeader from "../components/AppHeader";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import AppFooter from "../components/AppFooter";

export default function ProjectLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 180, breakpoint: "sm" }}
      footer={{ height: 38 }}
      padding="md"
    >
      <AppHeader />
      <NavigationBar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppFooter />
    </AppShell>
  );
}
