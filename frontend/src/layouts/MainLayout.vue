<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> ApiGear Studio </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-tabs vertical>
        <q-route-tab
          v-for="mode in modes"
          :key="mode.icon"
          :icon="mode.icon"
          :label="mode.title"
          :to="mode.to"
        ></q-route-tab>
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

const modes = [
  {
    title: "Dashboard",
    icon: "school",
    to: "/",
  },
  {
    title: "Modules",
    icon: "school",
    to: "/modules",
  },
  {
    title: "Solutions",
    icon: "school",
    to: "/solutions",
  },
  {
    title: "Simulation",
    icon: "school",
    to: "/simulations",
  },
  {
    title: "Logs",
    icon: "school",
    to: "/logs",
  },
  {
    title: "Settings",
    icon: "school",
    to: "/settings",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      modes: modes,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
