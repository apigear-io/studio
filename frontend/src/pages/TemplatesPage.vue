<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="auto_fix_normal" />
          <q-toolbar-title>SDK Templates</q-toolbar-title>
          <q-space />
          <q-btn-group flat>
            <q-btn icon="refresh" label="Refresh Registry" @click="onRefreshTemplates" />
            <q-btn icon="file_upload" label="Import" @click="onImportTemplate" />
          </q-btn-group>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-tabs v-model="state.tab" align="left" class="text-primary">
          <q-tab name="installed" label="Installed" />
          <q-tab name="available" label="Available" />
        </q-tabs>
        <q-tabs-panels v-model="state.tab">
          <TemplateCache v-if="state.tab === 'installed'" />
          <TemplateRegistry v-if="state.tab === 'available'" />
        </q-tabs-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useGtm } from '@gtm-support/vue-gtm';
import { UpdateTemplateRegistry, InstallTemplateFromSource } from '../wailsjs/go/main/App';
import TemplateCache from '../components/TemplateCache.vue';
import TemplateRegistry from '../components/TemplateRegistry.vue';

const $q = useQuasar();
const $gtm = useGtm();

const state = ref({
  tab: 'installed'
})

const onRefreshTemplates = async () => {
  console.log('refresh templates');
  // render a progress dialog while we refresh the template registry
  try {
    $q.loading.show({
      spinnerColor: 'primary',
      message: 'Refreshing template registry...',
      delay: 400 // ms
    })
    await UpdateTemplateRegistry();
    window.location.reload();
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      textColor: 'white',
      message: 'refresh templates',
    });
  } finally {
    $q.loading.hide()
  }
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
</script>
