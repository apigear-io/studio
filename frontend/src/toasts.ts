import { notifications } from "@mantine/notifications";

export function notifyOpen(message: string) {
  notifications.show({
    title: "Open",
    message,
    color: "blue",
    autoClose: 5000,
    withCloseButton: true,
  });
}

export function notifyError(message: string) {
  notifications.show({
    title: "Error",
    message,
    color: "red",
    autoClose: 5000,
    withCloseButton: true,
  });
}
