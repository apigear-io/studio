import { main } from "../../wailsjs/go/models";
import {
  Button,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function InfoAction({ template }: { template: main.RepoInfo }) {
  const [opened, { open, close }] = useDisclosure();
  const items = [
    {
      key: "name",
      label: "Name",
      description: "Name of the template",
      value: template.name,
    },
    {
      key: "description",
      label: "Description",
      description: "Description of the template",
      value: template.description,
    },
    {
      key: "source",
      label: "Source",
      description: "Source of the template",
      value: template.source,
    },
    {
      key: "installed",
      label: "Installed",
      description: "Whether the template is installed",
      value: template.installed ? "Yes" : "No",
    },
    {
      key: "path",
      label: "Path",
      description: "Path to the template",
      value: template.path ? template.path : "N/A",
    },
    {
      key: "versions",
      label: "Versions",
      description: "Versions of the template",
      value: template.versions.sort().join(", "),
    },
  ];
  return (
    <>
      <Modal title={`Template Info`} opened={opened} onClose={close} size="lg">
        <Stack>
          <Table>
            <tbody>
              {items.map((item) => {
                return (
                  <tr key={item.key}>
                    <td>
                      <Tooltip label={item.description}>
                        <Text>{item.label}</Text>
                      </Tooltip>
                    </td>
                    <td>{item.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Group justify="flex-end">
            <Button onClick={close}>Close</Button>
          </Group>
        </Stack>
      </Modal>
      <Button variant="subtle" leftSection={<IconInfoCircle />} onClick={open}>
        Info
      </Button>
    </>
  );
}
