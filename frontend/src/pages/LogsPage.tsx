import { Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import { useLogsStore } from "../stores/LogsStore";
import LogEventTable from "../components/LogEventTable";
import Page from "../components/Page";

export default function LogsPage() {
  const events = useLogsStore((state) => state.events);

  return (
    <Page title="Logs">
      <Paper>
        <Stack>
          <PageHeader
            title="Event Logging"
            description="Displays a list of events that have occurred in the system."
          />
          <LogEventTable events={events} />
        </Stack>
      </Paper>
    </Page>
  );
}
