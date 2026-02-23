import ScreenHeader from '@/components/layout/ScreenHeader';
import SafeAreaViewWrapper from '@/components/layout/SafeAreaViewWrapper';
import PinModal from '@/components/ui/PinModal';
import UserList from '@/components/user/UserList';
import {
  clearAccessCodeVerification,
  clearUserSession,
  isAccessCodeVerified,
  setUserSession,
} from '@/services/storageService';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function UserLoginScreen() {
  const router = useRouter();
  const { users, loading, error, startListening, stopListening } = useUserStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!(await isAccessCodeVerified())) {
        router.replace('/access-code');
        return;
      }
      setIsAuthorized(true);
    };
    check();
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;
    startListening();
    return () => stopListening();
  }, [isAuthorized, startListening, stopListening]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowPinModal(true);
  };

  const handlePinSuccess = async () => {
    if (!selectedUser) return;
    try {
      await setUserSession(selectedUser.id, selectedUser.name);
      setShowPinModal(false);
      setSelectedUser(null);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to log in:', err);
    }
  };

  const handleCloseModal = () => {
    setShowPinModal(false);
    setSelectedUser(null);
  };

  const handleLogout = async () => {
    await clearAccessCodeVerification();
    await clearUserSession();
    router.replace('/access-code');
  };

  if (isAuthorized !== true) return null;

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 py-8">
        <View className="flex-1">
          <ScreenHeader
            title="User Login"
            subtitle="Select your name to log in"
          />

          {error ? (
            <View className="rounded-lg bg-red-100 dark:bg-red-900/30 p-3 mb-4">
              <Text className="text-red-700 dark:text-red-300 text-sm">{error}</Text>
            </View>
          ) : null}
          {!loading && <UserList users={users} onUserSelect={handleUserSelect} />}
        </View>

        <View className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="rounded-xl bg-red-600 dark:bg-red-500 py-3.5 px-4"
          >
            <Text className="text-white font-semibold text-center text-base">
              Log out
            </Text>
          </TouchableOpacity>
          <Text className="text-center text-gray-500 dark:text-gray-400 text-xs mt-2">
            Back to access code
          </Text>
        </View>

        <PinModal
          visible={showPinModal}
          user={selectedUser}
          onClose={handleCloseModal}
          onSuccess={handlePinSuccess}
        />
      </View>
    </SafeAreaViewWrapper>
  );
}
