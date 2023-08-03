import {
  Divider,
  Grid,
  Group,
  NavLink,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBook,
  IconFileImport,
  IconFolder,
  IconFolderOpen,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";
import {
  CreateProject,
  OpenProject,
  OpenRecentProject,
} from "../wailsjs/go/main/App";
import { useNavigate } from "react-router-dom";
import { notifyError, notifyOpen } from "../toasts";
import { useProjectStore } from "../stores/ProjectStore";

function StartSection() {
  const nav = useNavigate();
  function openProject() {
    OpenProject()
      .then(() => {
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
    <Stack spacing="xs">
      <Title order={3}>Start ...</Title>
      <NavLink
        label="Create Project"
        description="Create a new API driven project"
        icon={<IconPlus />}
        onClick={createProject}
      />
      <NavLink
        label="Open Project"
        description="Open an existing API driven project"
        icon={<IconFolderOpen />}
        onClick={openProject}
      />
      <NavLink
        label="Import Project"
        description="Import an existing API driven project"
        icon={<IconFileImport />}
        onClick={importProject}
        disabled
      />
    </Stack>
  );
}

function RecentSection() {
  const recent = useProjectStore((state) => state.recent);
  const nav = useNavigate();
  function openRecent(path: string) {
    OpenRecentProject(path)
      .then(() => {
        nav("/project");
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  return (
    <Stack spacing="xs">
      <Title order={3}>Recent ...</Title>
      {recent.map((item, index) => (
        <NavLink
          key={index}
          label={item}
          icon={<IconFolder />}
          onClick={() => openRecent(item)}
        />
      ))}
    </Stack>
  );
}
function MoreSection() {
  return (
    <Stack spacing="xs">
      <Title order={3}>More ...</Title>
      <NavLink
        component="a"
        href="https://apigear.io"
        label="About ApiGear"
        description="Learn more about ApiGear"
        icon={<IconInfoCircle />}
      />
      <NavLink
        component="a"
        href="https://docs.apigear.io"
        label="Documentation"
        description="Read the documentation"
        icon={<IconBook />}
      />
    </Stack>
  );
}

export default function WelcomePage() {
  return (
    <Paper p="lg">
      <Stack spacing="lg">
        <Group>
          <Stack spacing="0">
            <Title order={1}>ApiGear Studio</Title>
            <Text c="dimmed">APIs evolved</Text>
          </Stack>
        </Group>
        <Divider />
        <Grid gutter="lg">
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
  );
}
