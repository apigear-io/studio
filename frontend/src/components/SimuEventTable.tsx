import { DataTable, DataTableColumn } from "mantine-datatable";
import { Prism } from "@mantine/prism";
import dayjs from "dayjs";
import { SimuEvent } from "../stores/SimuStore";

const columns: DataTableColumn<SimuEvent>[] = [
  {
    accessor: "timestamp",
    title: "time",
    textAlignment: "left",
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
      withBorder
      withColumnBorders
      records={props.events}
      columns={columns}
      fontSize="xs"
      highlightOnHover
      height="67vh"
      rowExpansion={{
        content: ({ record }) => (
          <Prism language="json">{JSON.stringify(record, null, 2)}</Prism>
        ),
      }}
    />
  );
}
