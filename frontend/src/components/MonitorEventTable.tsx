import { DataTable, DataTableColumn } from "mantine-datatable";
import { Prism } from "@mantine/prism";
import dayjs from "dayjs";
import { MonitorEvent } from "../stores/MonitorStore";

const columns: DataTableColumn<MonitorEvent>[] = [
  {
    accessor: "timestamp",
    title: "time",
    textAlignment: "left",
    width: 80,
    render: (row) => dayjs(row.timestamp).format("HH:mm:ss"),
  },
  {
    accessor: "source",
    title: "source",
    textAlignment: "left",
    width: 80,
  },
  {
    accessor: "type",
    title: "type",
    textAlignment: "left",
    width: 60,
  },
  {
    accessor: "symbol",
    title: "symbol",
    textAlignment: "left",
    width: 240,
  },
  {
    accessor: "data",
    title: "data",
    textAlignment: "left",
    render: (row) => JSON.stringify(row.data),
  },
];

export interface EventTableProps {
  events: MonitorEvent[];
  height?: string | number;
}

export default function MonitorEventTable(props: EventTableProps) {
  return (
    <DataTable
      withBorder
      withColumnBorders
      records={props.events}
      columns={columns}
      fontSize="xs"
      highlightOnHover
      height={props.height || "67vh"}
      rowExpansion={{
        content: ({ record }) => (
          <Prism language="json">{JSON.stringify(record, null, 2)}</Prism>
        ),
      }}
    />
  );
}
