import { Button, Code, Footer, Group } from "@mantine/core";
import { IconInfoCircle, IconMessages } from "@tabler/icons-react";
import AppInfoAction from "./AppInfoAction";

export default function AppFooter() {
  return (
    <Footer height={38}>
      <Group position="apart" px="md">
        <AppInfoAction />
        <Button variant="link" size="sm">
          ApiGear Studio <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
        </Button>
        <Group position="apart" px="md">
          <Button variant="link" size="xs" leftIcon={<IconMessages />}>
            Discussions
          </Button>
          <Button variant="link" size="xs" leftIcon={<IconInfoCircle />}>
            About
          </Button>
        </Group>
      </Group>
    </Footer>
  );
}
