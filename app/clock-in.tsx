import ScreenHeader from '@/components/layout/ScreenHeader';
import PinModal from '@/components/ui/PinModal';
import UserList from '@/components/user/UserList';
import { clockInUser, getUsers } from '@/services/userService';
import { User } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClockInScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userList = await getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowPinModal(true);
  };

  const handlePinSuccess = async () => {
    if (!selectedUser) return;

    try {
      // Clock in the user
      await clockInUser(selectedUser.id);
      
      // Close modal and navigate to home
      setShowPinModal(false);
      setSelectedUser(null);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to clock in:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCloseModal = () => {
    setShowPinModal(false);
    setSelectedUser(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 py-8">
        <ScreenHeader
          title="Clock In"
          subtitle="Select your name to clock in"
        />

        {!isLoading && <UserList users={users} onUserSelect={handleUserSelect} />}

        <PinModal
          visible={showPinModal}
          user={selectedUser}
          onClose={handleCloseModal}
          onSuccess={handlePinSuccess}
        />
      </View>
    </SafeAreaView>
  );
}
