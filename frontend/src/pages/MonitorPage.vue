<template>
  <q-page padding>
    <q-card>
      <q-card-section>
      <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="data_object"/>
          <q-toolbar-title>Monitor</q-toolbar-title>
          <q-space />
          <q-toggle size="sm" v-model="isListening" label="Scroll" style="min-width:120px"/>
          <q-btn flat icon="block" label="Clear" style="min-width:120px"/>
        </q-toolbar>
      </q-card-section>
      <q-card-section>
        <q-table
          table-class="text-positive"
          table-header-class="text-primary"
          title="Monitor Messages"
          :rows="app.monEventItems"
          :columns="columns"
          row-key="id"
          dense
          flat
          :pagination="initialPagination"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useMonitorStore } from '../stores/monitor-store'

export default {
  setup() {
    const app = useAppStore()
    const isListening = ref(false)
    const columns = ref([
      { name: 'time', label: 'Time', field: 'timestamp', align: 'left', style: 'width: 120px', sortable: true },
      { name: 'source', label: 'Source', field: 'source', align: 'center', style: 'width: 80px' },
      { name: 'type', label: 'Type', field: 'type', align: 'left', style: 'width: 80px' },
      { name: 'symbol', label: 'Symbol', field: 'symbol', align: 'left', style: 'width: 240px' },
      { name: 'data', label: 'Data', field: 'data', align: 'center', style: 'width: 480px' },
    ])
    const initialPagination = {
      sortBy: 'time',
      descending: true,
      page: 1,
      rowsPerPage: 16,
    }
    onMounted(() => {
    })
    return {
      app,
      initialPagination,
      columns,
      isListening,
    }
  },
}
</script>
