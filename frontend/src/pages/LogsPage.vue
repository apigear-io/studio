<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="bg-primary text-white rounded-borders">
          <q-btn flat icon="view_list" />
          <q-toolbar-title>Log Events</q-toolbar-title>
          <q-space />
        </q-toolbar>
      </q-card-section>
      <q-card-section class="fit">
        <q-table :rows="logStore.list" :columns="columns" row-key="time" dense flat :pagination="pagination" class="fit" >
          <template v-slot:body-cell="props">
              <q-td :props="props" :class="rowClass(props.row)">
                {{ props.value }}
              </q-td>
          </template>
        </q-table>  
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { useLogStore, ILogEvent } from '../stores/log-store';

const logStore = useLogStore();

const columns: QTableProps['columns'] = [
  {
    name: 'time',
    label: 'Time',
    field: 'timestamp',
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
    name: 'message',
    label: 'Message',
    field: 'message',
    align: 'left',
    style: 'width: 200px',
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
