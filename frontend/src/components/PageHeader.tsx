import { Group, Title, Text, Stack, Button } from "@mantine/core";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <Group position="apart">
      <Stack>
        <Title order={1}>{title}</Title>
        <Text size="sm" weight={500} c="dimmed">
          {description}
        </Text>
      </Stack>
      <Button.Group>{children}</Button.Group>
    </Group>
  );
}
