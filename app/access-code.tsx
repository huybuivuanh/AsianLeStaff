import ScreenHeader from '@/components/layout/ScreenHeader';
import SafeAreaViewWrapper from '@/components/layout/SafeAreaViewWrapper';
import { APP_ACCESS_CODE } from '@/constants/config';
import { isAccessCodeVerified, setAccessCodeVerified } from '@/services/storageService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AccessCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (await isAccessCodeVerified()) {
        router.replace('/clock-in');
      }
      setChecking(false);
    };
    check();
  }, [router]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter the access code');
      return;
    }

    if (code.trim().toUpperCase() === APP_ACCESS_CODE.toUpperCase()) {
      await setAccessCodeVerified(true);
      router.replace('/clock-in');
    } else {
      setError('Invalid access code. Please try again.');
      setCode('');
    }
  };

  if (checking) return null;

  return (
    <SafeAreaViewWrapper className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-center px-6">
          <ScreenHeader
            title="Welcome"
            subtitle="Enter access code to continue"
          />

          <View className="mb-6">
            <TextInput
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-4 text-gray-900 dark:text-white text-lg font-semibold text-center tracking-wider uppercase"
              placeholder="Enter access code"
              placeholderTextColor="#9CA3AF"
              value={code}
              onChangeText={(text) => {
                setCode(text.toUpperCase());
                setError('');
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
            />
            {error ? (
              <Text className="text-red-600 dark:text-red-400 text-sm mt-2 text-center">
                {error}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!code.trim()}
            className={`bg-blue-600 dark:bg-blue-500 rounded-lg py-4 px-6 ${
              !code.trim() ? 'opacity-50' : ''
            }`}>
            <Text className="text-white text-center font-semibold text-base">
              Continue
            </Text>
          </TouchableOpacity>

          <View className="mt-8">
            <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
              Contact your administrator if you don&apos;t have the access code
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaViewWrapper>
  );
}
