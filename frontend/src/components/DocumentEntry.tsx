import { Group, NavLink, Button } from "@mantine/core";
import {
  IconArmchair,
  IconComponents,
  IconFile,
  IconClockBolt,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { Document } from "../stores/ProjectStore";
import { OpenSourceInEditor } from "../wailsjs/go/main/App";

function IconForType(type: string): React.FC<any> {
  switch (type) {
    case "module":
      return IconComponents;
    case "solution":
      return IconArmchair;
    case "scenario":
      return IconClockBolt;
    default:
      return IconFile;
  }
}

function RouteForType(type: string): string {
  switch (type) {
    case "module":
      return "project/module";
    case "solution":
      return "project/solution";
    case "scenario":
      return "project/simulation";
    default:
      return "/project";
  }
}
interface DocumentEntryProps {
  doc: Document;
}

export default function DocumentEntry(props: DocumentEntryProps) {
  const doc = props.doc;
  const Icon = IconForType(doc.type);

  const openInEditor = () => {
    OpenSourceInEditor(doc.path);
  };
  return (
    <Group position="apart" noWrap>
      <NavLink
        component={Link}
        to={RouteForType(doc.type)}
        state={doc}
        label={doc.name}
        icon={<Icon />}
        description={doc.path}
      />
      <Button.Group>
        <Button variant="subtle" onClick={openInEditor}>
          Edit
        </Button>
        <Button variant="subtle">Delete</Button>
      </Button.Group>
    </Group>
  );
}
