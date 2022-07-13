<template>
  <q-page>
    <q-toolbar>
      <q-btn flat icon="chair"/>
      <q-toolbar-title>SDK Solutions</q-toolbar-title>
      <q-space />
      <q-btn flat label="Summary" style="width:120px"/>
      <q-btn flat label="Messages" style="width:120px"/>
    </q-toolbar>
    <q-list bordered>
      <q-item clickable v-ripple v-for="item in documents" :key="item.path">
        <q-item-section avatar>
          <q-icon :name="icon(item.type)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption lines="2">{{ item.path }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn-group flat>
            <q-btn label="Run" icon="directions_run" @click="runDocument(item)"/>
            <q-btn label="Edit" icon="edit" @click="editDocument(item)"/>
            <q-btn icon="more_vert">
              <q-menu fit>
                <q-list style="min-width: 120px">
                  <q-item clickable v-close-popup @click="copyPath(item)">
                    <q-item-section avatar>
                      <q-icon name="file_copy" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Copy Path</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="toggleAutoRun(item)">
                    <q-item-section avatar>
                      <q-icon name="directions_run" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Enable Auto Run</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-btn-group>
        </q-item-section>
      </q-item>
    </q-list>
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
      console.log("runDocument")
    }

    function editDocument(doc) {
      console.log("editDocument")
    }

    function toggleAutoRun(doc) {
      console.log("toggleAutoRun", doc)
    }

    function copyPath(doc) {
      console.log("copyPath", doc)
    }


    onMounted(async () => {
      project.value = await CurrentProject()
      documents.value = await DocumentsByType("solution")
    })

    return {
      project,
      documents,
      icon,
      runDocument,
      editDocument,
      toggleAutoRun,
      copyPath,
    }
  }
}
</script>
