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
      :label="verInfo?.version"
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
import { onMounted } from 'vue';
import { main } from 'src/wailsjs/go/models';
const $q = useQuasar();

let relInfo: main.ReleaseInfo | null = null
let verInfo: main.VersionInfo | null = null

onMounted(async () => {
  try {
    verInfo = await VersionInfo()
    relInfo = await CheckUpdate();
    if (relInfo) {
      openAppInfo();
      $q.notify({
        message: `New version ${relInfo.version} is available.`,
        color: 'positive',
        icon: 'info',
      });
    }
  } catch(err) {
    // $q.notify({
    //   color: 'negative',
    //   message: 'Failed to check for updates: ' + err,
    //   icon: 'error',
    // });
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
