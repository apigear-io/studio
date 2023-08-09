import { Button, Footer, Group } from "@mantine/core";
import { IconInfoCircle, IconMessages } from "@tabler/icons-react";
import AppInfoAction from "./AppInfoAction";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";

export default function AppFooter() {
  function openDiscussions() {
    BrowserOpenURL("https://github.com/orgs/apigear-io/discussions");
  }
  function openHome() {
    BrowserOpenURL("https://apigear.io");
  }
  return (
    <Footer height={38}>
      <Group position="apart" px="md">
        <AppInfoAction />
        <Group position="apart" px="md">
          <Button
            variant="link"
            size="xs"
            leftIcon={<IconMessages />}
            onClick={openDiscussions}
          >
            Discussions
          </Button>
          <Button
            variant="link"
            size="xs"
            leftIcon={<IconInfoCircle />}
            onClick={openHome}
          >
            About
          </Button>
        </Group>
      </Group>
    </Footer>
  );
}
