import { Button, Menu, Modal, Select, TextInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { NewDocument } from "../wailsjs/go/main/App";
import { notifyError } from "../toasts";
import { useProjectStore } from "../stores/ProjectStore";

interface FormData {
  name: string;
  kind: string;
}

export default function NewDocumentMenu() {
  const refresh = useProjectStore((state) => state.refresh);
  const [opened, { open, close }] = useDisclosure();
  const form = useForm({
    initialValues: {
      name: "",
      kind: "",
    } as FormData,
  });
  function newDocument(kind: string) {
    form.setValues({ kind: kind });
    open();
  }
  function submit(data: FormData) {
    NewDocument(data.kind, data.name)
      .then(() => {
        refresh();
        close();
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  return (
    <Menu shadow="md">
      <Modal opened={opened} onClose={close} size="sm" title="New Document">
        <form
          onSubmit={form.onSubmit((values) => {
            submit(values);
          })}
        >
          <TextInput
            label="Name"
            placeholder="Name"
            required
            {...form.getInputProps("name")}
          />
          <Select
            label="Kind"
            placeholder="Kind"
            required
            {...form.getInputProps("kind")}
            data={[
              {
                value: "module",
                label: "API Module",
              },
              {
                value: "solution",
                label: "SDK Solution",
              },
              {
                value: "scenario",
                label: "Simulation Scenario",
              },
            ]}
          />
          <Group position="right" mt="md">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
      <Menu.Target>
        <Button variant="subtle" leftIcon={<IconCirclePlus />}>
          New Document
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => newDocument("module")}>API Module</Menu.Item>
        <Menu.Item onClick={() => newDocument("solution")}>
          SDK Solution
        </Menu.Item>
        <Menu.Item onClick={() => newDocument("scenario")}>
          Simulation Scenario
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
