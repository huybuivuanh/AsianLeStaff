import { Alert, Platform } from "react-native";

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
