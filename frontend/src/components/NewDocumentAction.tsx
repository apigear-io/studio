import { Button, Menu, Modal, Select, TextInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArmchair,
  IconCirclePlus,
  IconClockBolt,
  IconComponents,
} from "@tabler/icons-react";
import { notifyError, notifySuccess } from "../toasts";
import { useProjectStore } from "../stores/ProjectStore";
import { useNavigate } from "react-router-dom";
import useTrackAction from "../hooks/useTrackAction";

interface FormData {
  name: string;
  kind: string;
}

export default function NewDocumentAction() {
  const trackAction = useTrackAction();
  const newDocument = useProjectStore((state) => state.newDocument);
  const [opened, { open, close }] = useDisclosure();
  const nav = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      kind: "",
    } as FormData,
  });
  function openNewDocument(kind: string) {
    form.setValues({ kind: kind });
    open();
  }
  function submit(data: FormData) {
    trackAction("new_document", data.kind + "/" + data.name);
    newDocument(data.kind, data.name)
      .then(() => {
        close();
        notifySuccess("Document created successfully!");
        nav("/project");
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
            data-autofocus
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
          <Group justify="flex-start" mt="md">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
      <Menu.Target>
        <Button variant="subtle" leftSection={<IconCirclePlus />}>
          New Document
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconComponents />}
          onClick={() => openNewDocument("module")}
        >
          API Module
        </Menu.Item>
        <Menu.Item
          leftSection={<IconArmchair />}
          onClick={() => openNewDocument("solution")}
        >
          SDK Solution
        </Menu.Item>
        <Menu.Item
          leftSection={<IconClockBolt />}
          onClick={() => openNewDocument("scenario")}
        >
          Simulation Scenario
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
