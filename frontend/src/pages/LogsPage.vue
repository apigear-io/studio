<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-avatar icon="view_list"/>
          <q-toolbar-title>Log Events</q-toolbar-title>
          <q-space />
        </q-toolbar>
      </q-card-section>
      <q-card-section class="fit">
        <q-table :rows="logStore.list" :columns="columns" row-key="time" dense flat :pagination="pagination" class="fit">
          <template v-slot:body="props">
            <q-tr :props="props" @click="props.expand = !props.expand">
              <q-td v-for="col in props.cols" :key="col.name" :props="props" :class="rowClass(props.row)">
                {{ col.value }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand">
              <q-td colspan="100%" class="text-caption">
                <vue-json-pretty :data="props.row" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useLogStore, ILogEvent } from '../stores/log-store';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const logStore = useLogStore();

const columns: QTableProps['columns'] = [
  {
    name: 'time',
    label: 'Time',
    field: 'timestamp',
    align: 'left',
  },
  {
    name: 'level',
    label: 'Level',
    field: 'level',
    align: 'center',
  },
  {
    name: 'topic',
    label: 'Topic',
    field: 'topic',
    align: 'left',
  },
  {
    name: 'message',
    label: 'Message',
    field: 'message',
    align: 'left',
  },
];

function rowClass(item: ILogEvent): string {
  switch (item.level) {
    case 'info':
      return 'text-info';
    case 'warning':
      return 'text-warning';
    case 'error':
      return 'text-negative';
    default:
      return '';
  }
}
const pagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 15,
};
</script>
