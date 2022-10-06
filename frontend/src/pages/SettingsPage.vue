<template>
  <q-page padding>
    <q-card flat>
      <q-card-section>
        <q-toolbar class="bg-primary text-white">
          <q-btn flat icon="settings" />
          <q-toolbar-title>Settings</q-toolbar-title>
          <q-space />
        </q-toolbar>
        <q-toolbar inset class="bg-primary">
          <q-tabs v-model="tab" inline-label align="left">
            <q-tab name="connect" icon="link" label="Connection" />
            <q-tab name="app" icon="terminal" label="Application" />
          </q-tabs>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-tab-panels v-model="tab">
          <q-tab-panel name="connect">
            <q-toolbar>
              <q-btn flat dense icon="link" />
              <q-toolbar-title> Connection Settings </q-toolbar-title>
              <q-space />
              <q-btn :disable="dirty === false" color="primary" icon="restart_alt" label="Apply Changes" @click="applyChanges()" />
            </q-toolbar>
            <q-toolbar inset>
              <div class="text-subtitle2">Network settings for monitoring and simulation</div>
            </q-toolbar>
            <q-card>
              <q-card-section>
                <q-input standout v-model="serverPort" type="text" label="Server Port" hint="Port for monitor and simulation server." />
                <q-card-section> </q-card-section>
                <q-input standout v-model="monitorAddress" type="text" label="Monitor Address" readonly />
                <q-card-section> </q-card-section>
                <q-input standout v-model="simulationAddress" type="text" label="Simulation Address" readonly />
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="app">
            <q-toolbar>
              <q-btn flat dense icon="terminal" />
              <q-toolbar-title> Application Settings </q-toolbar-title>
              <q-space />
              <q-btn :disable="dirty === false" color="primary" icon="restart_alt" label="Apply Changes" @click="applyChanges()" />
            </q-toolbar>
            <q-toolbar inset>
              <div class="text-subtitle2">General application settings</div>
            </q-toolbar>
            <q-card>
              <q-card-section>
                <q-select standout v-model="updateValue" :options="updateOptions" option-value="value" label="Update Channel" filled />
              </q-card-section>
              <q-card-section>
                <q-input standout v-model="editorCommand" type="text" label="Editor Command" />
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
import { useGtm } from '@gtm-support/vue-gtm';
import { onMounted, ref, watch } from 'vue';

const $q = useQuasar();
const $gtm = useGtm();

const updateOptions = ['stable', 'beta', 'dev'];

const applyChanges = async () => {
  await saveSettings();
  dirty.value = false;
  if (portChanged.value === true) {
    $q.dialog({
      title: 'Port changed. Restart required',
      message: 'You must restart the application to apply the changes.',
      cancel: true,
      persistent: true,
    }).onOk(() => {
      $gtm?.trackEvent({ event: 'restart', category: 'settings' });
      RestartApp();
    });
  }
};

const saveSettings = async () => {
  $gtm?.trackEvent({
    event: 'save_settings',
    category: 'settings',
    action: 'save_settings',
  });
  const settings = {
    server_port: serverPort.value,
    update_channel: updateValue.value,
    editor_command: editorCommand.value,
  };
  await WriteSettings(settings);
  $q.notify({
    message: 'Settings saved',
    color: 'positive',
    icon: 'check',
  });
};

const serverPort = ref('8080');
const updateValue = ref('stable');
const editorCommand = ref('');
const monitorAddress = ref('');
const simulationAddress = ref('');
const tab = ref('connect');
const dirty = ref(false);
const portChanged = ref(false);

onMounted(async () => {
  console.log('onMounted, dirty=false');
  const settings = await ReadSettings();
  serverPort.value = settings.server_port;
  updateValue.value = settings.update_channel;
  editorCommand.value = settings.editor_command;
  monitorAddress.value = await GetMonitorAddress();
  simulationAddress.value = await GetSimulationAddress();
  dirty.value = false;
  portChanged.value = false;
});
watch(serverPort, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    dirty.value = true;
    portChanged.value = true;
  }
});
watch(updateValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    dirty.value = true;
  }
});
watch(editorCommand, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    dirty.value = true;
  }
});
</script>
