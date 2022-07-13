<template>
  <q-page>
    <q-toolbar>
      <q-btn flat icon="settings"/>
      <q-toolbar-title>Settings</q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-card flat bordered class="q-ma-lg">
      <q-card-section>
        <q-card-label class="text-h6">Server</q-card-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model="serverPort" type="text" label="Server Port" hint="port for the server"/>
        <q-input v-model="monitorAddress" type="text" label="Monitor Address" hint="address for monitor calls" readonly/>
        <q-input v-model="simulationAddress" type="text" label="Simulation Address" hint="address for simulation calls" readonly/>
      </q-card-section>
      <q-separator/>
    </q-card>
    <q-card flat bordered class="q-ma-lg">
      <q-card-section>
        <q-card-label class="text-h6">Studio</q-card-label>
      </q-card-section>
      <q-card-section>
        <q-select v-model="updateValue" :options="updateOptions" label="Update Channel" filled />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ReadSettings, WriteSettings } from '../wailsjs/go/main/App'
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const $q = useQuasar()
    const serverPort = ref('')
    const monitorAddress = ref('')
    const simulationAddress = ref('')
    const updateValue = ref('')
    const updateOptions = [
      { label: 'Stable', value: 'stable' },
      { label: 'Beta', value: 'beta' },
      { label: 'Dev', value: 'dev' },
    ]
    onMounted(async () => {
      const settings = await ReadSettings()
      serverPort.value = settings.server_port
      monitorAddress.value = settings.monitor_address
      simulationAddress.value = settings.simulation_address
      updateValue.value = settings.update_channel
    })
    async function save() {
      await WriteSettings({
        server_port: serverPort.value,
        monitor_address: monitorAddress.value,
        simulation_address: simulationAddress.value,
        update_channel: updateValue.value,
      })
      $q.notify({
        message: 'Settings saved',
        color: 'positive',
        icon: 'check'
      })
    }
    return {
      serverPort,
      monitorAddress,
      simulationAddress,
      updateValue,
      updateOptions,
      save,
    }
  }

}
</script>
