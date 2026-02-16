import ScreenHeader from '@/components/layout/ScreenHeader';
import SafeAreaViewWrapper from '@/components/layout/SafeAreaViewWrapper';
import PinModal from '@/components/ui/PinModal';
import UserList from '@/components/user/UserList';
import { clockInUser } from '@/services/userService';
import { isAccessCodeVerified, setUserSession } from '@/services/storageService';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function ClockInScreen() {
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
      await clockInUser(selectedUser.id);
      await setUserSession(selectedUser.id, selectedUser.name);
      setShowPinModal(false);
      setSelectedUser(null);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to clock in:', err);
    }
  };

  const handleCloseModal = () => {
    setShowPinModal(false);
    setSelectedUser(null);
  };

  if (isAuthorized !== true) return null;

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 py-8">
        <ScreenHeader
          title="Clock In"
          subtitle="Select your name to clock in"
        />

        {error ? (
          <View className="rounded-lg bg-red-100 dark:bg-red-900/30 p-3 mb-4">
            <Text className="text-red-700 dark:text-red-300 text-sm">{error}</Text>
          </View>
        ) : null}
        {!loading && <UserList users={users} onUserSelect={handleUserSelect} />}

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
