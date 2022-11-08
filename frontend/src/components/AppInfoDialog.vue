<template>
  <q-dialog>
    <q-card style="width: 640px; max-width: 60vw">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title> ApiGear Studio {{ state.currentVersion }} </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <div class="text-caption">ApiGear Studio is a free and open source tool for building and testing APIs developed
          by ApiGear see <code>https://www.apigear.io</code>.
          It is built on top of ApiGear, a free and open source API framework.</div>
        <div class="text-caption">The application is licensed under the Apache 2.0 License see
          <code>https://www.apache.org/licenses/LICENSE-2.0</code>.
          The source code is available on GitHub at <code>https://github.com/apigear-io.</code>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="text-caption"><code>Version: {{state.currentVersion}}</code></div>
        <div class="text-caption"><code>Commit: {{state.commit}}</code></div>
        <div class="text-caption"><code>Date: {{state.date}}</code></div>
      </q-card-section>
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
              <q-btn color="primary" icon="update" label="Update Studio" :disabled="state.isLatest"
                @click="updateStudio"></q-btn>
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
import { useQuasar } from 'quasar';
import { reactive, onMounted } from 'vue';
import { CheckUpdate, VersionInfo, UpdateProgram } from '../wailsjs/go/main/App';

const $q = useQuasar();

const state = reactive({
  currentVersion: '0.0.0',
  newVersion: '0.0.0',
  date: '2021-01-01',
  commit: '1234567890',
  url: '',
});

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
    state.commit = info.commit;
    state.date = info.date;
    state.url = rel.url;
  }
});


const updateStudio = async () => {
  try {
    $q.notify({
      message: 'Updating Studio...',
      spinner: true,
      type: 'positive',
      icon: 'cloud_download',
      timeout: 0,
    });
    await UpdateProgram(state.newVersion);
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: 'Failed to update: ' + err,
      icon: 'error',
    });
  }
};


</script>
