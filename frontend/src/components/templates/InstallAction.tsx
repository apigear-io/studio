import { Button, Menu } from "@mantine/core";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import { main } from "../../wailsjs/go/models";
import { notifyError, notifySuccess } from "../../toasts";
import { useCacheStore } from "../../stores/TemplatesStore";
import { useState } from "react";
import useTrackAction from "../../hooks/useTrackAction";

export default function InstallAction({
  template,
}: {
  template: main.RepoInfo;
}) {
  const trackAction = useTrackAction();
  const installFromRegistry = useCacheStore(
    (state) => state.installFromRegistry
  );
  const [loading, setLoading] = useState(false);
  function install(template: main.RepoInfo, version: string) {
    trackAction("install_template", template.name + "@" + version);
    console.log(template, version);
    setLoading(true);
    installFromRegistry(template.name, version)
      .then(() => {
        notifySuccess(`Installed ${template.name}@${version}`);
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Menu>
      <Menu.Target>
        <Button
          variant="subtle"
          leftSection={<IconDownload />}
          rightSection={<IconChevronDown />}
          loading={loading}
        >
          Install
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {template.versions.sort().map((version) => {
          return (
            <Menu.Item
              leftSection={<IconDownload />}
              onClick={() => install(template, version)}
            >
              {version}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
