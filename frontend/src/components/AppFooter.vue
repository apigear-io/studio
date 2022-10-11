<template>
  <div class="row">
    <q-btn
      size="sm"
      flat
      icon="api"
      label="ApiGear Studio"
      color="blue-grey-4"
      @click="openProductInfo()"
    />
    <q-space />
    <q-btn
      size="sm"
      flat
      icon="info"
      :label="state.version"
      color="blue-grey-4"
      @click="openAppInfo()"
    />
    <q-space />
    <q-btn
      size="sm"
      flat
      icon="forum"
      label="Discussions"
      color="blue-grey-4"
      @click="openDiscussions()"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import AppInfoDialog from '../components/AppInfoDialog.vue';
import { CheckUpdate, VersionInfo } from '../wailsjs/go/main/App';
import { onMounted, reactive } from 'vue';
const $q = useQuasar();


const state = reactive({
  showAppInfo: false as boolean,
  version: '9.9.9',
})
onMounted(async () => {
  try {
    const info = await VersionInfo()
    const rel = await CheckUpdate();
    console.log('relInfo', rel);
    if (info != null) {
      state.version = info.version
    }
    if (rel) {
      openAppInfo();
      $q.notify({
        message: `New version ${rel.version} is available.`,
        color: 'positive',
        icon: 'info',
      });
    }
  } catch(err) {
    $q.notify({
      color: 'negative',
      message: 'Failed to check for updates: ' + err,
      icon: 'error',
    });
  }
});

const openAppInfo = () => {
  $q.dialog({
    title: 'App Info',
    component: AppInfoDialog,
  });
};

const openDiscussions = () => {
  try {
    BrowserOpenURL('https://github.com/orgs/apigear-io/discussions');
  } catch (err) {
    $q.notify({
      message: 'Failed to open discussions: ' + err,
      color: 'negative',
      icon: 'error',
    });
  }
};

const openProductInfo = () => {
  try {
    BrowserOpenURL('https://apigear.io/');
  } catch (e) {
    $q.notify({
      message: String(e),
      color: 'negative',
      icon: 'error',
    });
  }
};
</script>

<style lang="scss" scoped></style>
