import {
  Button,
  Menu,
  Modal,
  Select,
  TextInput,
  Group,
  NavLink,
} from "@mantine/core";
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
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  kind: string;
}

type ItemProps = {
  value: string;
  label: string;
  icon: React.FC<any>;
};

const SelectItem = forwardRef<HTMLButtonElement, ItemProps>(
  ({ value, label, icon: Icon }: ItemProps, ref) => {
    return <NavLink ref={ref} label={label} icon={<Icon />} value={value} />;
  }
);

export default function NewDocumentAction() {
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
            itemComponent={SelectItem}
            data={[
              {
                value: "module",
                label: "API Module",
                icon: IconComponents,
              },
              {
                value: "solution",
                label: "SDK Solution",
                icon: IconArmchair,
              },
              {
                value: "scenario",
                label: "Simulation Scenario",
                icon: IconClockBolt,
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
        <Menu.Item
          icon={<IconComponents />}
          onClick={() => openNewDocument("module")}
        >
          API Module
        </Menu.Item>
        <Menu.Item
          icon={<IconArmchair />}
          onClick={() => openNewDocument("solution")}
        >
          SDK Solution
        </Menu.Item>
        <Menu.Item
          icon={<IconClockBolt />}
          onClick={() => openNewDocument("scenario")}
        >
          Simulation Scenario
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
