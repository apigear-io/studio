import { Box, Divider, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { useProjectStore } from "../stores/ProjectStore";
import { useMemo } from "react";

export default function ProjectPage() {
  const getDocuments = useProjectStore((state) => state.getDocuments);
  const documents = useMemo(() => {
    return getDocuments("solution") || [];
  }, [getDocuments]);
  return (
    <Box>
      <Stack>
        <PageHeader
          title="API Solutions"
          description="Solutions define how code is generated by linking modules to templates"
        />
        <Divider />
        {documents.map((doc) => (
          <DocumentEntry doc={doc} key={doc.name} />
        ))}
      </Stack>
    </Box>
  );
}
