import { Group, Header, Title, Button, ActionIcon, Image } from "@mantine/core";
import { IconHelpCircle, IconSwitchHorizontal } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import NewDocumentAction from "./NewDocumentAction";
import AppIcon from "../assets/icons/appicon-96x96.png";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import useTrackAction from "../hooks/useTrackAction";

export default function AppHeader() {
  const trackAction = useTrackAction();
  const nav = useNavigate();
  function switchProject() {
    trackAction("switch-project");
    nav("/");
  }
  function openHelp() {
    trackAction("open-help");
    BrowserOpenURL("https://docs.apigear.io");
  }

  return (
    <Header height={60} p="xs" withBorder>
      <Group position="apart">
        <Group position="apart" px="md">
          <ActionIcon variant="transparent" radius="xl">
            <Image src={AppIcon} width={40} height={40} alt="ApiGear" />
          </ActionIcon>
          <Title order={1}>ApiGear</Title>
        </Group>
        <Group position="apart" px="md">
          <NewDocumentAction />
        </Group>
        <Group position="apart" px="md">
          <Button
            variant="subtle"
            leftIcon={<IconSwitchHorizontal />}
            onClick={switchProject}
          >
            Switch Project
          </Button>
          <Button
            variant="subtle"
            leftIcon={<IconHelpCircle />}
            onClick={openHelp}
          >
            Help
          </Button>
        </Group>
      </Group>
    </Header>
  );
}
