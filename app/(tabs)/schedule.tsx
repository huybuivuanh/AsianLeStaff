import DayShiftModal from "@/components/ui/DayShiftModal";
import SafeAreaViewWrapper from "@/components/layout/SafeAreaViewWrapper";
import { getShiftsForDate } from "@/services/shiftService";
import { getUserSession } from "@/services/storageService";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, useColorScheme } from "react-native";
import { Calendar } from "react-native-calendars";

const lightTheme = {
  backgroundColor: "#ffffff",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#6b7280",
  selectedDayBackgroundColor: "#2563eb",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#2563eb",
  dayTextColor: "#111827",
  textDisabledColor: "#d1d5db",
  dotColor: "#2563eb",
  selectedDotColor: "#ffffff",
  arrowColor: "#374151",
  monthTextColor: "#111827",
  textDayFontWeight: "500" as const,
  textMonthFontWeight: "700" as const,
};

const darkTheme = {
  backgroundColor: "#111827",
  calendarBackground: "#111827",
  textSectionTitleColor: "#9ca3af",
  selectedDayBackgroundColor: "#3b82f6",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#60a5fa",
  dayTextColor: "#f9fafb",
  textDisabledColor: "#4b5563",
  dotColor: "#3b82f6",
  selectedDotColor: "#ffffff",
  arrowColor: "#d1d5db",
  monthTextColor: "#f9fafb",
  textDayFontWeight: "500" as const,
  textMonthFontWeight: "700" as const,
};

function formatDateForCalendar(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState<string>(() =>
    formatDateForCalendar(new Date()),
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [shifts, setShifts] = useState<Shift[] | null>(null);
  const [shiftsLoading, setShiftsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const session = await getUserSession();
      if (!cancelled) setUserId(session?.userId ?? null);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!modalVisible || !selected) return;
    if (!userId) {
      setShifts([]);
      setShiftsLoading(false);
      return;
    }
    let cancelled = false;
    setShiftsLoading(true);
    setShifts(null);
    getShiftsForDate(userId, selected)
      .then((list) => {
        if (!cancelled) setShifts(list);
      })
      .finally(() => {
        if (!cancelled) setShiftsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [modalVisible, userId, selected]);

  const onDayPress = useCallback(({ dateString }: { dateString: string }) => {
    setSelected(dateString);
    setModalVisible(true);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <Calendar
            current={selected}
            onDayPress={onDayPress}
            markedDates={{
              [selected]: {
                selected: true,
                selectedColor: theme.selectedDayBackgroundColor,
                selectedTextColor: theme.selectedDayTextColor,
              },
            }}
            theme={theme}
            enableSwipeMonths
            style={{
              borderRadius: 16,
              overflow: "hidden",
              elevation: 0,
              shadowOpacity: 0,
            }}
          />
        </View>

        <DayShiftModal
          visible={modalVisible}
          dateString={selected}
          shifts={shifts}
          loading={shiftsLoading}
          onClose={() => setModalVisible(false)}
          emptyMessage={userId ? undefined : "Log in to see your shifts."}
        />
      </ScrollView>
    </SafeAreaViewWrapper>
  );
}
