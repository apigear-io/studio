import { Button, Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import SimuEventTable from "../components/SimuEventTable";
import { useSimuStore } from "../stores/SimuStore";

export default function SimulationEventsPage() {
  const nav = useNavigate();
  const events = useSimuStore((state) => state.events);
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="Simulation Events"
          description="Displays a list of events that have occurred in the system."
        >
          <>
            <Button
              variant="subtle"
              onClick={() => nav(-1)}
              leftIcon={<IconChevronLeft />}
            >
              Back
            </Button>
          </>
        </PageHeader>
        <SimuEventTable events={events} />
      </Stack>
    </Paper>
  );
}
