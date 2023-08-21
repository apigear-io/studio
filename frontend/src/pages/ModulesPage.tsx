import { Paper, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { useProjectStore, Document } from "../stores/ProjectStore";
import { useMemo } from "react";
import Page from "../components/Page";

export default function ProjectPage() {
  const getDocuments = useProjectStore((state) => state.getDocuments);
  const modules: Document[] = useMemo(() => {
    return getDocuments("module") || [];
  }, [getDocuments]);

  return (
    <Page title="Modules">
      <Paper>
        <Stack>
          <PageHeader
            title="Modules"
            description="API modules define the API surface. The interfaces, data structures and operations that can be consumed."
          />
          {modules.map((doc) => (
            <DocumentEntry doc={doc} key={doc.name} />
          ))}
        </Stack>
      </Paper>
    </Page>
  );
}
