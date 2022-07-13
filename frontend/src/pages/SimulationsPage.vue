<template>
  <q-page padding>
    <q-card>
      <q-card-section>
      <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="av_timer"/>
          <q-toolbar-title>Simulation Scenarios</q-toolbar-title>
          <q-space />
          <q-btn flat label="Messages" style="width:120px"/>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item v-ripple v-for="item in documents" :key="item.path">
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group class="text-primary">
                <q-btn class="text-primary" label="Run" icon="directions_run" @click="runDocument(item)"/>
                <q-btn class="text-primary" label="Edit" icon="edit" @click="editDocument(item)"/>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'
import { CurrentProject, DocumentsByType } from '../wailsjs/go/main/App'

export default {
  setup() {
    const project = ref({})
    const documents = ref([])
    function icon(docType) {
      switch(docType) {
        case "module": return "api";
        case "solution": return "chair";
        case "scenario": return "av_timer";
      }
    }

    function runDocument(doc) {
      console.log("runDocument", doc)
    }

    function editDocument(doc) {
      console.log("editDocument", doc)
    }

    onMounted(async () => {
      project.value = await CurrentProject()
      documents.value = await DocumentsByType("scenario")
    })
    return {
      project,
      documents,
      icon,
      runDocument,
      editDocument,
    }
  }
}
</script>
