import { AppShell, Button, Group } from "@mantine/core";
import { IconInfoCircle, IconMessages } from "@tabler/icons-react";
import AboutDialogAction from "./AboutDialogAction";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import useTrackAction from "../hooks/useTrackAction";

export default function AppFooter() {
  const trackAction = useTrackAction();
  function openDiscussions() {
    trackAction("open_discussions");
    BrowserOpenURL("https://github.com/orgs/apigear-io/discussions");
  }
  function openHome() {
    trackAction("open_home");
    BrowserOpenURL("https://apigear.io");
  }
  return (
    <AppShell.Footer>
      <Group justify="space-between" px="md">
        <AboutDialogAction />
        <Group justify="space-between" px="md">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconMessages />}
            onClick={openDiscussions}
          >
            Discussions
          </Button>
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconInfoCircle />}
            onClick={openHome}
          >
            About
          </Button>
        </Group>
      </Group>
    </AppShell.Footer>
  );
}
