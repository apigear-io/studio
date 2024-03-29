import { Box, Button, Stack } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import DocumentEntry from "../components/DocumentEntry";
import { useProjectStore } from "../stores/ProjectStore";
import { IconCheck } from "@tabler/icons-react";
import { CheckDocument } from "../wailsjs/go/main/App";
import { notifyError, notifyValid, notifyInvalid } from "../toasts";
import Page from "../components/Page";
import useTrackAction from "../hooks/useTrackAction";

export default function ProjectPage() {
  const project = useProjectStore((state) => state.project);
  const documents = project?.documents || [];
  const trackAction = useTrackAction();

  function checkAll() {
    trackAction("check_all");
    documents.forEach((doc) => {
      CheckDocument(doc.path)
        .then((result) => {
          if (result.is_valid) {
            notifyValid(`Document ${doc.name} checked`);
          } else {
            notifyInvalid(
              `Document ${doc.name} is invalid: \n${result.errors.join("\n")}`
            );
          }
        })
        .catch((err) => {
          notifyError(`Document ${doc.name} check failed: ${err}`);
        });
    });
    console.log("check all");
  }
  return (
    <Page title="Project">
      <Box>
        <Stack>
          <PageHeader
            title="Dashboard"
            description="An API project contains a set of documents to define APIs, generate SDKs, simulate APIs as also monitor APIs at runtime."
          >
            <>
              <Button
                variant="subtle"
                leftSection={<IconCheck />}
                onClick={checkAll}
              >
                Check All
              </Button>
            </>
          </PageHeader>
          {documents.map((doc) => (
            <DocumentEntry doc={doc} key={doc.name} />
          ))}
        </Stack>
      </Box>
    </Page>
  );
}
