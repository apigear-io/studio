<template>
  <q-layout>
    <q-page-container class="q-dark">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMonitorStore } from './stores/monitor-store';
import { useProjectStore } from './stores/project-store';
import { useLogStore } from './stores/log-store';
import { useSimulationStore } from './stores/simulation-store';

export default defineComponent({
  name: 'App',
  setup() {
    console.log('App.setup');
    const monitorStore = useMonitorStore();
    monitorStore.init();
    const projectStore = useProjectStore();
    projectStore.init();
    const logStore = useLogStore();
    logStore.init();
    const simuStore = useSimulationStore();
    simuStore.init();
    return {
      monitorStore,
      projectStore,
      logStore,
      simuStore,
    };
  },
});
</script>
