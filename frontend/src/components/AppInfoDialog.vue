<template>
  <q-dialog>
    <q-card style="width: 480px; max-width: 60vw">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title> ApiGear Studio {{ state.currentVersion }} </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list>
          <q-item v-if="state.isLatest">
            <q-item-section avatar>
              <q-avatar text-color="white" icon="cloud" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Great! You are using the latest version</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section avatar>
              <q-avatar text-color="white" icon="cloud" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Version {{ state.newVersion }} is available.</q-item-label>
            </q-item-section>
            <q-item-section side>              
              <q-btn color="primary" icon="update" label="Update" :disabled="state.isLatest"  @click="updateStudio"></q-btn>
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
import { reactive, onMounted } from 'vue';
import { CheckUpdate, VersionInfo } from '../wailsjs/go/main/App';

onMounted(async () => {
  const info = await VersionInfo();
  console.log(info);
  const rel = await CheckUpdate();
  console.log(rel);
  if (info != null) {
    state.currentVersion = info.version;
  }
  if (rel) {
    state.isLatest = false;
    state.newVersion = rel.version;
  }
});


const updateStudio = async () => {
  const rel = await CheckUpdate();
  if (rel) {
    window.open(rel.url, '_blank');
  }
};

const state = reactive({
  currentVersion: '9.9.9',
  newVersion: '9.9.9',
});

</script>
