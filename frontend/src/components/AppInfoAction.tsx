import {
  Group,
  Modal,
  Button,
  Table,
  Stack,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconExternalLink, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useAppStore } from "../stores/AppStore";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";

export default function AppInfoAction() {
  const [opened, { open, close }] = useDisclosure();
  const currentVersion = useAppStore((state) => state.currentVersion);
  const latestVersion = useAppStore((state) => state.latestVersion);
  const commitHash = useAppStore((state) => state.commitHash);
  const commitDate = useAppStore((state) => state.commitDate);

  const entries = [
    {
      label: "Homepage",
      value: "https://apigear.io",
      href: "https://apigear.io",
    },
    {
      label: "Documentation",
      value: "https://docs.apigear.io",
      href: "https://docs.apigear.io",
    },
    {
      label: "Source Code",
      value: "https://github.com/apigear-io",
      href: "https://github.com/apigear-io",
    },
    {
      label: "License",
      value: "Apache 2.0",
      href: "https://www.apache.org/licenses/LICENSE-2.0",
    },
    { label: "Current Version", value: currentVersion },
    { label: "New Version", value: latestVersion },
    { label: "Commit Hash", value: commitHash },
    { label: "Commit Date", value: commitDate },
  ];

  function openInBrowser(url: string) {
    BrowserOpenURL(url);
  }

  return (
    <>
      <Modal title="ApiGear Studio" opened={opened} onClose={close} size="lg">
        <Stack>
          <Text c="dimmed">
            ApiGear Studio helps you to manage Object APIs in an API driven
            project. It allows you to manage APIs, create SDKs as also to
            monitor and simulate your local API.
          </Text>
          <Text c="dimmed">
            ApiGear Studio helps you to manage Object APIs in an API driven
            project. It allows you to manage APIs, create SDKs as also to
            monitor and simulate your local API.
          </Text>
          <Table>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.label}>
                  <td>{entry.label}</td>
                  <td>
                    {entry.href ? (
                      <Group noWrap>
                        <Text>{entry.value}</Text>
                        <ActionIcon
                          variant="transparent"
                          onClick={() => openInBrowser(entry.href)}
                          size="xs"
                        >
                          <IconExternalLink />
                        </ActionIcon>
                      </Group>
                    ) : (
                      <Text>{entry.value}</Text>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Text>Latest version is {latestVersion}</Text>
          <Group position="right">
            <Button leftIcon={<IconX />} onClick={close}>
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Group>
        <Button
          variant="link"
          size="xs"
          leftIcon={<IconInfoCircle />}
          onClick={open}
        >
          ApiGear Studio {currentVersion}
        </Button>
      </Group>
    </>
  );
}
