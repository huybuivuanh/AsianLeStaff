import { formatDateStringToLabel, formatTimeOfDay } from "@/utils/utils";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DayShiftModalProps {
  visible: boolean;
  dateString: string;
  shifts: Shift[] | null;
  loading: boolean;
  onClose: () => void;
  /** When set, shown instead of "No shifts recorded" when shifts are empty */
  emptyMessage?: string;
}

export default function DayShiftModal({
  visible,
  dateString,
  shifts,
  loading,
  onClose,
  emptyMessage,
}: DayShiftModalProps) {
  const dateLabel = formatDateStringToLabel(dateString);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
        style={({ pressed }) => (pressed ? { opacity: 0.98 } : undefined)}
      >
        <Pressable
          className="bg-white dark:bg-gray-900 rounded-t-2xl pt-4 pb-8 px-5"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 self-center mb-4" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {dateLabel}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your shift{shifts && shifts.length !== 1 ? "s" : ""}
          </Text>

          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Loading...
              </Text>
            </View>
          ) : shifts && shifts.length > 0 ? (
            <View className="gap-2">
              {shifts.map((shift) => (
                <View
                  key={shift.id}
                  className="flex-row items-center justify-between rounded-xl bg-gray-100 dark:bg-gray-800 py-3 px-4"
                >
                  <Text className="text-base font-medium text-gray-900 dark:text-white">
                    Clocked in
                  </Text>
                  <Text className="text-base font-semibold text-gray-700 dark:text-gray-200 tabular-nums">
                    {formatTimeOfDay(shift.clockInTime)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-6 rounded-xl bg-gray-100 dark:bg-gray-800 px-4">
              <Text className="text-center text-gray-500 dark:text-gray-400">
                {emptyMessage ?? "No shifts recorded for this day."}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-xl py-3.5"
            activeOpacity={0.8}
          >
            <Text className="text-center font-semibold text-gray-800 dark:text-gray-200">
              Close
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
