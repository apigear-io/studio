<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="data_object"/>
          <q-toolbar-title>API Events</q-toolbar-title>
          <q-space />
          <q-toggle size="sm" v-model="state.isListening" label="Scroll" style="min-width: 120px" />
          <q-btn flat icon="block" label="Clear" style="min-width: 120px"  @click="mon.clear()"/>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-table table-class="text-positive" table-header-class="text-primary" :rows="mon.events" :columns="columns" row-key="id" dense flat :pagination="state.initialPagination" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { reactive } from 'vue';
import { useMonitorStore } from '../stores/monitor-store';

const columns: QTableProps['columns'] = [
  { name: 'time', label: 'Time', field: 'timestamp', align: 'left', style: 'width: 80px' },
  { name: 'source', label: 'Source', field: 'source', style: 'width: 40px' },
  { name: 'type', label: 'Type', field: 'type', style: 'width: 40px' },
  { name: 'symbol', label: 'Symbol', field: 'symbol', align: 'left', style: 'width: 160px' },
  { name: 'data', label: 'Data', field: 'data', align: 'left', style: 'width: 320px', format: (val) => JSON.stringify(val) },
];

const mon = useMonitorStore();
const state = reactive({
  isListening: false,
  initialPagination: {
    sortBy: 'time',
    descending: true,
    page: 1,
    rowsPerPage: 16,
  },
});
</script>
