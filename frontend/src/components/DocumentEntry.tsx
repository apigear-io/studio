import { Group, NavLink, Button, Menu } from "@mantine/core";
import {
  IconArmchair,
  IconComponents,
  IconFile,
  IconClockBolt,
  IconExternalLink,
  IconCheck,
  IconCopy,
  IconDotsVertical,
} from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router-dom";
import { Document } from "../stores/ProjectStore";
import { CheckDocument, OpenSourceInEditor } from "../wailsjs/go/main/App";
import {
  notifyError,
  notifyInvalid,
  notifySuccess,
  notifyValid,
} from "../toasts";
import useTrackAction from "../hooks/useTrackAction";

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
      return "/project/modules";
    case "solution":
      return "/project/solutions";
    case "scenario":
      return "/project/simulation";
    default:
      return "/project";
  }
}
interface DocumentEntryProps {
  doc: Document;
  actions?: React.ReactNode;
}

export default function DocumentEntry(props: DocumentEntryProps) {
  const doc = props.doc;
  const Icon = IconForType(doc.type);
  const trackAction = useTrackAction();

  const openInEditor = () => {
    trackAction("open_document", doc.path);
    OpenSourceInEditor(doc.path);
  };
  const checkDocument = () => {
    trackAction("check_document", doc.path);
    CheckDocument(doc.path)
      .then((result) => {
        console.log(result);
        if (result.is_valid) {
          notifyValid(`Document ${doc.name} is valid`);
        } else {
          notifyInvalid(result.errors.join("\n"));
        }
      })
      .catch((err) => {
        notifyError(err);
      });
  };
  const copyPath = () => {
    trackAction("copy_document_path", doc.path);
    navigator.clipboard.writeText(doc.path);
    notifySuccess(`Copied path to ${doc.name} to clipboard`);
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
        {props.actions}
        <Button
          variant="subtle"
          onClick={openInEditor}
          leftIcon={<IconExternalLink />}
        >
          Open
        </Button>
        <Menu>
          <Menu.Target>
            <Button variant="subtle">
              <IconDotsVertical />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={checkDocument} icon={<IconCheck />}>
              Check
            </Menu.Item>
            <Menu.Item onClick={copyPath} icon={<IconCopy />}>
              Copy Path
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Button.Group>
    </Group>
  );
}
