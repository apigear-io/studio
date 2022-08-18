<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white">
          <q-btn flat icon="av_timer" />
          <q-toolbar-title>Simulation Events</q-toolbar-title>
          <q-space />
          <q-toggle size="sm" v-model="state.isListening" label="Scroll" style="min-width: 120px" />
          <q-btn flat icon="block" label="Clear" style="min-width: 120px" />
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-table table-class="text-positive" table-header-class="text-primary" :rows="simu.events" :columns="columns" row-key="id" dense flat :pagination="state.initialPagination" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { reactive } from 'vue';
import { useSimulationStore } from '../stores/simulation-store';

const columns: QTableProps['columns'] = [
  { name: 'time', label: 'Time', field: 'timestamp', align: 'left', style: 'width: 120px', sortable: true },
  { name: 'source', label: 'Source', field: 'source', align: 'center', style: 'width: 80px' },
  { name: 'type', label: 'Type', field: 'type', align: 'center', style: 'width: 80px' },
  { name: 'symbol', label: 'Symbol', field: 'symbol', align: 'left', style: 'width: 240px' },
  { name: 'data', label: 'Data', field: 'data', align: 'center', style: 'width: 480px' },
];

const simu = useSimulationStore();
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
<style scoped></style>
