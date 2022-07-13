<template>
  <q-page padding>
    <q-toolbar class="bg-primary">
      <q-btn flat round dense icon="folder_open"/>
      <q-toolbar-title>
        Import Project
      </q-toolbar-title>
    </q-toolbar>
    <q-card class="q-ma-lg">
      <q-card-section>
        <q-input v-model="sourceLocation" type="text" label="Source location" hint="select a local folder or enter a remote location as source for import">
          <template v-slot:after>
            <q-btn round dense flat icon="folder_open" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section>
        <q-input v-model="targetLocation" type="text" label="Target location" hint="select a local folder as target">
          <template v-slot:after>
            <q-btn round dense flat icon="folder_open" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn dense flat color="primary" @click="importProject()">
          Import
        </q-btn>
        <q-btn dense flat color="primary" to="/">
          Cancel
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { ImportProject } from "../wailsjs/go/main/App";
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'


export default {
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    onMounted(async () => {})

    async function importProject() {
        try {
          await ImportProject(data)
        } catch (e) {
          $q.notify({
            message: e,
            color: 'negative',
            icon: 'error'
          })
        }
    }
    return {
      importProject,
      step: ref(1)
    };
  }
};
</script>
