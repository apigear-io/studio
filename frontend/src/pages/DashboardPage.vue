<template>
  <q-page>
    <q-toolbar>
      <q-btn flat icon="dashboard" />
      <q-toolbar-title>Dashboard</q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-list bordered>
      <q-item clickable v-ripple v-for="item in project.documents" :key="item.path" @click="openDocument(item)">
        <q-item-section avatar>
          <q-icon :name="icon(item.type)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption lines="2">{{ item.path }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { CurrentProject } from "../wailsjs/go/main/App";
import { useQuasar } from "quasar";
import { useRouter
 } from "vue-router";
export default {
  setup() {
    const project = ref({})
    const $q = useQuasar()
    const router = useRouter()

    function icon(docType) {
      switch(docType) {
        case "module": return "api";
        case "solution": return "chair";
        case "scenario": return "av_timer";
      }
    }
    function openDocument(item) {
      $q.notify({
        message: `Opening ${item.name}`,
        color: 'positive',
        icon: 'info'
      })
      switch(item.type) {
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
            message: `Unknown document type ${item.type}`,
            color: 'negative',
            icon: 'error'
          })
      }
    }
    onMounted(async () => {
      try {
        project.value = await CurrentProject()
      } catch (e) {
        console.error(e)
        $q.notify({
          message: e,
          color: "negative",
          icon: "error"
        })
        project.value = { name: "NoName", documents: [], path: "NoPath" }
      }
    })
    return {
      project,
      icon,
      openDocument,
    };
  }
};
</script>
