<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="q-dark">
      <q-toolbar>
        <q-icon name="img:icons/appicon-96x96.png" color="red-7" size="md" />
        <q-toolbar-title>ApiGear Studio</q-toolbar-title>
        <q-space />
        <q-btn-dropdown flat class="text-primary" label="New Document" dropdown-icon="add_box">
          <q-list class="q-pa-md">
            <q-item clickable v-close-popup @click="onNewDocument('module')" class="text-primary">
              <q-item-section avatar>
                <q-icon name="api" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Module</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onNewDocument('solution')" class="text-primary">
              <q-item-section avatar>
                <q-icon name="chair" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solution</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onNewDocument('scenario')" class="text-primary">
              <q-item-section avatar>
                <q-icon name="av_timer" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Simulation</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-btn-group flat class="text-primary">
          <q-btn icon="swap_horiz" :label="store.project.name" to="/">
            <q-tooltip>Switch projects</q-tooltip>
          </q-btn>
          <q-btn icon="sync" label="Sync" @click="onSync()">
            <q-tooltip>Sync project folder</q-tooltip>
          </q-btn>
          <q-btn icon="folder_open" label="Open" @click="openProjectDirectory()">
            <q-tooltip>Open project folder</q-tooltip>
          </q-btn>
          <q-btn icon="help" label="Help" @click="openHelp">
            <q-tooltip>Help</q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-splitter v-model="splitterModel" :limits="[120, Infinity]" unit="px">
        <template v-slot:before>
          <q-tabs vertical>
            <q-route-tab v-for="mode in modes" :key="mode.icon" :icon="mode.icon" :label="mode.title" :to="mode.to"
              active-class="text-primary"></q-route-tab>
          </q-tabs>
        </template>
        <template v-slot:after>
          <router-view />
        </template>
      </q-splitter>
    </q-page-container>

    <q-footer class="bg-grey-10">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useGtm } from '@gtm-support/vue-gtm';
import { onMounted, ref } from 'vue';
import { NewDocument } from '../wailsjs/go/main/App';
import { useProjectStore } from '../stores/project-store';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import AppFooter from '../components/AppFooter.vue';

const $gtm = useGtm();

const modes = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/projects/dashboard',
  },
  {
    title: 'Modules',
    icon: 'api',
    to: '/projects/modules',
  },
  {
    title: 'Solutions',
    icon: 'chair',
    to: '/projects/solutions',
  },
  {
    title: 'Templates',
    icon: 'auto_fix_normal',
    to: '/projects/templates',
  },
  {
    title: 'Simulation',
    icon: 'av_timer',
    to: '/projects/simulations',
  },
  {
    title: 'Monitor',
    icon: 'data_object',
    to: '/projects/monitor',
  },
  {
    title: 'Logs',
    icon: 'view_list',
    to: '/projects/logs',
  },
  {
    title: 'Settings',
    icon: 'settings',
    to: '/projects/settings',
  },
];

const $q = useQuasar();

async function onSync() {
  await store.sync();
}

const splitterModel = ref(120);

const store = useProjectStore();

onMounted(store.sync);

const openProjectDirectory = () => {
  $gtm.trackEvent({ event: 'open-project-directory', category: 'project', action: 'open-project-directory' });
  try {
    BrowserOpenURL(store.project.path);
  } catch (e) {
    $q.notify({
      type: 'negative',
      text: 'Could not open project directory',
    });
  }
};

const openHelp = () => {
  $gtm.trackEvent({ event: 'open-help', category: 'project', action: 'open-help' });
  try {
    BrowserOpenURL('https://apigear.io/');
  } catch (e) {
    $q.notify({
      type: 'negative',
      text: 'Could not open help',
    });
  }
};

function onNewDocument(docType) {
  $gtm.trackEvent({ event: 'new-document', category: 'project', action: 'new-document' });
  $q.dialog({
    persistent: true,
    title: `New ${docType}`,
    message: `Enter ${docType} name`,
    prompt: {
      model: '',
      type: 'text', // optional
    },
  }).onOk(async (name) => {
    try {
      console.log('new document', docType, name);
      const target = await NewDocument(docType, name);
      await store.sync();
      $q.notify({
        message: `Document ${target} created`,
        color: 'positive',
        icon: 'done',
      });
    } catch (e) {
      $q.notify({
        message: e,
        color: 'negative',
        icon: 'error',
      });
    }
  });
}
</script>
