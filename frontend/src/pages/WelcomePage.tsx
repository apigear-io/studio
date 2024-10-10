import {
  Button,
  Grid,
  Group,
  NavLink,
  Paper,
  Stack,
  Title,
  Image,
  Card,
} from "@mantine/core";
import {
  IconBook,
  IconFileImport,
  IconFolder,
  IconFolderOpen,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  CreateProject,
  OpenProject,
  OpenRecentProject,
  RemoveRecentProject,
} from "../wailsjs/go/main/App";
import { AppShell } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { notifyError, notifyOpen, notifySuccess } from "../toasts";
import { useProjectStore } from "../stores/ProjectStore";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import AppFooter from "../components/AppFooter";
import Page from "../components/Page";
import AppIcon from "../assets/icons/appicon-96x96.png";

function StartSection() {
  const refresh = useProjectStore((state) => state.refresh);
  const nav = useNavigate();
  function openProject() {
    OpenProject()
      .then(() => {
        refresh();
        nav("/project");
        notifyOpen("Project opened");
      })
      .catch((err) => {
        notifyError(err);
      });
  }

  function createProject() {
    CreateProject()
      .then(() => {
        refresh();
        nav("/project");
        notifyOpen("Project created");
      })
      .catch((err) => {
        notifyError(err);
      });
  }

  function importProject() {
    notifyError("Not implemented");
  }

  return (
    <Card shadow="md" p="md" style={{ height: "100%" }} withBorder>
      <Stack gap="xs">
        <Title order={3} mb="lg">
          Start ...
        </Title>
        <NavLink
          label="Create Project"
          description="Create a new API driven project"
          leftSection={<IconPlus />}
          onClick={createProject}
        />
        <NavLink
          label="Open Project"
          description="Open an existing API driven project"
          leftSection={<IconFolderOpen />}
          onClick={openProject}
        />
        <NavLink
          label="Import Project"
          description="Import an existing API driven project"
          leftSection={<IconFileImport />}
          onClick={importProject}
          disabled
        />
      </Stack>
    </Card>
  );
}

function RecentSection() {
  const refresh = useProjectStore((state) => state.refresh);
  const recent = useProjectStore((state) => state.recent);
  const nav = useNavigate();
  function openRecent(path: string) {
    OpenRecentProject(path)
      .then(() => {
        refresh();
        nav("/project");
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  function deleteRecent(path: string) {
    RemoveRecentProject(path)
      .then(() => {
        refresh();
        notifySuccess("Recent project deleted");
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  return (
    <Card shadow="md" p="md" withBorder>
      <Stack gap="xs">
        <Title order={3} mb="lg">
          Recent ...
        </Title>
        <Stack gap="xs">
          {recent.map((item, index) => (
            <Group key={index} justify="space-between" wrap="nowrap">
              <NavLink
                label={item}
                leftSection={<IconFolder />}
                onClick={() => openRecent(item)}
              />
              <Button
                variant="subtle"
                onClick={() => deleteRecent(item)}
                leftSection={<IconTrash size={18} />}
              >
                Delete
              </Button>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
function MoreSection() {
  function openApiGear() {
    BrowserOpenURL("https://apigear.io");
  }
  function openDocs() {
    BrowserOpenURL("https://apigear.io/docs");
  }
  return (
    <Card shadow="md" p="md" style={{ height: "100%" }} withBorder>
      <Stack gap="xs">
        <Title order={3} mb="lg">
          More ...
        </Title>
        <NavLink
          label="About ApiGear"
          description="Design your APIs and generate your SDKs with ease."
          leftSection={<IconInfoCircle />}
          onClick={openApiGear}
        />
        <NavLink
          label="Documentation"
          description="Tutorials, best practices, open standards and more."
          leftSection={<IconBook />}
          onClick={openDocs}
        />
      </Stack>
    </Card>
  );
}

export default function WelcomePage() {
  return (
    <AppShell header={{ height: 60 }} footer={{ height: 38 }} padding="md">
      <AppShell.Header p="xs" withBorder>
        <Group justify="flex-start" px="md">
          <Image src={AppIcon} width={45} height={45} alt="ApiGear" />
          <Title order={1}>ApiGear</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Page title="Welcome">
          <Paper p="lg">
            <Stack gap="lg">
              <Grid gutter="lg" align="stretch">
                <Grid.Col span={6}>
                  <StartSection />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MoreSection />
                </Grid.Col>
                <Grid.Col span={12}>
                  <RecentSection />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Page>
      </AppShell.Main>
      <AppFooter />
    </AppShell>
  );
}
