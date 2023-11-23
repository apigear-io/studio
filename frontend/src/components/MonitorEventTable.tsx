import { DataTable, DataTableColumn } from "mantine-datatable";
import { CodeHighlight } from "@mantine/code-highlight";
import dayjs from "dayjs";
import { MonitorEvent } from "../stores/MonitorStore";

const columns: DataTableColumn<MonitorEvent>[] = [
  {
    accessor: "timestamp",
    title: "time",
    textAlign: "left",
    width: 80,
    render: (row) => dayjs(row.timestamp).format("HH:mm:ss"),
  },
  {
    accessor: "source",
    title: "source",
    textAlign: "left",
    width: 80,
  },
  {
    accessor: "type",
    title: "type",
    textAlign: "left",
    width: 60,
  },
  {
    accessor: "symbol",
    title: "symbol",
    textAlign: "left",
    width: 240,
  },
  {
    accessor: "data",
    title: "data",
    textAlign: "left",
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
      withTableBorder
      withColumnBorders
      records={props.events}
      columns={columns}
      highlightOnHover
      height={props.height || "67vh"}
      rowExpansion={{
        content: ({ record }) => (
          <CodeHighlight
            language="json"
            code={JSON.stringify(record, null, 2)}
          />
        ),
      }}
    />
  );
}
