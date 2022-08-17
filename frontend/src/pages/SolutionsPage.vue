<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="chair" />
          <q-toolbar-title>SDK Solutions</q-toolbar-title>
          <q-space />
          <q-btn flat label="Summary" style="width: 120px" />
          <q-btn flat label="Messages" style="width: 120px" @click="showLogs = true" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item clickable v-ripple v-for="item in store.solutions" :key="item.path">
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }} {{ watched.files[item.path] === true ? '- auto run' : '' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn v-if="watched.files[item.path]" class="text-primary" label="Run" icon="autorenew" @click="runDocument(item)" />
                <q-btn v-else class="text-primary" label="Run" icon="directions_run" @click="runDocument(item)" />
                <q-btn class="text-primary" label="Edit" icon="edit_note" @click.stop="editDocument(item)" />
                <q-btn class="text-primary" icon="more_vert">
                  <q-menu fit>
                    <q-list style="min-width: 240px" class="q-pa-md">
                      <q-item clickable v-close-popup @click="copyPath(item)" dense class="text-primary">
                        <q-item-section avatar>
                          <q-icon name="file_copy" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Copy Path</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="toggleAutoRun(item)" dense class="text-primary">
                        <q-item-section avatar>
                          <q-icon name="autorenew" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Toggle Auto Run</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showLogs" position="bottom" auto-close>
      <q-card style="width: 640px; max-width: 80vw; height: 360px; max-height: 50vw">
        <q-card-section>
          <q-table title="Generator Report" :rows="logs.genLogs" :columns="columns" row-key="time" dense flat />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" @click="closeDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { OpenSourceInEditor, RunSolution, WatchSolution } from '../wailsjs/go/main/App';
import { useQuasar, QTableProps } from 'quasar';

import { useProjectStore } from '../stores/project-store';
import { main } from '../wailsjs/go/models';
import { onUnmounted, reactive, ref } from 'vue';
import { useLogStore } from '../stores/log-store';
const store = useProjectStore();
const logs = useLogStore();
const $q = useQuasar();

const showLogs = ref(false);

const columns: QTableProps['columns'] = [
  { name: 'time', label: 'Time', field: 'time', align: 'left' },
  { name: 'message', label: 'Messages', field: 'message', align: 'left' },
];

function icon(docType: string) {
  switch (docType) {
    case 'module':
      return 'api';
    case 'solution':
      return 'chair';
    case 'scenario':
      return 'av_timer';
  }
}

onUnmounted(() => {
  showLogs.value = false;
  logs.stopRecordGenLogs();
});

const runDocument = async (item: main.DocumentInfo) => {
  console.log('runDocument', item.path);
  try {
    showLogs.value = true;
    logs.startRecordGenLogs(); // should be clear, not stop, we should always log the latest messages
    await RunSolution(item.path);
  } catch (e) {
    showLogs.value = false;
    console.error(e);
    $q.notify({
      type: 'negative',
      message: `Failed to run solution: ${String(e)}`,
    });
  }
};

const editDocument = async (doc: main.DocumentInfo) => {
  console.log('editDocument', doc);
  try {
    $q.notify({
      message: `Opening ${doc.name} in editor`,
      color: 'positive',
      icon: 'info',
    });
    await OpenSourceInEditor(doc.path);
  } catch {
    $q.notify({
      message: `Failed to open ${doc.name}`,
      color: 'negative',
      icon: 'error',
    });
  }
};

function closeDialog() {
  logs.stopRecordGenLogs();
  showLogs.value = false;
}

const watched = reactive({ files: {} as { [key: string]: boolean } });

const toggleAutoRun = async (doc: main.DocumentInfo) => {
  const isWatched = watched.files[doc.path] || false;
  console.log('toggle watch: ', doc.path, isWatched, !isWatched);
  try {
    await WatchSolution(doc.path, !isWatched);
    watched.files[doc.path] = !isWatched;
    console.log('watched', watched.files);
  } catch (e) {
    console.error(e);
    $q.notify({
      message: `Failed to ${!isWatched ? 'enable' : 'disable'} auto run for ${doc.name}`,
      color: 'negative',
      icon: 'error',
    });
  }
};

const copyPath = (doc: main.DocumentInfo) => {
  navigator.clipboard.writeText(doc.path);
};
</script>
