import { Group, NavLink, AppShell, Text, Tooltip } from "@mantine/core";
import {
  IconAnalyze,
  IconArmchair,
  IconClockBolt,
  IconComponents,
  IconHome,
  IconListSearch,
  IconSettings,
  IconWand,
} from "@tabler/icons-react";
import { useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
    label: "Templates",
    icon: IconWand,
    desc: "Manage API Templates",
    to: "/project/templates",
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
    <Group justify="space-between" px="md">
      <Text size="sm" fw={300} c="dimmed">
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
        leftSection={<Icon />}
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
    <AppShell.Navbar withBorder>
      <AppShell.Section grow py="md">
        <SectionHeader label="Modes" />
        {modes.map((item) => (
          <NavbarLink {...item} key={item.label} currentTo={currentTo} />
        ))}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
