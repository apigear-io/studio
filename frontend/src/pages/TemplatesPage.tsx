import { Paper, Stack, Tabs, Button } from "@mantine/core";
import PageHeader from "../components/PageHeader";
import { IconRefresh } from "@tabler/icons-react";
import ImportAction from "../components/templates/ImportAction";
import CachePanel from "../components/templates/CachePanel";
import RegistryPanel from "../components/templates/RegistryPanel";
import { useRegistryStore } from "../stores/TemplatesStore";
import { notifyError, notifySuccess } from "../toasts";

export default function TemplatesPage() {
  const update = useRegistryStore((state) => state.update);
  function refresh() {
    console.log("refresh");
    update()
      .then(() => {
        notifySuccess("Updated registry");
      })
      .catch((err) => {
        notifyError(err);
      });
  }
  return (
    <Paper>
      <Stack>
        <PageHeader
          title="SDK Templates"
          description="Displays a list of installed and available templates that can be used to generate code."
        >
          <>
            <Button
              variant="subtle"
              onClick={refresh}
              leftIcon={<IconRefresh />}
            >
              Refresh Registry
            </Button>
            <ImportAction />
          </>
        </PageHeader>
        <Tabs defaultValue={"installed"}>
          <Tabs.List>
            <Tabs.Tab value="installed">Installed</Tabs.Tab>
            <Tabs.Tab value="available">Available</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="installed">
            <CachePanel />
          </Tabs.Panel>
          <Tabs.Panel value="available">
            <RegistryPanel />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
}
