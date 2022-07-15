<template>
  <q-page padding>
    <q-card>
      <q-card-section>
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn flat icon="dashboard" />
        <q-toolbar-title>Dashboard</q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item clickable v-ripple v-for="item in store.documents" :key="item.path" @click="openDocument(item)">
            <q-item-section avatar>
              <q-icon :name="icon(item.type)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">{{ item.path }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn size="md" class="text-primary" label="Edit" icon="edit" @click.stop="editDocument(item)"/>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { OpenSourceInEditor } from "../wailsjs/go/main/App";
// import { EventsOn } from "../wailsjs/runtime/runtime";
import { useRouter } from "vue-router";
import { useProjectStore } from "../stores/project-store";
const router = useRouter();
const $q = useQuasar();
const store = useProjectStore();

// async function sync() {
//   console.log("sync");
//   state.project = await GetCurrentProject();
//   state.documents = state.project.documents
// }

// EventsOn("ProjectChanged", sync);

// onMounted(sync)

function icon(docType) {
  switch(docType) {
    case "module": return "api";
    case "solution": return "chair";
    case "scenario": return "av_timer";
  }
}

async function openDocument(doc) {
    console.log("openDocument", doc)
    $q.notify({
      message: `Opening ${doc.name}`,
      color: 'positive',
      icon: 'info'
    })
    switch(doc.type) {
      case "module":
        router.push('/projects/modules/')
        break;
      case "solution":
        router.push(`/projects/solutions`)
        break;
      case "scenario":
        router.push(`/projects/scenarios`)
        break;
      default:
        $q.notify({
          message: `Unknown document type ${doc.type}`,
          color: 'negative',
          icon: 'error'
        })
    }
}
async function editDocument(doc) {
  console.log("editDocument", doc)
  try {
    $q.notify({
      message: `Opening ${doc.name} in editor`,
      color: 'positive',
      icon: 'info'
    })
    await OpenSourceInEditor(doc.path)
  } catch {
    $q.notify({
      message: `Failed to open ${doc.name}`,
      color: "negative",
      icon: "error"
    })
  }
}

</script>
