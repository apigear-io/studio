<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="q-dark">
      <router-view />
    </q-page-container>
    <q-footer class="bg-grey-10 shadow-4">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup>
import AppFooter from '../components/AppFooter.vue';
</script>
