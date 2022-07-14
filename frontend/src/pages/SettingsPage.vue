<template>
  <q-page padding>
    <q-card flat>
      <q-card-section>
      <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="settings"/>
          <q-toolbar-title>Settings</q-toolbar-title>
          <q-space />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-2">
              <q-tabs v-model="tab" vertical active-class="text-primary">
                <q-tab name="connect" icon="link" label="Connection" no-caps/>
                <q-tab name="app" icon="terminal" label="Application" no-caps/>
              </q-tabs>
            </div>
            <div class="col-6">
              <q-tab-panels v-model="tab">
                <q-tab-panel name="connect">
                  <q-toolbar>
                    <q-btn flat dense icon="link" />
                    <q-toolbar-title>
                      Connection Settings
                    </q-toolbar-title>
                  </q-toolbar>
                  <q-toolbar inset>
                    <div class="text-subtitle2">Network settings for monitoring and simulation</div>
                  </q-toolbar>
                  <q-card>
                    <q-card-section>
                      <q-input standout v-model="serverPort" type="number" label="Server Port" hint="port for the server" debounce="500"/>
                    <q-card-section>
                    </q-card-section>
                      <q-input standout v-model="monitorAddress" type="text" label="Monitor Address" readonly debounce="500"/>
                    <q-card-section>
                    </q-card-section>
                      <q-input standout v-model="simulationAddress" type="text" label="Simulation Address" readonly debounce="500"/>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
                <q-tab-panel name="app">
                  <q-toolbar>
                    <q-btn flat dense icon="terminal" />
                    <q-toolbar-title>
                      Application Settings
                    </q-toolbar-title>
                  </q-toolbar>
                  <q-toolbar inset>
                    <div class="text-subtitle2">Network settings for monitoring and simulation</div>
                  </q-toolbar>
                  <q-card>
                    <q-card-section>
                      <q-select standout v-model="updateValue" :options="updateOptions" option-value="value" label="Update Channel" filled />
                    </q-card-section>
                    <q-card-section>
                      <q-input standout v-model="editorCommand" type="text" label="Editor Command" debounce="500"/>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ReadSettings, WriteSettings, GetMonitorAddress, GetSimulationAddress } from '../wailsjs/go/main/App'
import { useQuasar } from 'quasar'
import { ref, onMounted, watch } from 'vue'

function isValidUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "ws:" || url.protocol === "wss:";
}

function ifValidUpdateOption(value) {
  console.log(value)
  const values = ["stable", "beta", "dev"];
  return values.includes(value);
}

const updateOptions = [ 'stable', 'beta', 'dev' ];


export default {
  setup() {
    const tab = ref('connect')
    const $q = useQuasar()
    const serverPort = ref('')
    const monitorAddress = ref('')
    const simulationAddress = ref('')
    const updateValue = ref('')
    const editorCommand = ref('code')
    onMounted(async () => {
      const settings = await ReadSettings()
      serverPort.value = settings.server_port
      monitorAddress.value = await GetMonitorAddress()
      simulationAddress.value = await GetSimulationAddress()
      updateValue.value = settings.update_channel
      editorCommand.value = settings.editor_command
    })
    watch(() => {
      // convert server port to int
      const serverPortInt = parseInt(serverPort.value)
      if (isNaN(serverPortInt)) {
        $q.notify('Server port must be a number')
        return
      }
      // check if server port is in range
      if (serverPortInt < 1024 || serverPortInt > 65535) {
        $q.notify('Server port must be in range 1024-65535')
        return
      }
      // check if editor command is valid
      if (!/^[a-zA-Z0-9_]+$/.test(editorCommand.value)) {
        $q.notify('Editor command must be a valid command')
        return
      }
      // check if update channel is valid
      if (ifValidUpdateOption(updateValue.value) === false) {
        $q.notify('Update channel must be stable, beta or dev')
        return
      }
      // write settings
      WriteSettings({
        server_port: serverPortInt,
        update_channel: updateValue.value,
        editor_command: editorCommand.value,
      })
      $q.notify({
        message: 'Settings saved',
        color: 'positive',
        icon: 'check'
      })
    })
    return {
      tab,
      serverPort,
      monitorAddress,
      simulationAddress,
      updateValue,
      updateOptions,
      editorCommand,
    }
  }

}
</script>
