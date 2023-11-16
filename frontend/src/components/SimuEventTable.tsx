import { DataTable, DataTableColumn } from "mantine-datatable";
import { CodeHighlight } from "@mantine/code-highlight";
import dayjs from "dayjs";
import { SimuEvent } from "../stores/SimuStore";

const columns: DataTableColumn<SimuEvent>[] = [
  {
    accessor: "timestamp",
    title: "time",
    textAlign: "left",
    width: 80,
    render: (row) => dayjs(row.timestamp).format("HH:mm:ss"),
  },
  {
    accessor: "type",
  },
  {
    accessor: "symbol",
  },
  {
    accessor: "name",
  },
  {
    accessor: "args",
    render: (row) => JSON.stringify(row.args),
  },
  {
    accessor: "kwargs",
    render: (row) => JSON.stringify(row.kwargs),
  },
];

export interface EventTableProps {
  events: SimuEvent[];
}

export default function SimuEventTable(props: EventTableProps) {
  return (
    <DataTable
      withTableBorder
      withColumnBorders
      records={props.events}
      columns={columns}
      highlightOnHover
      height="67vh"
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
