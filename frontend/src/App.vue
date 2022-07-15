<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useMonitorStore } from './stores/monitor-store'
import { useProjectStore } from './stores/project-store'

export default defineComponent({
  name: 'App',
  setup() {
    console.log('App.setup')
    const monitor = useMonitorStore()
    monitor.init()
    const project = useProjectStore()
    project.init()
    return {
      monitor,
      project,
    }
  },
})
</script>
