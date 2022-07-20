<template>
  <q-dialog>
    <q-card style="width: 480px; max-width: 60vw">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title>
          ApiGear Studio {{ state.info.version }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list>
          <q-item v-if="state.info.isLatest">
            <q-item-section avatar>
              <q-avatar text-color="white" icon="cloud" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                >Great! You are using the latest version</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section avatar>
              <q-avatar text-color="white" icon="cloud" />
            </q-item-section>
            <q-item-section>
              <q-item-label>A new version is available.</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="download" label="Download"></q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Close" flat color="primary" v-close-popup />
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
    latest: '1.1',
    isLatest: true,
  },
});
</script>
