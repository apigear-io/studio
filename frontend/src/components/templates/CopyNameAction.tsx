import { Button } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import { main } from "../../wailsjs/go/models";
import { notifySuccess } from "../../toasts";

export default function CopyNameAction({
  template,
}: {
  template: main.RepoInfo;
}) {
  function copyName(template: main.RepoInfo) {
    navigator.clipboard.writeText(template.name);
    notifySuccess(`Copied ${template.name} to clipboard`);
  }
  return (
    <Button
      variant="subtle"
      leftSection={<IconCopy />}
      onClick={() => copyName(template)}
    >
      Copy
    </Button>
  );
}
