import { DataTable, DataTableColumn } from "mantine-datatable";

interface IEvent {
  id: string;
  topic: string;
  message: string;
}

const events: IEvent[] = [
  { id: "1", topic: "app", message: "App started" },
  { id: "2", topic: "app", message: "App stopped" },
  { id: "3", topic: "app", message: "App started" },
  { id: "4", topic: "app", message: "App stopped" },
  { id: "5", topic: "app", message: "App started" },
  { id: "6", topic: "app", message: "App stopped" },
  { id: "7", topic: "app", message: "App started" },
  { id: "8", topic: "app", message: "App stopped" },
  { id: "9", topic: "app", message: "App started" },
  { id: "10", topic: "app", message: "App stopped" },
];

const columns: DataTableColumn<IEvent>[] = [
  {
    accessor: "id",
    title: "id",
    textAlignment: "center",
    width: 100,
  },
  {
    accessor: "topic",
    title: "topic",
    textAlignment: "left",
    width: 100,
  },
  {
    accessor: "message",
    title: "message",
    textAlignment: "left",
  },
];

export default function EventTable() {
  return (
    <DataTable
      withBorder
      withColumnBorders
      striped
      records={events}
      columns={columns}
      shadow="sm"
      fontSize="xs"
      highlightOnHover
    ></DataTable>
  );
}
