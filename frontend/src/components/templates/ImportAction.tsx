import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifyError, notifySuccess } from "../../toasts";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { IconFileImport } from "@tabler/icons-react";
import { useCacheStore } from "../../stores/TemplatesStore";
import useTrackAction from "../../hooks/useTrackAction";

export default function ImportAction() {
  const trackAction = useTrackAction();
  const [opened, { open, close }] = useDisclosure();
  const installFromSource = useCacheStore((state) => state.installFromSource);
  const form = useForm({
    initialValues: {
      url: "",
    },
  });
  function onSubmit(values: { url: string }) {
    trackAction("import_template", values.url);
    installFromSource(values.url)
      .then(() => {
        notifySuccess("Template imported successfully!");
        close();
      })
      .catch((err) => {
        notifyError(err);
      });
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Import Template from Git URL"
      >
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <Stack>
            <TextInput
              label="URL"
              description="The URL of the git repository to import."
              required
              data-autofocus
              {...form.getInputProps("url")}
            />
            <Group justify="flex-start">
              <Button onClick={close}>Cancel</Button>
              <Button type="submit">Import</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Group>
        <Button
          variant="subtle"
          onClick={open}
          leftSection={<IconFileImport />}
        >
          Import
        </Button>
      </Group>
    </>
  );
}
