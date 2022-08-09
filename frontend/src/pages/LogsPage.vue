<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="view_list" />
          <q-toolbar-title>Logs</q-toolbar-title>
          <q-space />
          <q-toggle color="positive" label="Solution" v-model="state.topicSelection" val="sol" icon="filter_alt" />
          <q-toggle color="positive" label="Simulation" v-model="state.topicSelection" val="sim" icon="filter_alt" />
          <q-toggle color="positive" label="Monitor" v-model="state.topicSelection" val="mon" icon="filter_alt" />
          <q-toggle color="positive" label="Application" v-model="state.topicSelection" val="app" icon="filter_alt" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-table title="Log Messages" :rows="logStore.list" :columns="columns" row-key="time" dense flat />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { QTableProps } from 'quasar';
import { useLogStore } from '../stores/log-store';

const logStore = useLogStore();

const columns: QTableProps['columns'] = [
  {
    name: 'time',
    label: 'Time',
    field: 'time',
    align: 'left',
    style: 'width: 80px',
  },
  {
    name: 'level',
    label: 'Level',
    field: 'level',
    align: 'center',
    style: 'width: 40px',
  },
  {
    name: 'topic',
    label: 'Topic',
    field: 'topic',
    align: 'center',
    style: 'width: 40px',
  },
  {
    name: 'message',
    label: 'Message',
    field: 'message',
    align: 'left',
    style: 'width: 320px',
  },
];

const state = reactive({
  topicSelection: ['app', 'sol', 'sim', 'mon'] as string[],
});
</script>
