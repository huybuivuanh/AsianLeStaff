import SafeAreaViewWrapper from "@/components/layout/SafeAreaViewWrapper";
import DayShiftModal from "@/components/ui/DayShiftModal";
import { getUserSession } from "@/services/storageService";
import { useShiftStore } from "@/stores/shiftStore";
import { formatTimeShort } from "@/utils/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const GRID_HORIZONTAL_PADDING = 24; // p-3 both sides
const SCROLL_PADDING = 24; // contentContainerStyle padding both sides
const CELL_HEIGHT_RATIO = 4 / 3; // height = width * this for readable cells

function formatDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Build calendar grid: 6 rows × 7. Each cell is null or { dateStr, dayNum }. */
function buildMonthGrid(
  year: number,
  month: number,
): (null | { dateStr: string; dayNum: number })[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday
  const cells: (null | { dateStr: string; dayNum: number })[] = [];
  const totalCells = 6 * 7;
  for (let i = 0; i < totalCells; i++) {
    const dayOfWeek = i % 7;
    const weekIndex = Math.floor(i / 7);
    const dayOfMonth = weekIndex * 7 + dayOfWeek - firstDay + 1;
    if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
      cells.push(null);
    } else {
      cells.push({
        dateStr: formatDateStr(year, month + 1, dayOfMonth),
        dayNum: dayOfMonth,
      });
    }
  }
  return cells;
}

function isFutureDate(dateStr: string): boolean {
  const today = formatDateStr(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  );
  return dateStr > today;
}

const LATE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

function isClockedInLate(shift: Shift): boolean {
  if (!shift.clockInTime) return false;
  return (
    shift.clockInTime.getTime() >
    shift.shift.start.getTime() + LATE_THRESHOLD_MS
  );
}

