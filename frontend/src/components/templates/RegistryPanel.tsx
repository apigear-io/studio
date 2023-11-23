import { Stack, Group, NavLink, Button, Title, Text } from "@mantine/core";
import { IconWand } from "@tabler/icons-react";
import TemplateInfoAction from "./InfoAction";
import TemplateInstallAction from "./InstallAction";
import TemplateCopyNameAction from "./CopyNameAction";
import { useRegistryStore } from "../../stores/TemplatesStore";

export default function RegistryPanel() {
  const registry = useRegistryStore((state) => state.registry);
  return (
    <Stack p="lg">
      {registry.length === 0 && (
        <Group justify="center">
          <Stack align="center">
            <Title order={4}>No templates in registry</Title>
            <Text c="dimmed">
              Try to refresh the registry or import a template from a URL
            </Text>
          </Stack>
        </Group>
      )}
      {registry.map((template) => {
        return (
          <Group justify="space-between" wrap="nowrap">
            <NavLink
              label={template.name}
              description={template.description}
              leftSection={<IconWand />}
            />
            <Button.Group>
              <TemplateInfoAction template={template} />
              <TemplateInstallAction template={template} />
              <TemplateCopyNameAction template={template} />
            </Button.Group>
          </Group>
        );
      })}
    </Stack>
  );
}
