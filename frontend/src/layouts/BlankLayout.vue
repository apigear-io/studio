<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      <div class="row">
        <q-btn flat size="sm" label="(c) 2020 ApiGear Studio" />
        <q-space />
        <q-btn flat size="sm" label="v 2020.3" />
        </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";


export default defineComponent({
  name: "BlankLayout",

  components: {},

  setup() {

    return {
    };
  },
});
</script>
