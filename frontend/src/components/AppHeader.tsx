import { Group, Header, Title, Button, ActionIcon, Image } from "@mantine/core";
import { IconHelpCircle, IconSwitchHorizontal } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import NewDocumentAction from "./NewDocumentAction";
import appicon from "../assets/icons/appicon-96x96.png";

export default function AppHeader() {
  const nav = useNavigate();
  function switchProject() {
    nav("/");
  }

  return (
    <Header height={60} p="xs" withBorder>
      <Group position="apart">
        <Group position="apart" px="md">
          <ActionIcon variant="transparent" radius="xl">
            <Image src={appicon} width={40} height={40} alt="ApiGear" />
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
          <Button variant="subtle" leftIcon={<IconHelpCircle />}>
            Help
          </Button>
        </Group>
      </Group>
    </Header>
  );
}
