import { Paper, Stack, Button, Drawer } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { Document, useProjectStore } from "../stores/ProjectStore";
import { useMemo } from "react";
import {
  IconListSearch,
  IconMessage,
  IconPlayerPlay,
  IconPlayerStop,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useLogsStore } from "../stores/LogsStore";
import { useSimuStore } from "../stores/SimuStore";
import LogEventTable from "../components/LogEventTable";
import { StartScenario, StopScenario } from "../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
import useTrackAction from "../hooks/useTrackAction";

type PlayButtonProps = {
  doc: Document;
  open: () => void;
};

// PlayButton is a component that is used play a scenario document.
function PlayButton({ doc, open }: PlayButtonProps) {
  const trackAction = useTrackAction();
  const startRecording = useLogsStore((state) => state.startRecordingSimEvents);
  const startSimu = useSimuStore((state) => state.start);
  const playScenario = (doc: Document) => {
    trackAction("play_scenario", doc.path);
    console.log("play scenario", doc.name);
    open();
    startRecording();
    StartScenario(doc.path)
      .then((result) => {
        startSimu(doc.path);
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlayerPlay />}
      onClick={() => playScenario(doc)}
    >
      Play
    </Button>
  );
}

type StopButtonProps = {
  doc: Document;
  close: () => void;
};

// StopButton is a component that is used to stop a scenario document.
function StopButton({ doc, close }: StopButtonProps) {
  const trackAction = useTrackAction();
  const stopSimu = useSimuStore((state) => state.stop);
  const stopRecording = useLogsStore((state) => state.stopRecordingSimEvents);
  const stopScenario = (doc: Document) => {
    trackAction("stop_scenario", doc.path);
    close();
    stopRecording();
    StopScenario(doc.path)
      .then(() => {
        stopSimu(doc.path);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlayerStop />}
      onClick={() => stopScenario(doc)}
    >
      Stop
    </Button>
  );
}

type DocumentActionsProps = {
  doc: Document;
  open: () => void;
  close: () => void;
};

// DocumentActions is a component that is used to render the actions for a
// document (e.g. play, stop, etc.). It is used in the DocumentEntry component.
function DocumentActions({ doc, open, close }: DocumentActionsProps) {
  const running = useSimuStore((state) => state.running);
  const isRunning = running[doc.path];
  return (
    <>
      {!isRunning && <PlayButton doc={doc} open={open} />}
      {isRunning && <StopButton doc={doc} close={close} />}
    </>
  );
}

export default function ProjectPage() {
  const nav = useNavigate();
  const getDocuments = useProjectStore((state) => state.getDocuments);
  const documents = useMemo(() => {
    return getDocuments("scenario") || [];
  }, [getDocuments]);

  // drawer
  const [opened, { open, close }] = useDisclosure();
  const events = useLogsStore((state) => state.simEvents);

  return (
    <Page title="Simulation Scenarios">
      <Paper>
        <Stack>
          <PageHeader
            title="Simulation Scenarios"
            description="Simulation scenarios define how APIs are simulated at runtime."
          >
            <>
              <Button
                variant="subtle"
                leftSection={<IconListSearch />}
                onClick={open}
              >
                Logs
              </Button>
              <Button
                variant="subtle"
                leftSection={<IconMessage />}
                onClick={() => nav("/project/simulation/events")}
              >
                Events
              </Button>
            </>
          </PageHeader>
          {documents.map((doc) => {
            return (
              <DocumentEntry
                doc={doc}
                key={doc.name}
                actions={
                  <DocumentActions doc={doc} open={open} close={close} />
                }
              />
            );
          })}
        </Stack>
        <Drawer
          opened={opened}
          position="bottom"
          onClose={close}
          size="xs"
          title="Simulation Logs"
        >
          <LogEventTable events={events} />
        </Drawer>
      </Paper>
    </Page>
  );
}
