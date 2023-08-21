import { Button, Stack, Group, NavLink, Title, Text } from "@mantine/core";
import { IconTrash, IconWand } from "@tabler/icons-react";
import { main } from "../../wailsjs/go/models";
import InfoAction from "./InfoAction";
import TemplateCopyNameAction from "./CopyNameAction";
import { notifyError, notifySuccess } from "../../toasts";
import { useCacheStore } from "../../stores/TemplatesStore";
import useTrackAction from "../../hooks/useTrackAction";

export default function CachePanel() {
  const trackAction = useTrackAction();
  const remove = useCacheStore((state) => state.remove);
  const cache = useCacheStore((state) => state.cache);
  function removeTemplate(template: main.RepoInfo) {
    trackAction("remove_template", template.name);
    console.log(template);
    remove(template)
      .then(() => {
        notifySuccess(`Removed ${template.name} from cache`);
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  return (
    <Stack p="lg">
      {cache.length === 0 && (
        <Group position="center">
          <Stack align="center">
            <Title order={4}>No templates in cache</Title>
            <Text c="dimmed">
              Install a template from the registry to get started
            </Text>
          </Stack>
        </Group>
      )}
      {cache.map((template) => {
        return (
          <Group position="apart" noWrap>
            <NavLink
              label={template.name}
              description={template.description}
              icon={<IconWand />}
            />
            <Button.Group>
              <InfoAction template={template} />
              <TemplateCopyNameAction template={template} />
              <Button
                variant="subtle"
                leftIcon={<IconTrash />}
                onClick={() => removeTemplate(template)}
              >
                Remove
              </Button>
            </Button.Group>
          </Group>
        );
      })}
    </Stack>
  );
}
