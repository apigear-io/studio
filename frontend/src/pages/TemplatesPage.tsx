import { Divider, Paper, Stack, Tabs, Title } from "@mantine/core";
import PageHeader from "../components/PageHeader";

export default function LogsPage() {
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="Template Library"
          description="Displays a list of installed and available templates that can be used to generate code."
        />
        <Divider />
        <Tabs defaultValue={"installed"}>
          <Tabs.List>
            <Tabs.Tab value="installed">Installed</Tabs.Tab>
            <Tabs.Tab value="available">Available</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="installed">
            <Title>Installed</Title>
          </Tabs.Panel>
          <Tabs.Panel value="available">
            <Title>Available</Title>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
}
