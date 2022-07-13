<template>
  <q-page padding>
    <q-card>
      <q-card-section>
      <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="settings"/>
          <q-toolbar-title>Settings</q-toolbar-title>
          <q-space />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
        <q-toolbar inset class="bg-primary text-white">
          <q-tabs v-model="tab" align="left">
            <q-tab name="connect" icon="link" label="Connection" />
            <q-tab name="app" icon="terminal" label="Application" />
          </q-tabs>
        </q-toolbar>
        <q-tab-panels v-model="tab">
          <q-tab-panel name="connect">
            <q-card>
              <q-card-section>
                <div class="text-h6">Server Settings</div>
                <div class="text-subtitle2">Network settings for monitoring and simulation</div>
              </q-card-section>
              <q-card-section>
                <q-input v-model="serverPort" type="text" label="Server Port" hint="port for the server"/>
                <q-input v-model="monitorAddress" type="text" label="Monitor Address" hint="address for monitor calls" readonly/>
                <q-input v-model="simulationAddress" type="text" label="Simulation Address" hint="address for simulation calls" readonly/>
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="app">
            <q-card>
              <q-card-section>
                <div class="text-h6">Application Settings</div>
                <div class="text-subtitle2">General application settings</div>
              </q-card-section>
              <q-card-section>
                <q-select v-model="updateValue" :options="updateOptions" label="Update Channel" filled />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
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
    const tab = ref('connect')
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
      tab,
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
