import { Text, View, ScrollView, TouchableOpacity } from 'react-native';

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

export default function UserList({ users, onUserSelect }: UserListProps) {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => onUserSelect(user)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 active:bg-gray-100 dark:active:bg-gray-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-white text-lg font-semibold">
                  {user.name}
                </Text>
                {user.email && (
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {user.email}
                  </Text>
                )}
              </View>
              <View className="bg-blue-100 dark:bg-blue-900 rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-blue-600 dark:text-blue-400 font-bold">
                  →
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
