<template>
  <q-page padding>
    <q-card flat>
      <q-card-section>
        <q-toolbar class="bg-primary text-white">
          <q-btn flat icon="settings" />
          <q-toolbar-title>Settings</q-toolbar-title>
          <q-space />
          <q-btn flat icon="save" label="Save" @click="saveSettings()" />
          <q-btn flat icon="restart_alt" label="Restart" @click="restartApp()" />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
        <q-toolbar inset class="bg-primary">
          <q-tabs v-model="state.tab" inline-label align="left">
            <q-tab name="connect" icon="link" label="Connection" />
            <q-tab name="app" icon="terminal" label="Application" />
          </q-tabs>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-tab-panels v-model="state.tab">
          <q-tab-panel name="connect">
            <q-toolbar>
              <q-btn flat dense icon="link" />
              <q-toolbar-title> Connection Settings </q-toolbar-title>
            </q-toolbar>
            <q-toolbar inset>
              <div class="text-subtitle2">Network settings for monitoring and simulation</div>
            </q-toolbar>
            <q-card>
              <q-card-section>
                <q-input standout v-model="state.serverPort" type="text" label="Server Port" hint="Port for monitor and simulation server. Please restart app, when changing this setting." debounce="500" />
                <q-card-section> </q-card-section>
                <q-input standout v-model="state.monitorAddress" type="text" label="Monitor Address" readonly debounce="500" />
                <q-card-section> </q-card-section>
                <q-input standout v-model="state.simulationAddress" type="text" label="Simulation Address" readonly debounce="500" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="app">
            <q-toolbar>
              <q-btn flat dense icon="terminal" />
              <q-toolbar-title> Application Settings </q-toolbar-title>
            </q-toolbar>
            <q-toolbar inset>
              <div class="text-subtitle2">Network settings for monitoring and simulation</div>
            </q-toolbar>
            <q-card>
              <q-card-section>
                <q-select standout v-model="state.updateValue" :options="updateOptions" option-value="value" label="Update Channel" filled />
              </q-card-section>
              <q-card-section>
                <q-input standout v-model="state.editorCommand" type="text" label="Editor Command" debounce="500" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ReadSettings, WriteSettings, GetMonitorAddress, GetSimulationAddress, RestartApp } from '../wailsjs/go/main/App';
import { useQuasar } from 'quasar';
import { onMounted, reactive, watchEffect } from 'vue';

const $q = useQuasar();

const updateOptions = ['stable', 'beta', 'dev'];

const restartApp = () => {
  RestartApp();
};

const saveSettings = async () => {
  const settings = {
    server_port: state.serverPort,
    update_channel: state.updateValue,
    editor_command: state.editorCommand,
  };
  await WriteSettings(settings);
  $q.notify({
    message: 'Settings saved',
    color: 'positive',
    icon: 'check',
  });
};

const state = reactive({
  serverPort: '',
  updateValue: 'stable',
  editorCommand: '',
  monitorAddress: '',
  simulationAddress: '',
  tab: 'connect',
  dirty: false,
});

onMounted(async () => {
  const settings = await ReadSettings();
  state.serverPort = settings.server_port;
  state.updateValue = settings.update_channel;
  state.editorCommand = settings.editor_command;
  state.monitorAddress = (await GetMonitorAddress()) as string;
  state.simulationAddress = (await GetSimulationAddress()) as string;
});
watchEffect(async () => {
  state.dirty = true;
});
</script>
