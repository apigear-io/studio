<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-grey-10">
      <q-toolbar>
        <q-icon name="api" color="red-7" size="md"/>
        <q-toolbar-title>ApiGear Studio</q-toolbar-title>
        <q-space />
        <q-btn-dropdown flat class="text-primary" label="New Document" dropdown-icon="add_box" no-caps>
          <q-list class="q-pa-md">
            <q-item clickable v-close-popup @click="onNewModule" class="text-primary">
              <q-item-section avatar>
                <q-icon name="api" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Module</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onNewSolution" class="text-primary">
              <q-item-section avatar>
                <q-icon name="chair" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solution</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onNewSimulation" class="text-primary">
              <q-item-section avatar>
                <q-icon name="av_timer" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Simulation</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-btn-group flat class="text-primary">
          <q-btn icon="swap_horiz" :label="project.name" to="/" no-caps>
            <q-tooltip>Switch projects</q-tooltip>
          </q-btn>
          <q-btn icon="sync">
            <q-tooltip>Sync project folder</q-tooltip>
          </q-btn>
          <q-btn icon="content_copy" @click="copyProjectPath()">
            <q-tooltip>Copy project location to clipboard</q-tooltip>
          </q-btn>
          <q-btn icon="help" @click="openHelp">
            <q-tooltip>Help</q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="96" :breakpoint="640" bordered>
      <q-tabs vertical class="q-py-md q-px-xs">
        <q-route-tab
          v-for="mode in modes"
          :key="mode.icon"
          :icon="mode.icon"
          :label="mode.title"
          :to="mode.to"
          no-caps
          active-class="text-primary"
          exact
        ></q-route-tab>
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-10">
      <div class="row">
        <q-btn flat size="md" label="(c) 2020 ApiGear Studio" no-caps/>
        <q-space />
        <q-btn flat size="md" label="v 2020.3"  no-caps/>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { CurrentProject, NewDocument } from "../wailsjs/go/main/App";

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

    function openHelp() {
      try {
        window.runtime.BrowserOpenURL("https://docs.apigear.io/");
      } catch (e) {
        $q.notify({
          message: e,
          color: 'negative',
          icon: 'error'
        })
      }
    }

    function onNewModule() {
      $q.dialog({
        title: "New Module",
        message: "Enter module name",
        prompt: {
          model: '',
          type: 'text' // optional
        }
      }).onOk(async (name) => {
        await NewDocument(name, "module")
      });
    }

    function onNewSolution() {
      $q.dialog({
        title: "New Solution",
        message: "Enter solution name",
        prompt: {
          model: '',
          type: 'text' // optional
        }
      }).onOk(async (name) => {
        await NewDocument(name, "solution")
      });
    }

    function onNewSimulation() {
      $q.dialog({
        title: "New Simulation",
        message: "Enter simulation name",
        prompt: {
          model: '',
          type: 'text' // optional
        }
      }).onOk(async (name) => {
        await NewDocument(name, "simulation")
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
      onNewModule,
      onNewSolution,
      onNewSimulation,
      openHelp,
    };
  },
};
</script>
