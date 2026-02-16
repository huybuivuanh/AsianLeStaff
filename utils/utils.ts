import { Alert, Platform } from "react-native";

/** Format a Date to time string e.g. "2:30 PM" */
export function formatTimeOfDay(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const am = hours < 12;
  const h = hours % 12 || 12;
  const m = minutes < 10 ? `0${minutes}` : String(minutes);
  return `${h}:${m} ${am ? "AM" : "PM"}`;
}

/** Today's date as YYYY-MM-DD */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Today's date for display e.g. "Monday, February 16, 2025" */
export function getTodayDateLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Shorter date for compact UI e.g. "Mon, Feb 16, 2025" */
export function getTodayDateShort(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format YYYY-MM-DD to display label e.g. "Monday, February 16, 2025" */
export function formatDateStringToLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Cross-platform alert function
export const showAlert = (title: string, message?: string) => {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    if (message) {
      Alert.alert(title, message);
    } else {
      Alert.alert(title);
    }
  }
};

type ConfirmButtonStyle = "default" | "cancel" | "destructive";

// Cross-platform confirm (OK / Cancel); onConfirm runs when user confirms
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  confirmStyle: ConfirmButtonStyle = "default"
) => {
  if (Platform.OS === "web") {
    const confirmed = window.confirm(message ? `${title}\n\n${message}` : title);
    if (confirmed) {
      void Promise.resolve(onConfirm());
    }
  } else {
    Alert.alert(title, message, [
      { text: cancelLabel, style: "cancel" },
      {
        text: confirmLabel,
        style: confirmStyle,
        onPress: () => void Promise.resolve(onConfirm()),
      },
    ]);
  }
};
