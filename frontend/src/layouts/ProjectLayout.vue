<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="q-dark shadow-4">
      <q-toolbar>
        <q-icon name="api" color="red-7" size="md" />
        <q-toolbar-title>ApiGear Studio</q-toolbar-title>
        <q-space />
        <q-btn-dropdown
          flat
          class="text-primary"
          label="New Document"
          dropdown-icon="add_box"
        >
          <q-list class="q-pa-md">
            <q-item
              clickable
              v-close-popup
              @click="onNewDocument('module')"
              class="text-primary"
            >
              <q-item-section avatar>
                <q-icon name="api" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Module</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="onNewDocument('solution')"
              class="text-primary"
            >
              <q-item-section avatar>
                <q-icon name="chair" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Solution</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-close-popup
              @click="onNewDocument('scenario')"
              class="text-primary"
            >
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
          <q-btn icon="sync" @click="onSync()">
            <q-tooltip>Sync project folder</q-tooltip>
          </q-btn>
          <q-btn icon="content_copy" @click="copyProjectPath()">
            <q-tooltip>Copy project location to clipboard</q-tooltip>
          </q-btn>
          <q-btn icon="help" @click="openHelp">
            <q-tooltip>Help</q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="row q-dark-page shadow-4">
        <div class="col-2 q-py-md shadow-4 accent shadow-4">
          <q-tabs vertical>
            <q-route-tab
              v-for="mode in modes"
              :key="mode.icon"
              :icon="mode.icon"
              :label="mode.title"
              :to="mode.to"
              active-class="text-primary"
              exact
            ></q-route-tab>
          </q-tabs>
        </div>
        <div class="col-10">
          <router-view />
        </div>
      </div>
    </q-page-container>

    <q-footer class="bg-grey-10 shadow-4">
      <div class="row">
        <q-btn flat size="md" label="(c) 2020 ApiGear Studio" />
        <q-space />
        <q-btn flat size="md" label="v 2020.3" @click="openAppInfo()" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { NewDocument } from '../wailsjs/go/main/App';
import { useProjectStore } from '../stores/project-store';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import AppInfoPanel from '../components/AppInfoPanel.vue';

const modes = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/projects/',
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

const store = useProjectStore();

onMounted(store.sync);

const openAppInfo = () => {
  $q.dialog({
    title: 'App Info',
    component: AppInfoPanel,
  });
};

function copyProjectPath() {
  navigator.clipboard.writeText(store.project.path);
  $q.notify({
    message: `${store.project.path} copied to clipboard`,
    color: 'positive',
    icon: 'done',
    timeout: 2000,
  });
}

function openHelp() {
  try {
    BrowserOpenURL('https://docs.apigear.io/');
  } catch (e) {
    $q.notify({
      message: e,
      color: 'negative',
      icon: 'error',
    });
  }
}

function onNewDocument(docType) {
  $q.dialog({
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
