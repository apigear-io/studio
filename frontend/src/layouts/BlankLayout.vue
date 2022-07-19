<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="q-dark">
      <router-view />
    </q-page-container>
    <q-footer class="bg-grey-10">
      <div class="row">
        <q-btn flat size="md" label="(c) 2020 ApiGear Studio" />
        <q-space />
        <q-btn flat size="md" label="v 2020.3" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BlankLayout',

  components: {},

  setup() {
    return {};
  },
});
</script>
