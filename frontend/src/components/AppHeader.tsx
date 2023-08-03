import { Group, Header, Title, Code, Button } from "@mantine/core";
import { IconInfoCircle, IconSwitchHorizontal } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import NewDocumentMenu from "./NewDocumentMenu";

export default function AppHeader() {
  const nav = useNavigate();
  function switchProject() {
    nav("/");
  }

  return (
    <Header height={60} p="xs" withBorder>
      <Group position="apart">
        <Group position="apart" px="md">
          <Title order={1}>ApiGear</Title>
          <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
        </Group>
        <Group position="apart" px="md">
          <NewDocumentMenu />
        </Group>
        <Group position="apart" px="md">
          <Button
            variant="subtle"
            leftIcon={<IconSwitchHorizontal />}
            onClick={switchProject}
          >
            Switch Project
          </Button>
          <Button variant="subtle" leftIcon={<IconInfoCircle />}>
            Help
          </Button>
        </Group>
      </Group>
    </Header>
  );
}
