import SafeAreaViewWrapper from "@/components/layout/SafeAreaViewWrapper";
import { clearUserSession, getUserSession } from "@/services/storageService";
import { clockInUser } from "@/services/userService";
import { useShiftStore } from "@/stores/shiftStore";
import {
  formatTimeOfDay,
  getTodayDateShort,
  getTodayDateStringLocal,
  showAlert,
} from "@/utils/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const shifts = useShiftStore((s) => s.shifts);
  const loadShifts = useShiftStore((s) => s.loadShifts);

  const todayShift = useMemo(() => {
    const today = getTodayDateStringLocal();
    const dayShifts = shifts
      .filter((s) => s.date === today)
      .sort(
        (a, b) =>
          (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
          (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
      );
    return dayShifts[0] ?? null;
  }, [shifts]);

  useEffect(() => {
    let cancelled = false;
    getUserSession().then((session) => {
      if (cancelled) return;
      if (!session) {
        setUserId("");
        setUserName("");
      } else {
        setUserId(session.userId);
        setUserName(session.userName);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    await loadShifts(userId);
    setRefreshing(false);
  }, [userId, loadShifts]);

  const handleClockIn = async () => {
    if (!userId || !userName) {
      router.push("/user-login");
      return;
    }
    try {
      await clockInUser(userId, userName, todayShift?.id);
      const time = formatTimeOfDay(new Date());
      showAlert("Clocked in", `Clocked in at ${time}`);
      await loadShifts(userId);
    } catch (err) {
      console.error("Failed to clock in:", err);
    }
  };

  const handleReClockIn = async () => {
    if (!userId || !userName) {
      router.push("/user-login");
      return;
    }
    try {
      await clockInUser(userId, userName, todayShift?.id);
      const time = formatTimeOfDay(new Date());
      showAlert("Clocked in", `Clocked in at ${time}`);
      await loadShifts(userId);
    } catch (err) {
      console.error("Failed to clock in:", err);
    }
  };

  const handleLogout = async () => {
    await clearUserSession();
    useShiftStore.getState().clearShifts();
    router.replace("/user-login");
  };

  const todayLabel = getTodayDateShort();

  if (loading) {
    return (
      <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size="large" />
          <Text className="text-gray-500 dark:text-gray-400 mt-3">
            Loading...
          </Text>
        </View>
      </SafeAreaViewWrapper>
    );
  }

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Home
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <View className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {todayLabel}
              </Text>
            </View>
            <View className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 tabular-nums">
                {formatTimeOfDay(now)}
              </Text>
            </View>
            {userName ? (
              <View className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {userName}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
          <Text className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">
            Today&apos;s shift
          </Text>
          {!todayShift ? (
            <>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                No shift today.
              </Text>
              <TouchableOpacity
                onPress={handleClockIn}
                className="bg-blue-600 dark:bg-blue-500 rounded-xl py-4 px-4 active:opacity-90"
              >
                <Text className="text-white font-semibold text-center text-base">
                  Clock in
                </Text>
              </TouchableOpacity>
            </>
          ) : todayShift.clockInTime ? (
            <>
              <View className="flex-row items-center justify-between flex-wrap gap-2">
                <View>
                  {todayShift.noShift ? (
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      No shift scheduled
                    </Text>
                  ) : (
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      Shift {formatTimeOfDay(todayShift.shift.start)} –{" "}
                      {formatTimeOfDay(todayShift.shift.end)}
                    </Text>
                  )}
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                    Clocked in at {formatTimeOfDay(todayShift.clockInTime)} ·{" "}
                    {userName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleReClockIn}
                className="mt-4 bg-amber-500 dark:bg-amber-600 rounded-xl py-3 px-4 active:opacity-80"
              >
                <Text className="text-white font-semibold text-center">
                  Re-clock in
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Shift {formatTimeOfDay(todayShift.shift.start)} –{" "}
                {formatTimeOfDay(todayShift.shift.end)}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">
                Not clocked in.
              </Text>
              <TouchableOpacity
                onPress={handleClockIn}
                className="bg-blue-600 dark:bg-blue-500 rounded-xl py-4 px-4 active:opacity-90"
              >
                <Text className="text-white font-semibold text-center text-base">
                  Clock in
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="mt-auto pt-8 pb-4 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="rounded-xl bg-red-600 dark:bg-red-500 py-3.5 px-4"
          >
            <Text className="text-white font-semibold text-center text-base">
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaViewWrapper>
  );
}
