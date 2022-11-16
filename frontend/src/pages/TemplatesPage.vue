<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="auto_fix_normal" />
          <q-toolbar-title>SDK Templates</q-toolbar-title>
          <q-space />
          <q-btn-group flat>
            <q-btn icon="refresh" label="Refresh" @click="onRefreshTemplates" />
            <q-btn icon="file_upload" label="Import" @click="onImportTemplate" />
          </q-btn-group>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-list separator padding>
          <q-item v-for="item in state.templates" :key="item.name">
            <q-item-section avatar>
              <q-icon name="auto_fix_normal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-btn flat>{{ item.name }}</q-btn>
              </q-item-label>
              <q-item-label caption lines="2">{{ item.description }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group flat>
                <q-btn :disabled="item.installed" class="text-primary" label="Install" icon="directions_run"
                  @click="onInstallTemplate(item)" />
                <q-btn class="text-primary" label="Info" icon="info" @click="onShowTemplateInfo(item)" />
                <q-btn class="text-primary" icon="more_vert">
                  <q-menu fit>
                    <q-list style="min-width: 240px" class="q-pa-md">
                      <q-item clickable v-close-popup @click="onCopyName(item)" dense class="text-primary">
                        <q-item-section avatar>
                          <q-icon name="file_copy" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Copy Name</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="onRemoveTemplate(item)" dense class="text-primary">
                        <q-item-section avatar>
                          <q-icon name="delete" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Remove</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useGtm } from '@gtm-support/vue-gtm';
import { useQuasar } from 'quasar';
import { onMounted, reactive } from 'vue';
import { GetTemplates, InstallTemplateFromSource, RemoveTemplate, InstallTemplate, UpdateTemplateRegistry } from '../wailsjs/go/main/App';
import { main } from '../wailsjs/go/models';

const $q = useQuasar();
const $gtm = useGtm();
const state = reactive({
  templates: [] as main.RepoInfo[],
});

const sync = async () => {
  $q.loading.show({
    message: 'Syncing templates...',
    delay: 400 // ms
  })
  try {
    state.templates = (await GetTemplates()) as main.RepoInfo[];
    console.log('Templates:', state.templates);
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'load templates',
    });
  }
  $q.loading.hide()
};

onMounted(sync);

function onShowTemplateInfo(template: main.RepoInfo) {
  console.log('onShowTemplateInfo', template);
  $gtm?.trackEvent({
    event: 'show_template_info',
    category: 'templates',
    action: 'show_template_info',
  });
  const msg = `Name: ${template.name}</br>Description: ${template.description}</br>Source: ${template.source}</br>Versions: ${template.versions.join(', ')}</br>Installed: ${template.installed}`;
  $q.dialog({
    title: template.name,
    message: msg,
    html: true,
    persistent: true,
  }).onOk(() => {
    console.log('onOk');
  }).onCancel(() => {
    console.log('onCancel');
  });
};

const onRemoveTemplate = (template: main.RepoInfo) => {
  $gtm?.trackEvent({
    event: 'remove_template',
    category: 'templates',
    action: 'remove_template',
  });
  $q.dialog({
    title: 'Remove Template',
    message: `Are you sure you want to remove ${template.name}?`,
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    try {
      await RemoveTemplate(template.name);
      sync();
      $q.notify({
        type: 'positive',
        message: 'Template removed',
      });
    } catch (e) {
      console.error(e);
      $q.notify({
        type: 'negative',
        textColor: 'white',
        message: 'remove template',
      });
    }
  });
};

const onImportTemplate = () => {
  $gtm?.trackEvent({
    event: 'import_template',
    category: 'templates',
    action: 'import_template',
  });
  console.log('import template');
  $q.dialog({
    title: 'Import Template',
    message: 'Import a template from a git url',
    persistent: true,
    cancel: true,
    prompt: {
      model: '',
      type: 'text',
      label: 'Git URL',
    },
  }).onOk(async (data) => {
    if (!data) {
      return;
    }
    try {
      await InstallTemplateFromSource(data);
      sync();
      $q.notify({
        color: 'positive',
        textColor: 'white',
        message: 'Successfully imported template',
      });
    } catch (e) {
      console.error(e);
      $q.notify({
        color: 'negative',
        textColor: 'white',
        message: `import template: ${String(e)}`,
      });
    }
  });
};

const onRefreshTemplates = async () => {
  console.log('refresh templates');
  try {
    await UpdateTemplateRegistry();
    await sync();
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'refresh templates',
    });
  }
};

const onInstallTemplate = async (item: main.RepoInfo) => {
  $gtm?.trackEvent({
    event: 'install_template',
    category: 'templates',
    action: 'install_template',
  });
  try {
    await InstallTemplate(item.name);
    await sync();
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: `install template: ${String(e)}`,
    });
  }
  console.log('install template', item);
};

const onCopyName = (item: main.RepoInfo) => {
  $gtm?.trackEvent({
    event: 'copy_name',
    category: 'templates',
    action: 'copy_name',
  });
  console.log('copy name', item);
};
</script>
