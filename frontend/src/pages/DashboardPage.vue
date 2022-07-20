<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="dashboard" />
          <q-toolbar-title>Dashboard</q-toolbar-title>
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item
            v-ripple
            clickable
            v-for="item in store.documents"
            :key="item.path"
            @click="openDocument(item)"
          >
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn
                  class="text-primary"
                  label="Edit"
                  icon="edit_note"
                  @click.stop="editDocument(item)"
                />
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
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/project-store';
import { main } from '../wailsjs/go/models';
const router = useRouter();
const $q = useQuasar();
const store = useProjectStore();

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

const openDocument = async (doc: main.DocumentInfo) => {
  console.log('openDocument', doc);
  $q.notify({
    message: `Opening ${doc.name}`,
    color: 'positive',
    icon: 'info',
  });
  switch (doc.type) {
    case 'module':
      router.push('/projects/modules/');
      break;
    case 'solution':
      router.push('/projects/solutions');
      break;
    case 'scenario':
      router.push('/projects/scenarios');
      break;
    default:
      $q.notify({
        message: `Unknown document type ${doc.type}`,
        color: 'negative',
        icon: 'error',
      });
  }
};
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
</script>
