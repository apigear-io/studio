<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn flat icon="cottage" @click="toggleLeftDrawer"/>
        <q-toolbar-title> ApiGear Studio </q-toolbar-title>

        <q-space />
        <q-btn flat icon="content_copy" label="Copy Path" @click="copyProjectPath()"/>
        <q-btn flat icon="sync" label="Sync"/>
        <q-btn flat icon="swap_horiz" :label="project.name" to="/"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="120" behavior="desktop" :breakpoint="640">
      <q-tabs vertical>
        <q-route-tab
          v-for="mode in modes"
          :key="mode.icon"
          :icon="mode.icon"
          :label="mode.title"
          :to="mode.to"
          no-caps
          active-class="bg-primary"
          exact
        ></q-route-tab>
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <div class="row">
        <q-btn flat size="sm" label="(c) 2020 ApiGear Studio" />
        <q-space />
        <q-btn flat size="sm" label="v 2020.3" />
        </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { CurrentProject } from "../wailsjs/go/main/App";

const ICONS = {
  dashboard: "dashboard",
  module: "api",
  solution: "chair",
  scenario: "av_timer",
  monitor: "data_object",
  logs: "view_list",
  settings: "settings",
};

const modes = [
  {
    title: "Dashboard",
    icon: "dashboard",
    to: "/projects/",
  },
  {
    title: "Modules",
    icon: "api",
    to: "/projects/modules",
  },
  {
    title: "Solutions",
    icon: "chair",
    to: "/projects/solutions",
  },
  {
    title: "Simulation",
    icon: "av_timer",
    to: "/projects/simulations",
  },
  {
    title: "Monitor",
    icon: "data_object",
    to: "/projects/monitor",
  },
  {
    title: "Logs",
    icon: "view_list",
    to: "/projects/logs",
  },
  {
    title: "Settings",
    icon: "settings",
    to: "/projects/settings",
  },
];

export default {
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(true);
    const project = ref({name: ""});

    onMounted(async () => {
      project.value = await CurrentProject()
    });

    function copyProjectPath() {
      navigator.clipboard.writeText(project.value.path);
      $q.notify({
        message: `${project.value.path} copied to clipboard`,
        color: "positive",
        icon: "done",
        timeout: 2000,
      });
    }

    return {
      modes: modes,
      leftDrawerOpen,
      project,
      copyProjectPath,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>
