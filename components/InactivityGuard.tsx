import { clearUserSession } from "@/services/storageService";
import { useShiftStore } from "@/stores/shiftStore";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

const IDLE_MS = 60 * 1000; // 1 minute
const WARNING_SECONDS = 15; // 15 seconds
const CHECK_INTERVAL_MS = 5000; // check every 5s

interface InactivityGuardProps {
  children: React.ReactNode;
}

export default function InactivityGuard({ children }: InactivityGuardProps) {
  const router = useRouter();
  const lastActivityRef = useRef(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_SECONDS);

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setCountdown(WARNING_SECONDS);
    }
  }, [showWarning]);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    setCountdown(WARNING_SECONDS);
    void clearUserSession().then(() => {
      useShiftStore.getState().clearShifts();
      router.replace("/user-login");
    });
  }, [router]);

  // Check idle periodically
  useEffect(() => {
    const id = setInterval(() => {
      if (showWarning) return;
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= IDLE_MS) {
        setShowWarning(true);
        setCountdown(WARNING_SECONDS);
      }
    }, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showWarning]);

  // Countdown when warning is visible
  const handleLogoutRef = useRef(handleLogout);
  handleLogoutRef.current = handleLogout;

  useEffect(() => {
    if (!showWarning) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          handleLogoutRef.current();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showWarning]);

  return (
    <View style={{ flex: 1 }} onTouchStart={recordActivity}>
      {children}
      <Modal
        visible={showWarning}
        transparent
        animationType="fade"
        onRequestClose={recordActivity}
      >
        <View className="flex-1 justify-center items-center px-6">
          <Pressable
            className="absolute inset-0 bg-black/50"
            onPress={recordActivity}
          />
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
              Still there?
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mb-4">
              You&apos;ve been inactive. Logging out in{" "}
              <Text className="font-bold tabular-nums">{countdown}</Text>{" "}
              seconds.
            </Text>
            <View className="bg-gray-100 dark:bg-gray-700 rounded-lg py-3 mb-4 items-center">
              <Text className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {countdown}
              </Text>
            </View>
            <TouchableOpacity
              onPress={recordActivity}
              className="bg-blue-600 dark:bg-blue-500 rounded-lg py-3"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">
                Stay logged in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
