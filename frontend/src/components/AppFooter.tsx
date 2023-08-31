import { Button, Footer, Group } from "@mantine/core";
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
    <Footer height={38}>
      <Group position="apart" px="md">
        <AboutDialogAction />
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
