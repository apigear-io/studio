import { Divider, Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import EventTable from "../components/EventTable";

export default function LogsPage() {
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="API Event Monitoring"
          description="Displays a list of events that have occurred in the system."
        />
        <Divider />
        <EventTable />
      </Stack>
    </Paper>
  );
}
