import {
  Button,
  Grid,
  Group,
  NavLink,
  Paper,
  Stack,
  Title,
  useMantineTheme,
  Text,
  ActionIcon,
  Image,
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
import { useNavigate } from "react-router-dom";
import { notifyError, notifyOpen, notifySuccess } from "../toasts";
import { useProjectStore } from "../stores/ProjectStore";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
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
    <Stack spacing="xs">
      <Title order={3}>Recent ...</Title>
      <Stack spacing="xs">
        {recent.map((item, index) => (
          <Group key={index} position="apart" noWrap>
            <NavLink
              label={item}
              icon={<IconFolder />}
              onClick={() => openRecent(item)}
            />
            <Button
              variant="link"
              onClick={() => deleteRecent(item)}
              leftIcon={<IconTrash size={18} />}
            >
              Delete
            </Button>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}
function MoreSection() {
  function openApiGear() {
    BrowserOpenURL("https://apigear.io");
  }
  function openDocs() {
    BrowserOpenURL("https://docs.apigear.io");
  }
  return (
    <Stack spacing="xs">
      <Title order={3}>More ...</Title>
      <NavLink
        label="About ApiGear"
        description="Learn more about ApiGear"
        icon={<IconInfoCircle />}
        onClick={openApiGear}
      />
      <NavLink
        label="Documentation"
        description="Read the documentation"
        icon={<IconBook />}
        onClick={openDocs}
      />
    </Stack>
  );
}

export default function WelcomePage() {
  const theme = useMantineTheme();
  return (
    <Page title="Welcome">
      <Paper p="lg">
        <Stack spacing="lg">
          <Group>
            <ActionIcon variant="transparent" radius="xl" mb="md">
              <Image src={AppIcon} width={48} height={48} alt="ApiGear" />
            </ActionIcon>
            <Stack spacing="0">              
              <Title order={1} c={theme.primaryColor}>ApiGear</Title>
              <Text fz="sm" c="dimmed" italic>
                APIs evolved
              </Text>
            </Stack>
          </Group>
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
    </Page>
  );
}
