<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="chair"/>
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
              <q-item-label caption lines="2">{{ item.path }} <q-badge v-if="watched.files[item.path]" color="positive">auto</q-badge> </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn class="text-primary" label="Run" icon="directions_run" @click="runDocument(item)" />
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
                          <q-item-label v-if="watched.files[item.path]">Stop Auto Run</q-item-label>
                          <q-item-label v-else>Start Auto Run</q-item-label>
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
    <q-dialog v-model="showLogs" position="bottom">
      <q-card style="width: 800px; max-width: 80vw; max-height: 60vh" class="fit">
        <q-card-section class="fit">
          <q-table :rows="logs.list" :columns="columns" row-key="timestamp" dense flat :pagination="pagination" class="fit" :filter-method="filter">
            <template v-slot:body="props">
              <q-tr :props="props" @click="props.expand = !props.expand">
                <q-td v-for="col in props.cols" :key="col.name" :props="props" :class="rowClass(props.row)">
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand">
                <q-td colspan="100%" class="text-caption">
                  <vue-json-pretty :data="props.row" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
import { useGtm } from '@gtm-support/vue-gtm';
import { useProjectStore } from '../stores/project-store';
import { main } from '../wailsjs/go/models';
import { onUnmounted, reactive, ref } from 'vue';
import { useLogStore, ILogEvent } from '../stores/log-store';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const store = useProjectStore();
const logs = useLogStore();
const $q = useQuasar();
const $gtm = useGtm();
const showLogs = ref(false);

const topics = ['app', 'gen', 'sol'];
const filter = function (rows: readonly any[]): readonly any[] {
  return rows.filter((row) => row.level != 'info' || topics.includes(row.topic));
};

const columns: QTableProps['columns'] = [
  { name: 'level', label: 'Level', field: 'level', align: 'left' },
  { name: 'topic', label: 'Topic', field: 'topic', align: 'left' },
  { name: 'message', label: 'Messages', field: 'message', align: 'left' },
];

const pagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 15,
};

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

function rowClass(item: ILogEvent): string {
  switch (item.level) {
    case 'info':
      return 'text-info';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-negative';
    default:
      return '';
  }
}

onUnmounted(() => {
  showLogs.value = false;
  logs.stopRecordGenLogs();
});

const runDocument = async (item: main.DocumentInfo) => {
  $gtm?.trackEvent({ event: 'run_document', category: 'solutions', action: 'run_document' });
  console.log('runDocument', item.path);
  logs.clear();
  try {
    showLogs.value = true;
    logs.startRecordGenLogs(); // should be clear, not stop, we should always log the latest messages
    await RunSolution(item.path);
    showLogs.value = true;
  } catch (e) {
    showLogs.value = true;
    console.error(e);
  }
};

const editDocument = async (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({ event: 'edit_document', category: 'solutions', action: 'edit_document' });
  console.log('editDocument', doc);
  try {
    $q.notify({
      message: `Opening ${doc.name} in editor`,
      type: 'info',
    });
    await OpenSourceInEditor(doc.path);
  } catch {
    $q.notify({
      message: `Failed to open ${doc.name}`,
      type: 'negative',
    });
  }
};

function closeDialog() {
  showLogs.value = false;
}

const watched = reactive({ files: {} as { [key: string]: boolean } });

const toggleAutoRun = async (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({ event: 'toggle_auto_run', category: 'solutions', action: 'toggle_auto_run' });
  const isWatched = watched.files[doc.path] || false;
  console.log('toggle watch: ', doc.path, isWatched, !isWatched);
  try {
    await WatchSolution(doc.path, !isWatched);
    watched.files[doc.path] = !isWatched;
    showLogs.value = !isWatched;
    console.log('watched', watched.files);
  } catch (e) {
    console.error(e);
    $q.notify({
      type: 'negative',
      message: `Failed to ${!isWatched ? 'enable' : 'disable'} auto run for ${doc.name}`,
    });
  }
};

const copyPath = (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({ event: 'copy_path', category: 'solutions', action: 'copy_path' });
  navigator.clipboard.writeText(doc.path);
};
</script>
