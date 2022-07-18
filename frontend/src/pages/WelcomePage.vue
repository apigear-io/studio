<template>
  <q-page padding>
    <q-card class="transparent" flat>
      <q-card-section>
        <div class="text-h3">ApiGear Studio</div>
        <div class="text-subtitle1">APIs evolved</div>
      </q-card-section>
    </q-card>
    <div class="row">
      <div class="col">
        <q-card class="transparent" flat>
          <q-card-section>
            <q-list>
              <q-item-label header>Start</q-item-label>
              <q-item clickable v-ripple @click="createProject()" active>
                <q-item-section avatar>
                  <q-icon name="create_new_folder" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Create Project</q-item-label>
                  <q-item-label caption lines="2"
                    >Initialize a new API project inside a folder</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="openProject()" active>
                <q-item-section avatar>
                  <q-icon name="folder_open" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Open Project</q-item-label>
                  <q-item-label caption lines="2"
                    >Open an existing API project</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="importProject()" active>
                <q-item-section avatar>
                  <q-icon name="folder_copy" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Import Project</q-item-label>
                  <q-item-label caption lines="2"
                    >Import an existing API project from a local or remote
                    source</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item-label header>Recent</q-item-label>
              <q-item
                clickable
                v-ripple
                active
                v-for="item in store.recent"
                :key="item"
                @click="openRecentProject(item)"
              >
                <q-item-section avatar>
                  <q-icon name="folder_open" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    size="sm"
                    color="primary"
                    flat
                    icon="close"
                    @click="onRemoveItem(item)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card class="transparent" flat>
          <q-card-section>
            <q-list>
              <q-item-label header>More ...</q-item-label>
              <q-item
                clickable
                v-ripple
                active
                v-for="item in more"
                :key="item.title"
                @click="openUrl(item.link)"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption lines="2">{{
                    item.description
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  CreateProject,
  RemoveRecentProject,
  OpenProject,
  OpenRecentProject,
} from "../wailsjs/go/main/App";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useProjectStore } from "../stores/project-store";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
const more = [
  {
    icon: "info",
    title: "About",
    description: "About ApiGear Studio",
    link: "http://apigear.io",
  },
];

const store = useProjectStore();
const $q = useQuasar();
const router = useRouter();

onMounted(store.sync);

async function onRemoveItem(item: string) {
  try {
    await RemoveRecentProject(item);
    await store.sync();
  } catch (e) {
    console.error(e);
    $q.notify({
      message: "Error removing recent project",
      color: "negative",
      icon: "error",
    });
  }
}

async function openProject() {
  try {
    await OpenProject();
    await store.sync();
    router.push("/projects");
  } catch (e) {
    console.error(e);
    $q.notify({
      message: `Error opening project: ${e}`,
      color: "negative",
      icon: "error",
    });
  }
}

function importProject() {
  router.push("/import");
}

async function openRecentProject(item: string) {
  await OpenRecentProject(item);
  await store.sync();
  router.push("/projects");
}
async function createProject() {
  try {
    await CreateProject();
    await store.sync();
    router.push("/projects");
  } catch (e: any) {
    $q.notify({
      message: String(e),
      color: "negative",
      icon: "error",
    });
  }
}
async function openUrl(url: string) {
  try {
    BrowserOpenURL(url);
  } catch (e: any) {
    $q.notify({
      message: String(e),
      color: "negative",
      icon: "error",
    });
  }
}
</script>
