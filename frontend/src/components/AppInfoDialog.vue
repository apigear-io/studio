<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="width: 640px; max-width: 60vw" class="q-dialog-plugin">
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-toolbar-title> ApiGear Studio {{ state.currentVersion }} </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        ApiGear Studio helps you to manage Object APIs in an API driven project. It allows you to manage APIs,
        create SDKs as also to monitor and simulate your local API.
      </q-card-section>
      <q-card-section>
        It is built on top of ApiGear, a free and open source API framework. The source code is licensed under the MIT
        license and available on GitHub.
      </q-card-section>
      <q-card-section>
        <q-markup-table dense>
          <tbody>
            <tr>
              <td>Homepage</td>
              <td><a href="https://apigear.io">https://apigear.io</a></td>
            </tr>
            <tr>
              <td>Github</td>
              <td><a href="https://github.com/apigear-io">https://github.com/apigear-io</a></td>
            </tr>
            <tr>
              <td>License</td>
              <td><a href="https://www.apache.org/licenses/LICENSE-2.0">Apache 2.0</a></td>
            </tr>
            <tr>
              <td>Version</td>
              <td>{{ state.currentVersion }}</td>
            </tr>
            <tr>
              <td>Commit</td>
              <td>{{state.commit}}</td>
            </tr>
            <tr>
              <td>Build Date</td>
              <td>{{state.date}}</td>
            </tr>
          </tbody>
        </q-markup-table>
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
        <q-btn flat v-close-popup> Close </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar, useDialogPluginComponent } from 'quasar';
import { reactive, onMounted } from 'vue';
import { CheckUpdate, VersionInfo, UpdateProgram } from '../wailsjs/go/main/App';

defineEmits([...useDialogPluginComponent.emits])

const $q = useQuasar();

const { dialogRef, onDialogHide } = useDialogPluginComponent()


const state = reactive({
  currentVersion: '0.0.0',
  newVersion: '0.0.0',
  date: '2021-01-01',
  commit: '1234567890',
  url: '',
  isLatest: true,
});

onMounted(async () => {
  console.log('AppInfoDialog mounted');
  try {
    const info = await VersionInfo();
    console.log('info:', info);
    const rel = await CheckUpdate();
    console.log('rel:', rel);
    if (info) {
      state.currentVersion = info.version;
    }
    if (rel) {
      state.isLatest = false;
      state.newVersion = rel.version;
      state.commit = info.commit;
      state.date = info.date;
      state.url = rel.url;
    }
  } catch (err) {
    $q.notify({
      color: 'negative',
      message: 'Failed to check for app info: ' + err,
      icon: 'error',
    });
  }
});



const updateStudio = async () => {
  try {
    $q.loading.show({
      message: 'Updating Studio...',
      spinnerColor: 'white',
      boxClass: 'bg-primary text-white',
    });
    await UpdateProgram(state.newVersion);
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    $q.notify({
      color: 'negative',
      message: 'Failed to update: ' + err,
      icon: 'error',
    });
  }
};


</script>
