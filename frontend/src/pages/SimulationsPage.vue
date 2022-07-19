<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="av_timer" />
          <q-toolbar-title>Simulation Scenarios</q-toolbar-title>
          <q-space />
          <q-btn flat label="Messages" style="width: 120px" />
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
              <q-btn-group class="text-primary">
                <q-btn
                  class="text-primary"
                  label="Run"
                  icon="directions_run"
                  @click="runDocument(item)"
                />
                <q-btn
                  class="text-primary"
                  label="Edit"
                  icon="edit"
                  @click.stop="editDocument(item)"
                />
                <q-btn class="text-primary" icon="more_vert">
                  <q-menu fit>
                    <q-list style="min-width: 240px" class="q-pa-md">
                      <q-item
                        clickable
                        v-close-popup
                        @click="copyPath(item)"
                        dense
                        class="text-primary"
                      >
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
import { OpenSourceInEditor } from '../wailsjs/go/main/App';
import { useProjectStore } from '../stores/project-store';
import { main } from '../wailsjs/go/models';

const store = useProjectStore();

const $q = useQuasar();

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

function runDocument(doc: main.DocumentInfo) {
  console.log('runDocument', doc);
}

async function editDocument(doc: main.DocumentInfo) {
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
}

const copyPath = (doc: main.DocumentInfo) => {
  navigator.clipboard.writeText(doc.path);
};
</script>
