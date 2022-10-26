<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="dashboard" />
          <q-toolbar-title>Dashboard</q-toolbar-title>
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item v-ripple clickable v-for="item in store.documents" :key="item.path" @click="openDocument(item)">
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn class="text-primary" label="Edit" icon="edit_note" @click.stop="editDocument(item)" />
                <q-btn class="text-primary" label="Check" icon="check" @click.stop="checkDocument(item)" />
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
import { OpenSourceInEditor, CheckDocument } from '../wailsjs/go/main/App';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/project-store';
import { main } from '../wailsjs/go/models';
import { useGtm } from '@gtm-support/vue-gtm';
const router = useRouter();
const $q = useQuasar();
const store = useProjectStore();
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

const openDocument = async (doc: main.DocumentInfo) => {
  $gtm?.trackEvent({
    event: 'open_document',
    category: 'dashboard',
    action: 'open_document',
  });
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
      router.push('/projects/solutions/');
      break;
    case 'scenario':
      router.push('/projects/simulations/');
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
  $gtm?.trackEvent({
    event: 'edit_document',
    category: 'dashboard',
    action: 'edit_document',
  });
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

const checkDocument = async (doc: main.DocumentInfo) => {
  console.log('checkDocument', doc);
  $gtm?.trackEvent({
    event: 'check_document',
    category: 'dashboard',
    action: 'check_document',
  });
  const result = await CheckDocument(doc.path);
  if (result.is_valid) {
    $q.notify({
      message: `Document ${doc.name} is valid`,
      color: 'positive',
      icon: 'info',
    });
  } else {
    $q.notify({
      caption: result.errors.join('\n'),
      message: 'Document has errors',
      color: 'negative',
      icon: 'error',
    });
  }
};
</script>
