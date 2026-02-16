import { Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View className="mb-6">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-gray-600 dark:text-gray-400 text-base">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
