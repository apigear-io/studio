import { notifications } from "@mantine/notifications";

const timeout = 3000;

export function notifyOpen(message: string) {
  notifications.show({
    title: "Open",
    message,
    color: "blue",
    autoClose: timeout,
    withCloseButton: true,
  });
}

export function notifyError(message: string) {
  notifications.show({
    title: "Error",
    message,
    color: "red",
    withCloseButton: true,
  });
}

export function notifyValid(message: string) {
  notifications.show({
    title: "Valid",
    message,
    color: "green",
    autoClose: timeout,
    withCloseButton: true,
  });
}

export function notifyInvalid(message: string) {
  notifications.show({
    title: "Invalid",
    message,
    color: "red",
    autoClose: false,
    withCloseButton: true,
  });
}

export function notifySuccess(message: string) {
  notifications.show({
    title: "Success",
    message,
    color: "green",
    autoClose: timeout,
    withCloseButton: true,
  });
}
