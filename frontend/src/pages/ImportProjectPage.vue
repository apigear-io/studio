<template>
  <q-page padding>
    <q-toolbar class="bg-primary">
      <q-btn flat round dense icon="folder_open" />
      <q-toolbar-title> Import Project </q-toolbar-title>
    </q-toolbar>
    <div class="row justify-center q-pa-xl">
      <q-card class="q-ma-lg col-6">
        <q-card-section>
          <q-input
            v-model="state.dir"
            type="text"
            label="Target directory"
            hint="select a local directory to import the project"
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                icon="folder_open"
                @click="onSelectTarget()"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="state.repo"
            type="text"
            label="Project URL"
            hint="Git URL for the project to import"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="folder_open" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn dense flat color="primary" @click="importProject()">
            Import
          </q-btn>
          <q-btn dense flat color="primary" to="/"> Cancel </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ImportProject, SelectDirectory } from '../wailsjs/go/main/App';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useProjectStore } from '../stores/project-store';

const $q = useQuasar();
const store = useProjectStore();
const router = useRouter();
const state = reactive({
  repo: '',
  dir: '',
});

const onSelectTarget = async () => {
  try {
    const target = (await SelectDirectory()) as string;
    state.dir = target;
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: String(e),
    });
  }
};
async function importProject() {
  try {
    await ImportProject(state.repo, state.dir);
    $q.notify({
      type: 'positive',
      message: 'Project imported successfully',
    });
    await store.sync();
    router.push('/projects');
  } catch (e: any) {
    $q.notify({
      message: String(e),
      color: 'negative',
      icon: 'error',
    });
  }
}
</script>
