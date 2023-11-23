import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import ReactGA from "react-ga4";
ReactGA.initialize("G-LQ3EHQGD5Z");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
