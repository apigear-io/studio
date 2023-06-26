<template>
<q-dialog v-model="alert">
  <q-card>
    <q-card-section>
      <q-card-title>Install Template</q-card-title>
    </q-card-section>
    <q-card-section>
      <q-input v-model="state.name" label="Name" />
      <q-input v-model="state.version" label="Version" />
      <q-space />
      <q-btn-group flat>
        <q-btn label="Cancel" @click="alert = false" />
        <q-btn label="Install" @click="alert = false" />
      </q-btn-group>
    </q-card-section>
  </q-card>
</q-dialog>
</template>

<script setup lang="ts">
import { main } from '../wailsjs/go/models';

const props = defineProps<{
  item: main.RepoInfo,
}>();

import { ref } from 'vue';
const alert = ref(false);
const state = ref({
  name: props.item.name,
  version: '',
});
</script>
