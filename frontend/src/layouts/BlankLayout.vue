<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="q-dark">
      <router-view />
    </q-page-container>
    <q-footer class="bg-grey-10 shadow-4">
      <div class="row">
        <q-btn flat size="md" label="(c) 2022 ApiGear Studio" />
        <q-space />
        <q-btn flat size="md" label="v 2020.3" @click="openAppInfo()" />
        <q-space />
        <q-btn flat size="md" label="Discussions" @click="openDiscussions()" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import AppInfoDialog from '../components/AppInfoDialog.vue';
import { BrowserOpenURL } from '../wailsjs/runtime/runtime';
import { useQuasar } from 'quasar';

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
</script>
