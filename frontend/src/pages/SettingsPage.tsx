import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import PageHeader from "../components/PageHeader";
import { useForm } from "@mantine/form";
import { ReadSettings, WriteSettings } from "../wailsjs/go/main/App";
import { useShallowEffect } from "@mantine/hooks";
import { IconDeviceFloppy } from "@tabler/icons-react";

function ConnectionSettings() {
  useShallowEffect(() => {
    async function read() {
      const settings = await ReadSettings();
      form.setValues({ port: settings.server_port });
      form.resetDirty({ port: settings.server_port });
    }
    read();
  }, []);
  const form = useForm({
    initialValues: {
      port: "4333",
    },
  });

  function applyChanges() {
    console.log(form.values);
    ReadSettings().then((settings) => {
      settings.server_port = form.values.port;
      WriteSettings(settings)
        .then(() => {
          console.log("Settings updated");
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  return (
    <Box p="lg">
      <Stack>
        <Group position="apart">
          <Stack>
            <Title order={3}>Connection</Title>
            <Text size="sm" weight={500} c="dimmed">
              Network settings for API Studio.
            </Text>
          </Stack>
          <Button.Group>
            <Button
              variant="subtle"
              onClick={applyChanges}
              leftIcon={<IconDeviceFloppy />}
            >
              Apply Changes
            </Button>
          </Button.Group>
        </Group>
        <Divider />
        <form
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Stack spacing="xs" maw={400}>
            <TextInput
              label="Port"
              description="The port to run the API Studio server on"
              {...form.getInputProps("port")}
            />
            <TextInput
              label="Monitor Address"
              value={`http://:${form.values.port}/monitor/\${source}`}
              description="The address of the monitor endpoint"
              readOnly
            />
            <TextInput
              label="Simulation Address"
              description="The address of the simulation endpoint"
              value={`ws://:${form.values.port}/ws`}
              readOnly
            />
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

function ApplicationSettings() {
  useShallowEffect(() => {
    async function read() {
      const settings = await ReadSettings();
      form.setValues({
        updateChannel: settings.update_channel,
        editorCommand: settings.editor_command,
      });
      form.resetDirty({
        updateChannel: settings.update_channel,
        editorCommand: settings.editor_command,
      });
    }
    read();
  }, []);
  const form = useForm({
    initialValues: {
      updateChannel: "stable",
      editorCommand: "code",
    },
  });
  function applyChanges() {
    console.log(form.values);
    ReadSettings().then((settings) => {
      settings.update_channel = form.values.updateChannel;
      settings.editor_command = form.values.editorCommand;
      WriteSettings(settings)
        .then(() => {
          console.log("Settings updated");
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  return (
    <Box p="lg">
      <Stack>
        <Group position="apart">
          <Stack>
            <Title order={3}>Application</Title>
            <Text size="sm" weight={500} c="dimmed">
              Application settings for API Studio.
            </Text>
          </Stack>
          <Button.Group>
            <Button
              variant="subtle"
              onClick={applyChanges}
              leftIcon={<IconDeviceFloppy />}
            >
              Apply Changes
            </Button>
          </Button.Group>
        </Group>
        <Divider />
        <form
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          <Stack spacing="xs" maw={400}>
            <TextInput
              label="Update Channel"
              description="The update channel to use for API Studio"
              {...form.getInputProps("updateChannel")}
            />
            <TextInput
              label="Editor Command"
              description="The command to use to open the editor"
              {...form.getInputProps("editorCommand")}
            />
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}

export default function SettingsPage() {
  return (
    <Box>
      <Stack>
        <PageHeader
          title="Settings"
          description="Configure the API Studio application."
        />
        <Tabs defaultValue="connection">
          <Tabs.List>
            <Tabs.Tab value="connection">Connection</Tabs.Tab>
            <Tabs.Tab value="application">Application</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="connection">
            <ConnectionSettings />
          </Tabs.Panel>
          <Tabs.Panel value="application">
            <ApplicationSettings />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  );
}
