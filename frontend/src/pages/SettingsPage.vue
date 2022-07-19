<template>
  <q-page padding>
    <q-card flat>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="settings" />
          <q-toolbar-title>Settings</q-toolbar-title>
          <q-space />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-2">
            <q-tabs v-model="state.tab" vertical active-class="text-primary">
              <q-tab name="connect" icon="link" label="Connection" />
              <q-tab name="app" icon="terminal" label="Application" />
            </q-tabs>
          </div>
          <div class="col-6">
            <q-tab-panels v-model="state.tab">
              <q-tab-panel name="connect">
                <q-toolbar>
                  <q-btn flat dense icon="link" />
                  <q-toolbar-title> Connection Settings </q-toolbar-title>
                </q-toolbar>
                <q-toolbar inset>
                  <div class="text-subtitle2">
                    Network settings for monitoring and simulation
                  </div>
                </q-toolbar>
                <q-card>
                  <q-card-section>
                    <q-input
                      standout
                      v-model="state.serverPort"
                      type="number"
                      label="Server Port"
                      hint="port for the server"
                      debounce="500"
                    />
                    <q-card-section> </q-card-section>
                    <q-input
                      standout
                      v-model="state.monitorAddress"
                      type="text"
                      label="Monitor Address"
                      readonly
                      debounce="500"
                    />
                    <q-card-section> </q-card-section>
                    <q-input
                      standout
                      v-model="state.simulationAddress"
                      type="text"
                      label="Simulation Address"
                      readonly
                      debounce="500"
                    />
                  </q-card-section>
                </q-card>
              </q-tab-panel>
              <q-tab-panel name="app">
                <q-toolbar>
                  <q-btn flat dense icon="terminal" />
                  <q-toolbar-title> Application Settings </q-toolbar-title>
                </q-toolbar>
                <q-toolbar inset>
                  <div class="text-subtitle2">
                    Network settings for monitoring and simulation
                  </div>
                </q-toolbar>
                <q-card>
                  <q-card-section>
                    <q-select
                      standout
                      v-model="state.updateValue"
                      :options="updateOptions"
                      option-value="value"
                      label="Update Channel"
                      filled
                    />
                  </q-card-section>
                  <q-card-section>
                    <q-input
                      standout
                      v-model="state.editorCommand"
                      type="text"
                      label="Editor Command"
                      debounce="500"
                    />
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

<script setup lang="ts">
import {
  ReadSettings,
  WriteSettings,
  GetMonitorAddress,
  GetSimulationAddress,
} from '../wailsjs/go/main/App';
import { useQuasar } from 'quasar';
import { onMounted, reactive, watchEffect } from 'vue';

const $q = useQuasar();

const updateOptions = ['stable', 'beta', 'dev'];

const ifValidUpdateOption = (value: string) => {
  console.log(value);
  const values = ['stable', 'beta', 'dev'];
  return values.includes(value);
};

const state = reactive({
  serverPort: '',
  updateValue: 'stable',
  editorCommand: '',
  monitorAddress: '',
  simulationAddress: '',
  tab: 'connect',
});

onMounted(async () => {
  const settings = await ReadSettings();
  state.serverPort = String(settings.server_port);
  state.updateValue = settings.update_channel;
  state.editorCommand = settings.editor_command;
  state.monitorAddress = (await GetMonitorAddress()) as string;
  state.simulationAddress = (await GetSimulationAddress()) as string;
});
watchEffect(async () => {
  const port = parseInt(state.serverPort);
  if (isNaN(port)) {
    $q.notify('Server port must be a number');
    return;
  }
  // check if server port is in range
  if (port < 1024 || port > 65535) {
    $q.notify('Server port must be in range 1024-65535');
    return;
  }
  if (ifValidUpdateOption(state.updateValue) === false) {
    $q.notify('Update channel must be stable, beta or dev');
    return;
  }
  const settings = {
    server_port: Number(state.serverPort),
    update_channel: state.updateValue,
    editor_command: state.editorCommand,
  };
  await WriteSettings(settings);
  $q.notify({
    message: 'Settings saved',
    color: 'positive',
    icon: 'check',
  });
});
</script>
