<template>
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
          <q-btn class="text-primary" label="Info" icon="info" @click="onShowTemplateInfo(item)" />
          <q-btn class="text-primary" label="Copy" icon="file_copy" @click="onCopyName(item)" />
          <q-btn class="text-primary" label="Remove" icon="delete" @click="onRemoveTemplate(item)" />
        </q-btn-group>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted, reactive } from 'vue';
import { GetCacheList, RemoveTemplate } from '../wailsjs/go/main/App';
import { main } from '../wailsjs/go/models';
import { useGtm } from '@gtm-support/vue-gtm';

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
    state.templates = (await GetCacheList()) as main.RepoInfo[];
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
      await sync();
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

const onCopyName = (item: main.RepoInfo) => {
  $gtm?.trackEvent({
    event: 'copy_name',
    category: 'templates',
    action: 'copy_name',
  });
  // copy name to clipboard
  navigator.clipboard.writeText(item.name);
  console.log('copy name', item);
};
</script>

<style lang="scss" scoped></style>
