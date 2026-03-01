import {
  formatDateStringToLabel,
  formatTimeShort,
  getTodayDateStringLocal,
} from "@/utils/utils";
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
          className="bg-white dark:bg-gray-900 rounded-t-2xl pt-3 pb-5 px-4"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-8 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600 self-center mb-3" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5">
            {dateLabel}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Your shift{shifts && shifts.length !== 1 ? "s" : ""}
          </Text>

          {loading ? (
            <View className="py-5 items-center">
              <ActivityIndicator size="small" />
              <Text className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm">
                Loading...
              </Text>
            </View>
          ) : shifts && shifts.length > 0 ? (
            <View className="gap-2">
              {shifts.map((shift) => {
                const shiftTime = shift.noShift
                  ? "No shift"
                  : `${formatTimeShort(shift.shift.start)}–${formatTimeShort(shift.shift.end)}`;
                const breakText = shift.break
                  ? `${formatTimeShort(shift.break.start)}–${formatTimeShort(shift.break.end)}`
                  : "No Break";
                const clockInText = shift.clockInTime
                  ? formatTimeShort(shift.clockInTime)
                  : "";
                const isPast = dateString < getTodayDateStringLocal();
                const notClockedIn = !shift.clockInTime && isPast;
                return (
                  <View
                    key={shift.id}
                    className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3"
                  >
                    <Text className="text-sm font-medium text-gray-900 dark:text-white tabular-nums">
                      {shiftTime}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {breakText}
                    </Text>
                    {shift.clockInTime ? (
                      <Text className="text-sm font-medium mt-0.5 text-gray-700 dark:text-gray-200 tabular-nums">
                        In: {clockInText}
                      </Text>
                    ) : notClockedIn ? (
                      <Text className="text-sm font-medium mt-0.5 text-red-600 dark:text-red-400">
                        Not In
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="py-4 rounded-lg bg-gray-100 dark:bg-gray-800 px-3">
              <Text className="text-center text-base text-gray-500 dark:text-gray-400">
                {emptyMessage ?? "No shifts recorded for this day."}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-lg py-2.5"
            activeOpacity={0.8}
          >
            <Text className="text-center text-base font-semibold text-gray-800 dark:text-gray-200">
              Close
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
