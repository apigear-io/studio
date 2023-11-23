import {
  Group,
  Title,
  Text,
  Stack,
  Button,
  Paper,
  useMantineTheme,
  Divider,
} from "@mantine/core";

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
  const theme = useMantineTheme();
  return (
    <Paper>
      <Group justify="space-between" wrap="nowrap">
        <Stack gap="0">
          <Title order={1} c={theme.primaryColor}>
            {title}
          </Title>
          <Text fz="sm" c="dimmed" fs="italic">
            {description}
          </Text>
        </Stack>
        <Button.Group>{children}</Button.Group>
      </Group>
      <Divider mt="md" />
    </Paper>
  );
}
