<template>
  <div class="row">
    <q-btn flat size="md" label="(c) 2022 ApiGear Studio" @click="openHelp()" />
    <q-space />
    <q-btn flat size="md" label="v 2020.3" @click="openAppInfo()" />
    <q-space />
    <q-btn flat size="md" label="Discussions" @click="openDiscussions()" />
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

const openHelp = () => {
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
