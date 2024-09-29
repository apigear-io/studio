import {
  Group,
  Modal,
  Button,
  Table,
  Stack,
  Text,
  ActionIcon,
  Card,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconExternalLink,
  IconInfoCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { useAppStore } from "../stores/AppStore";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";
import { UpdateProgram } from "../wailsjs/go/main/App";
import { notifyError } from "../toasts";

export default function AboutDialogAction() {
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure();
  const currentVersion = useAppStore((state) => state.currentVersion);
  const latestVersion = useAppStore((state) => state.latestVersion);
  const cliVersion = useAppStore((state) => state.cliVersion);
  const commitHash = useAppStore((state) => state.commitHash);
  const commitDate = useAppStore((state) => state.commitDate);
  const refresh = useAppStore((state) => state.refresh);

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
    { label: "New Version", value: `v${latestVersion}` },
    { label: "Commit Hash", value: commitHash },
    { label: "Commit Date", value: commitDate },
    { label: "CLI Version", value: cliVersion },
  ];

  function openInBrowser(url: string) {
    BrowserOpenURL(url);
  }

  function openModal() {
    refresh();
    open();
  }

  function updateProgram() {
    toggle();
    UpdateProgram(latestVersion)
      .then(() => {
        toggle();
        close();
      })
      .catch((err) => {
        toggle();
        notifyError(err);
      });
  }

  return (
    <>
      <Modal
        title={<Title order={3}>ApiGear Studio - Disclaimer</Title>}
        opened={opened}
        onClose={close}
        size="xl"
      >
        <LoadingOverlay visible={visible} />
        <Stack gap="xs">
          <Text>Privacy</Text>
          <Text c="dimmed" fz="sm">
            ApiGear Studio uses Google Analytics and Sentry to collect anonymous
            usage data. The data helps us to improve the product. By using this
            software you agree to the collection of anonymous usage data.
          </Text>
          <Text>Disclaimer</Text>
          <Text c="dimmed" fz="sm">
            ApiGear Studio is a free and open-source project. You can find the
            source code on Github. ApiGear Studio is provided "as is" without
            warranty of any kind. In no event shall the authors or copyright
            holders be liable for any claim, damages or other liability, whether
            in an action of contract, tort or otherwise, arising from, out of or
            in connection with the software or the use or other dealings in the
            software.
          </Text>
          <Table verticalSpacing="xs">
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.label}>
                  <td>{entry.label}</td>
                  <td>
                    {entry.href ? (
                      <Group wrap="nowrap">
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
          {latestVersion && (
            <Card>
              <Text fw={700} fs="sm" c="dimmed">
                A new version is available v{latestVersion}
              </Text>
              <Button
                variant="light"
                fullWidth
                leftSection={<IconRefresh />}
                onClick={updateProgram}
                mt="md"
              >
                Update to v{latestVersion}
              </Button>
            </Card>
          )}
          {!latestVersion && (
            <Card>
              <Text fw={700} fs="sm" c="dimmed">
                You are using the latest version
              </Text>
            </Card>
          )}
        </Stack>
      </Modal>
      <Group>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconInfoCircle />}
          onClick={openModal}
        >
          ApiGear Studio {currentVersion}
        </Button>
      </Group>
    </>
  );
}
