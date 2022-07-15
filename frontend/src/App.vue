<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useAppStore } from './stores/app-store'

export default defineComponent({
  name: 'App',
  setup() {
    console.log('App.setup')
    const app = useAppStore()
    app.startMonitoring()
    return {
      app,
    }
  },
})
</script>
