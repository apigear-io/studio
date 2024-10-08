import { Group, Title, Button, Image, Tooltip, AppShell } from "@mantine/core";
import {
  IconFolderOpen,
  IconHelpCircle,
  IconReload,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import NewDocumentAction from "./NewDocumentAction";
import AppIcon from "../assets/icons/appicon-96x96.png";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import useTrackAction from "../hooks/useTrackAction";
import { useProjectStore } from "../stores/ProjectStore";

export default function AppHeader() {
  const project = useProjectStore((state) => state.project);
  const refresh = useProjectStore((state) => state.refresh);
  const trackAction = useTrackAction();
  const nav = useNavigate();
  function switchProject() {
    trackAction("switch-project");
    nav("/");
  }
  function openHelp() {
    trackAction("open-help");
    BrowserOpenURL("https://apigear.io/docs");
  }

  function openFolder() {
    trackAction("open-folder");
    if (!project?.path) {
      return;
    }
    BrowserOpenURL(project?.path);
  }
  function reloadProject() {
    refresh();
  }

  return (
    <AppShell.Header p="xs" withBorder>
      <Group justify="space-between">
        <Group justify="flex-start" px="md">
          <Image src={AppIcon} width={45} height={45} alt="ApiGear" />
          <Title order={1}>ApiGear</Title>
        </Group>
        <Group justify="space-between" px="md">
          <NewDocumentAction />
          <Button
            variant="subtle"
            leftSection={<IconSwitchHorizontal />}
            onClick={switchProject}
          >
            Switch Project
          </Button>
          <Button.Group>
            <Tooltip label="Open Project Folder" position="bottom">
              <Button variant="subtle" onClick={openFolder} px="xs">
                <IconFolderOpen />
              </Button>
            </Tooltip>
            <Tooltip label="Reload Project" position="bottom">
              <Button variant="subtle" onClick={reloadProject} px="xs">
                <IconReload />
              </Button>
            </Tooltip>

            <Tooltip label="Help" position="bottom">
              <Button variant="subtle" onClick={openHelp} p={0} px="xs">
                <IconHelpCircle />
              </Button>
            </Tooltip>
          </Button.Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
