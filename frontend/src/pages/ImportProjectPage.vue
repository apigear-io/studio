<template>
  <q-page padding>
    <q-toolbar class="bg-primary">
      <q-btn flat round dense icon="folder_open" />
      <q-toolbar-title> Import Project </q-toolbar-title>
    </q-toolbar>
    <q-card class="q-ma-lg">
      <q-card-section>
        <q-input
          v-model="state.source"
          type="text"
          label="Source location"
          hint="select a local folder or enter a remote location as source for import"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="folder_open" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="state.target"
          type="text"
          label="Target location"
          hint="select a local folder as target"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="folder_open" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn dense flat color="primary" @click="importProject()">
          Import
        </q-btn>
        <q-btn dense flat color="primary" to="/"> Cancel </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ImportProject } from '../wailsjs/go/main/App';
import { useQuasar } from 'quasar';
import { reactive } from 'vue';

const $q = useQuasar();

const state = reactive({
  source: '',
  target: '',
});

async function importProject() {
  try {
    await ImportProject(state.source);
  } catch (e: any) {
    $q.notify({
      message: String(e),
      color: 'negative',
      icon: 'error',
    });
  }
}
</script>
