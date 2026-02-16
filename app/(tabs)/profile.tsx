import SafeAreaViewWrapper from "@/components/layout/SafeAreaViewWrapper";
import ChangePinModal from "@/components/ui/ChangePinModal";
import { clearUserSession, getUserSession } from "@/services/storageService";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);

  const loadSession = useCallback(async () => {
    const session = await getUserSession();
    if (session) {
      setUserName(session.userName);
      setUserId(session.userId);
    } else {
      setUserName("");
      setUserId("");
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSession();
  }, [loadSession]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleLogout = async () => {
    await clearUserSession();
    router.replace("/user-login");
  };

  if (loading) {
    return (
      <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
        </View>
      </SafeAreaViewWrapper>
    );
  }

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Profile
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Manage your account
        </Text>

        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
          <Text className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
            Name
          </Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {userName || "Not clocked in"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowChangePin(true)}
          disabled={!userId}
          className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 ${
            !userId ? "opacity-50" : ""
          }`}
        >
          <Text className="text-gray-900 dark:text-white font-medium">
            Change PIN
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Update your 4-digit PIN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          disabled={!userId}
          className="rounded-xl bg-red-600 dark:bg-red-500 py-3.5 px-4"
        >
          <Text className="text-white font-semibold text-center text-base">
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ChangePinModal
        visible={showChangePin}
        userId={userId}
        onClose={() => setShowChangePin(false)}
        onSuccess={() => {}}
      />
    </SafeAreaViewWrapper>
  );
}
