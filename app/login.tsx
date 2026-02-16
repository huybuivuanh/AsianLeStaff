import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Login functionality to be implemented');
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-12">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 text-base">
                Sign in to continue to AsianLeStaff
              </Text>
            </View>

            {/* Login Form */}
            <View className="mb-6">
              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Email or Username
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white text-base"
                  placeholder="Enter your email or username"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 text-gray-900 dark:text-white text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-0 bottom-0 justify-center">
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity className="self-end mb-6">
                <Text className="text-blue-600 dark:text-blue-400 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className={`bg-blue-600 dark:bg-blue-500 rounded-lg py-4 px-6 ${
                  isLoading ? 'opacity-50' : ''
                }`}>
                <Text className="text-white text-center font-semibold text-base">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              <Text className="mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</Text>
              <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 dark:text-gray-400 text-base">
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
