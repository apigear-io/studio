<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="av_timer"/>
          <q-toolbar-title>Simulation Scenarios</q-toolbar-title>
          <q-space />
          <q-btn flat icon="av_timer" label="Events" style="width: 120px" to="/projects/simulations/messages" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item v-ripple v-for="item in store.scenarios" :key="item.path">
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group class="text-primary" flat>
                <q-btn v-if="simu.running[item.path]" class="text-primary" label="Stop" icon="stop" @click="stopDocument(item)" />
                <q-btn v-else class="text-primary" label="Play" icon="play_arrow" @click="runDocument(item)" />
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
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useGtm } from '@gtm-support/vue-gtm';
import { OpenSourceInEditor, StartScenario, StopScenario } from '../wailsjs/go/main/App';
import { useProjectStore } from '../stores/project-store';
import { useSimulationStore } from '../stores/simulation-store';
import { main } from '../wailsjs/go/models';

const store = useProjectStore();
const simu = useSimulationStore();
const $q = useQuasar();
const $gtm = useGtm();
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

const runDocument = async (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({
    event: 'run_document',
    category: 'simulations',
    action: 'run_document',
  });
  console.log('runDocument', doc);
  try {
    await StartScenario(doc.path);
    simu.start(doc.path)
    $q.notify({
      color: 'positive',
      message: "Scenario '" + doc.name + "' started",
      icon: 'info',
    });
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: String(err),
      icon: 'error',
    });
  }
};

const stopDocument = async (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({
    event: 'stop_document',
    category: 'simulations',
    action: 'stop_document',
  });
  console.log('stopDocument', doc);
  try {
    await StopScenario(doc.path);
    simu.stop(doc.path)
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: String(err),
      icon: 'error',
    });
  }
};

async function editDocument(doc: main.DocumentInfo) {
  $gtm?.trackEvent({
    event: 'edit_document',
    category: 'simulations',
    action: 'edit_document',
  });
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
      message: `open ${doc.name}`,
      color: 'negative',
      icon: 'error',
    });
  }
}

const copyPath = (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({
    event: 'copy_path',
    category: 'simulations',
    action: 'copy_path',
  });
  navigator.clipboard.writeText(doc.path);
};
</script>
