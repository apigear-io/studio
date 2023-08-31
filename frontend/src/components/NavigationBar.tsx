import { Divider, Group, NavLink, Navbar, Text, Tooltip } from "@mantine/core";
import {
  IconAnalyze,
  IconArmchair,
  IconClockBolt,
  IconComponents,
  IconFolderOpen,
  IconHome,
  IconListSearch,
  IconReload,
  IconSettings,
  IconWand,
} from "@tabler/icons-react";
import { useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjectStore } from "../stores/ProjectStore";
import { BrowserOpenURL } from "../wailsjs/runtime/runtime";

interface NavbarLinkProps {
  label: string;
  icon: React.FC<any>;
  to: string;
  desc: string;
  currentTo?: string;
}

// Dashboard, Modules, Solutions, Templates, Simulation, Monitor, Logs, Settings
const modes: NavbarLinkProps[] = [
  {
    label: "Dashboard",
    icon: IconHome,
    desc: "Project dashboard",
    to: "/project",
  },
  {
    label: "Modules",
    icon: IconComponents,
    desc: "Manage API Modules",
    to: "/project/modules",
  },
  {
    label: "Solutions",
    icon: IconArmchair,
    desc: "Manage API Solutions",
    to: "/project/solutions",
  },
  {
    label: "Templates",
    icon: IconWand,
    desc: "Manage API Templates",
    to: "/project/templates",
  },
  {
    label: "Simulation",
    icon: IconClockBolt,
    desc: "Simulate API",
    to: "/project/simulation",
  },
  {
    label: "Monitor",
    icon: IconAnalyze,
    desc: "Monitor API",
    to: "/project/monitor",
  },
  {
    label: "Logs",
    icon: IconListSearch,
    desc: "View API Logs",
    to: "/project/logs",
  },
  {
    label: "Settings",
    icon: IconSettings,
    desc: "Project settings",
    to: "/project/settings",
  },
];

interface SectionHeaderProps {
  label: string;
}

function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <Group position="apart" px="md">
      <Text size="sm" weight={300} c="dimmed">
        {label}
      </Text>
    </Group>
  );
}

function NavbarLink({
  label,
  icon: Icon,
  desc,
  to,
  currentTo,
}: NavbarLinkProps) {
  const active = currentTo === to;
  return (
    <Tooltip label={desc} openDelay={1200}>
      <NavLink
        component={Link}
        to={to}
        icon={<Icon />}
        label={label}
        active={active}
      />
    </Tooltip>
  );
}

export default function NavigationBar() {
  const location = useLocation();
  const [currentTo, setCurrentTo] = useState<string>(location.pathname);
  useLayoutEffect(() => {
    setCurrentTo(location.pathname);
  }, [location]);

  return (
    <Navbar width={{ sm: 180 }} withBorder>
      <Navbar.Section grow py="md">
        <SectionHeader label="Modes" />
        {modes.map((item) => (
          <NavbarLink {...item} key={item.label} currentTo={currentTo} />
        ))}
      </Navbar.Section>
    </Navbar>
  );
}
