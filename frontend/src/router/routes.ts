import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/WelcomePage.vue') }],
  },
  {
    path: '/projects',
    component: () => import('layouts/ProjectLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'modules', component: () => import('src/pages/ModulesPage.vue') },
      { path: 'solutions', component: () => import('pages/SolutionsPage.vue') },
      { path: 'templates', component: () => import('pages/TemplatesPage.vue') },
      {
        path: 'simulations',
        component: () => import('pages/SimulationsPage.vue'),
      },
      { path: 'monitor', component: () => import('pages/MonitorPage.vue') },
      { path: 'logs', component: () => import('pages/LogsPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
