<template>
  <router-view />
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
    const monitor = useMonitorStore();
    monitor.init();
    const project = useProjectStore();
    project.init();
    const logStore = useLogStore();
    logStore.init();
    const simuStore = useSimulationStore();
    simuStore.init();
    return {
      monitor,
      project,
    };
  },
});
</script>
