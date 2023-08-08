import { Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import MonitorEventTable from "../components/MonitorEventTable";
import { useMonitorStore } from "../stores/MonitorStore";

export default function LogsPage() {
  const events = useMonitorStore((state) => state.events);
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="API Event Monitoring"
          description="Displays a list of events that have occurred in the system."
        />
        <MonitorEventTable events={events} />
      </Stack>
    </Paper>
  );
}
