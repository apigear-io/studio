import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme: MantineThemeOverride = {
  colorScheme: "dark",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
