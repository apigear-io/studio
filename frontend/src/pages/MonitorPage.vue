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
          title="Monitor Messages"
          :rows="rows"
          :columns="columns"
          row-key="time"
          dense
          flat
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const isListening = ref(false)
    const rows = ref([])
    const columns = ref([
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
    ])
    onMounted(() => {
      rows.value = [
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
      ]
    })
    return {
      rows,
      columns,
      isListening,
    }
  },
}
</script>
