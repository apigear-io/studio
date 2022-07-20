<template>
  <q-dialog>
    <q-card style="width: 320px; max-width: 40vw">
      <q-toolbar>
        <q-toolbar-title>Application Information</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list>
          <q-item v-for="(value, key) in state.info" :key="key">
            <q-item-section>
              <q-item-label>{{ key }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label>{{ value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Update" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive } from 'vue';

const state = reactive({
  info: {
    version: '1.0',
    os: 'Linux',
  },
});
</script>
