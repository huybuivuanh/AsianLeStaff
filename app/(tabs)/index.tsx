import { Text, View, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center p-8">
        {/* Test 1: Basic Tailwind classes */}
        <View className="bg-blue-500 rounded-lg p-6 mb-4 w-full">
          <Text className="text-white text-2xl font-bold text-center">
            NativeWind Test
          </Text>
        </View>

        {/* Test 2: Colors and spacing */}
        <View className="bg-green-500 rounded-xl p-4 mb-4 w-full">
          <Text className="text-white text-lg font-semibold">
            ✓ Colors working
          </Text>
        </View>

        {/* Test 3: Flexbox and layout */}
        <View className="flex-row gap-4 mb-4 w-full">
          <View className="flex-1 bg-purple-500 rounded p-3">
            <Text className="text-white text-center">Flex 1</Text>
          </View>
          <View className="flex-1 bg-pink-500 rounded p-3">
            <Text className="text-white text-center">Flex 1</Text>
          </View>
        </View>

        {/* Test 4: Shadows and borders */}
        <View className="bg-yellow-400 rounded-lg p-4 mb-4 w-full shadow-lg border-2 border-yellow-600">
          <Text className="text-gray-900 text-center font-bold">
            Shadow & Border Test
          </Text>
        </View>

        {/* Test 5: Responsive and dark mode */}
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 w-full">
          <Text className="text-gray-900 dark:text-white text-center">
            Dark mode ready
          </Text>
        </View>

        {/* Success message */}
        <View className="mt-8 bg-green-100 dark:bg-green-900 rounded-lg p-4 w-full">
          <Text className="text-green-800 dark:text-green-200 text-center font-semibold">
            🎉 NativeWind is working correctly!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