export default function ScheduleScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const today = useMemo(() => new Date(), []);

  const { cellWidth, cellHeight } = useMemo(() => {
    const gridWidth = windowWidth - SCROLL_PADDING - GRID_HORIZONTAL_PADDING;
    const cw = Math.floor(gridWidth / 7);
    const ch = Math.floor(cw * CELL_HEIGHT_RATIO);
    return { cellWidth: cw, cellHeight: ch };
  }, [windowWidth]);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string>(() =>
    formatDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate()),
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayShifts, setSelectedDayShifts] = useState<Shift[] | null>(
    null,
  );

  const shifts = useShiftStore((s) => s.shifts);
  const shiftsLoading = useShiftStore((s) => s.loading);
  const getShiftsInRange = useShiftStore((s) => s.getShiftsInRange);
  const getShiftsForDate = useShiftStore((s) => s.getShiftsForDate);

  const startStr = useMemo(
    () => formatDateStr(year, month + 1, 1),
    [year, month],
  );
  const endStr = useMemo(() => {
    const days = getDaysInMonth(year, month);
    return formatDateStr(year, month + 1, days);
  }, [year, month]);

  const shiftsByDate = useMemo(() => {
    const rangeShifts = getShiftsInRange(startStr, endStr);
    const byDate: Record<string, Shift[]> = {};
    for (const s of rangeShifts) {
      if (!byDate[s.date]) byDate[s.date] = [];
      byDate[s.date].push(s);
    }
    return byDate;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shifts needed so we recompute when store updates
  }, [shifts, startStr, endStr, getShiftsInRange]);

  const hasLoadedShiftsOnce = shifts.length > 0;

  useEffect(() => {
    let cancelled = false;
    getUserSession().then((session) => {
      if (!cancelled) {
        setUserId(session?.userId ?? null);
        setUserName(session?.userName ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openDayModal = useCallback(
    (dateStr: string) => {
      setSelected(dateStr);
      setModalVisible(true);
      if (!userId) {
        setSelectedDayShifts([]);
        return;
      }
      setSelectedDayShifts(getShiftsForDate(dateStr));
    },
    [userId, getShiftsForDate],
  );

  const monthLabel = useMemo(() => {
    const d = new Date(year, month, 1);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }, [year, month]);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const goPrevMonth = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const goNextMonth = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const todayStr = useMemo(
    () =>
      formatDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate()),
    [today],
  );

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 justify-center items-center">
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            {userName ? (
              <View className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {userName}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          {/* Header: prev / month / next */}
          <View className="flex-row items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-3">
            <TouchableOpacity
              onPress={goPrevMonth}
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-lg"
              accessibilityLabel="Previous month"
            >
              <Text className="text-lg text-gray-600">‹</Text>
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-semibold tracking-tight text-gray-800">
                {monthLabel}
              </Text>
            </View>
            <TouchableOpacity
              onPress={goNextMonth}
              hitSlop={8}
              className="h-8 w-8 items-center justify-center rounded-lg"
              accessibilityLabel="Next month"
            >
              <Text className="text-lg text-gray-600">›</Text>
            </TouchableOpacity>
          </View>

          {shiftsLoading && !hasLoadedShiftsOnce ? (
            <View className="items-center py-12">
              <ActivityIndicator size="small" />
              <Text className="mt-2 text-sm text-gray-500">
                Loading schedule...
              </Text>
            </View>
          ) : (
            <View className="p-3">
              <View className="rounded-lg bg-gray-100 p-px">
                {/* Weekday headers - fixed width per column */}
                <View className="flex-row">
                  {WEEKDAYS.map((wd) => (
                    <View
                      key={wd}
                      style={{ width: cellWidth, height: 36 }}
                      className="items-center justify-center rounded-sm border-b border-r border-gray-200 bg-gray-50 last:border-r-0"
                    >
                      <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {wd}
                      </Text>
                    </View>
                  ))}
                </View>
                {/* Day grid - every cell exactly cellWidth x cellHeight */}
                {[0, 1, 2, 3, 4, 5].map((rowIndex) => (
                  <View
                    key={rowIndex}
                    style={{ flexDirection: "row", height: cellHeight }}
                  >
                    {grid
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .map((cell, colIndex) => {
                        const i = rowIndex * 7 + colIndex;
                        const cellStyle = {
                          width: cellWidth,
                          height: cellHeight,
                        };
                        if (!cell) {
                          return (
                            <View
                              key={`empty-${i}`}
                              style={cellStyle}
                              className="border-b border-r border-gray-200 bg-gray-100"
                            />
                          );
                        }
                        const { dateStr, dayNum } = cell;
                        const shifts = shiftsByDate[dateStr] ?? [];
                        const mainShift = shifts[0];
                        const isSelected = selected === dateStr;
                        const isToday = dateStr === todayStr;
                        const isPast = dateStr < todayStr;
                        const clockedInLate =
                          mainShift && isClockedInLate(mainShift);
                        const notClockedIn =
                          mainShift &&
                          !mainShift.clockInTime &&
                          isPast &&
                          !isFutureDate(dateStr);

                        const shiftTime = mainShift
                          ? mainShift.noShift
                            ? "No shift"
                            : `${formatTimeShort(mainShift.shift.start)}–${formatTimeShort(mainShift.shift.end)}`
                          : null;
                        const breakText = mainShift?.break
                          ? `${formatTimeShort(mainShift.break.start)}–${formatTimeShort(mainShift.break.end)}`
                          : "No Break";
                        const clockInText = mainShift?.clockInTime
                          ? formatTimeShort(mainShift.clockInTime)
                          : "";

                        let cellBg = "bg-white";
                        if (isSelected) cellBg = "bg-blue-600";
                        else if (clockedInLate) cellBg = "bg-red-50";
                        else if (isToday) cellBg = "bg-amber-50";

                        return (
                          <Pressable
                            key={dateStr}
                            onPress={() => openDayModal(dateStr)}
                            style={[
                              cellStyle,
                              isSelected && {
                                shadowColor: "#2563eb",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 2,
                              },
                            ]}
                            className={`flex-col items-start justify-start rounded border-b border-r border-gray-200 px-1.5 py-1 ${cellBg}`}
                          >
                            <Text
                              className={`text-sm font-semibold ${
                                isSelected
                                  ? "text-white"
                                  : isToday
                                    ? "text-amber-900"
                                    : clockedInLate
                                      ? "text-red-900"
                                      : "text-gray-800"
                              }`}
                              style={{ fontSize: 11 }}
                            >
                              {dayNum}
                            </Text>
                            {mainShift && (
                              <View className="mt-0.5 flex-1 justify-center min-h-0">
                                {shiftTime ? (
                                  <Text
                                    numberOfLines={1}
                                    style={{ fontSize: 9 }}
                                    className={`leading-tight ${
                                      isSelected
                                        ? "text-blue-100"
                                        : clockedInLate
                                          ? "text-red-700"
                                          : "text-gray-600"
                                    }`}
                                  >
                                    {shiftTime}
                                  </Text>
                                ) : null}
                                <Text
                                  numberOfLines={1}
                                  style={{ fontSize: 9 }}
                                  className={`leading-tight ${
                                    isSelected
                                      ? "text-blue-100"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {breakText}
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  style={{ fontSize: 9 }}
                                  className={`font-medium leading-tight ${
                                    isSelected
                                      ? "text-blue-200"
                                      : notClockedIn
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {mainShift.clockInTime
                                    ? `In: ${clockInText}`
                                    : notClockedIn
                                      ? "Not In"
                                      : ""}
                                </Text>
                              </View>
                            )}
                          </Pressable>
                        );
                      })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <DayShiftModal
          visible={modalVisible}
          dateString={selected}
          shifts={selectedDayShifts}
          loading={false}
          onClose={() => setModalVisible(false)}
          emptyMessage={userId ? undefined : "Log in to see your shifts."}
        />
      </ScrollView>
    </SafeAreaViewWrapper>
  );
}
