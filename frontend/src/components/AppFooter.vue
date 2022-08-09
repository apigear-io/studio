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
      label="v2020.3"
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

<script setup>
import { useQuasar } from 'quasar';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import AppInfoDialog from '../components/AppInfoDialog.vue';

const $q = useQuasar();

const openAppInfo = () => {
  $q.dialog({
    title: 'App Info',
    component: AppInfoDialog,
  });
};

const openDiscussions = () => {
  try {
    BrowserOpenURL('https://github.com/orgs/apigear-io/discussions');
  } catch (e) {
    $q.notify({
      message: e,
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
      message: e,
      color: 'negative',
      icon: 'error',
    });
  }
};
</script>

<style lang="scss" scoped></style>
