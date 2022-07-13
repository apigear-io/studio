<template>
  <q-page>
    <q-toolbar>
      <q-btn flat icon="view_list"/>
      <q-toolbar-title>Logs</q-toolbar-title>
      <q-space/>
      <q-toggle color="positive" label="Solution" v-model="topicSelection" val="sol" />
      <q-toggle color="positive" label="Simulation" v-model="topicSelection" val="sim" />
      <q-toggle color="positive" label="Monitor" v-model="topicSelection" val="mon" />
      <q-toggle color="positive" label="Application" v-model="topicSelection" val="app" />
    </q-toolbar>
    <q-card>
      <q-card-section>
        <q-table
          title="Log Messages"
          :rows="rows"
          :columns="columns"
          row-key="time"
          dense
          flat
          bordered
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted, ref } from 'vue'


export default {
  setup() {
    const topicSelection = ref(['app', 'sol', 'sim', 'mon'])
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
      topicSelection,
    }
  },
}
</script>
