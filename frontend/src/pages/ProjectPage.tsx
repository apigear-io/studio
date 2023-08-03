import { Box, Divider, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { useProjectStore } from "../stores/ProjectStore";

export default function ProjectPage() {
  const project = useProjectStore((state) => state.project);
  const documents = project?.documents || [];
  return (
    <Box>
      <Stack>
        <PageHeader
          title="Project"
          description="An API project contains a set of documents to define APIs, generate SDKs, simulate APIs as also monitor APIs at runtime."
        />
        <Divider />
        {documents.map((doc) => (
          <DocumentEntry doc={doc} key={doc.name} />
        ))}
      </Stack>
    </Box>
  );
}
