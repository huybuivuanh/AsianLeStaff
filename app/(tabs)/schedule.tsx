import SafeAreaViewWrapper from '@/components/layout/SafeAreaViewWrapper';
import { Text, View, ScrollView } from 'react-native';

export default function ScheduleScreen() {
  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
    <ScrollView className="flex-1">
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Schedule
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-center">
          Your schedule will appear here
        </Text>
      </View>
    </ScrollView>
    </SafeAreaViewWrapper>
  );
}
