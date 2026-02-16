import { Text, View, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Profile
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Your profile information will appear here
        </Text>
      </View>
    </ScrollView>
  );
}
