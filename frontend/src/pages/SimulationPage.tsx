import { Divider, Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { useProjectStore } from "../stores/ProjectStore";
import { useMemo } from "react";

export default function ProjectPage() {
  const getDocuments = useProjectStore((state) => state.getDocuments);
  const documents = useMemo(() => {
    return getDocuments("scenario") || [];
  }, [getDocuments]);
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="Simulation Scenarios"
          description="Simulation scenarios define how APIs are simulated at runtime."
        />
        <Divider />
        {documents.map((doc) => (
          <DocumentEntry doc={doc} key={doc.name} />
        ))}
      </Stack>
    </Paper>
  );
}
