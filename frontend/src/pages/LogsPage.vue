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
        <q-table title="Log Messages" :rows="state.rows" :columns="columns" row-key="time" dense flat />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { QTableProps } from 'quasar';

interface ILogEntry {
  time: string;
  topic: string;
  message: string;
}

const columns: QTableProps['columns'] = [
  {
    name: 'time',
    label: 'Time',
    field: 'time',
    align: 'left',
    style: 'width: 120px',
  },
  {
    name: 'topic',
    label: 'Topic',
    field: 'topic',
    align: 'center',
    style: 'width: 120px',
  },
  {
    name: 'message',
    label: 'Message',
    field: 'message',
    align: 'left',
    style: 'width: 640px',
  },
];

const state = reactive({
  topicSelection: ['app', 'sol', 'sim', 'mon'] as string[],
  rows: [] as ILogEntry[],
});
onMounted(() => {
  state.rows = [
    {
      time: '2020-01-01T00:00:00Z',
      topic: 'topic1',
      message: 'message1',
    },
    {
      time: '2020-01-01T00:00:00Z',
      topic: 'topic2',
      message: 'message2',
    },
    {
      time: '2020-01-01T00:00:00Z',
      topic: 'topic3',
      message: 'message3',
    },
  ];
});
</script>
