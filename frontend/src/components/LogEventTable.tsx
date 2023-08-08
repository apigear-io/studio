import { DataTable, DataTableColumn } from "mantine-datatable";
import { Prism } from "@mantine/prism";
import dayjs from "dayjs";
import { useMantineTheme } from "@mantine/core";
import { LogEvent } from "../stores/LogsStore";

const columns: DataTableColumn<LogEvent>[] = [
  {
    accessor: "time",
    title: "time",
    textAlignment: "left",
    width: 80,
    render: (row) => dayjs(row.time).format("HH:mm:ss"),
  },
  {
    accessor: "level",
    title: "level",
    textAlignment: "left",
    width: 60,
  },
  {
    accessor: "topic",
    title: "topic",
    textAlignment: "left",
    width: 60,
  },
  {
    accessor: "message",
    title: "message",
    textAlignment: "left",
    render: (row) => {
      return row.error ? `${row.message}: ${row.error}` : row.message;
    },
  },
];

export interface EventTableProps {
  events: LogEvent[];
  height?: string | number;
}

export default function LogEventTable(props: EventTableProps) {
  const theme = useMantineTheme();

  return (
    <DataTable
      withBorder
      withColumnBorders
      records={props.events}
      columns={columns}
      fontSize="xs"
      highlightOnHover
      height={props.height || "67vh"}
      rowStyle={({ level }) => {
        switch (level) {
          case "warn":
            return { color: theme.colors.yellow[5] };
          case "error":
            return { color: theme.colors.red[5] };
          default:
            return { color: theme.colors.green[5] };
        }
      }}
      rowExpansion={{
        content: ({ record }) => (
          <Prism language="json">{JSON.stringify(record, null, 2)}</Prism>
        ),
      }}
    />
  );
}
