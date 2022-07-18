import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/WelcomePage.vue") },
      {
        path: "/import",
        component: () => import("pages/ImportProjectPage.vue"),
      },
    ],
  },
  {
    path: "/projects",
    component: () => import("layouts/ProjectLayout.vue"),
    children: [
      { path: "", component: () => import("pages/DashboardPage.vue") },
      { path: "modules", component: () => import("pages/ModulesPage.vue") },
      { path: "solutions", component: () => import("pages/SolutionsPage.vue") },
      {
        path: "simulations",
        component: () => import("pages/SimulationsPage.vue"),
      },
      { path: "monitor", component: () => import("pages/MonitorPage.vue") },
      { path: "logs", component: () => import("pages/LogsPage.vue") },
      { path: "settings", component: () => import("pages/SettingsPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
