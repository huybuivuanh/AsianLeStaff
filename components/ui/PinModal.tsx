import { useState, useEffect } from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User } from '@/types';

interface PinModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PinModal({ visible, user, onClose, onSuccess }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setPin('');
      setError('');
    }
  }, [visible]);

  const handlePinChange = (text: string) => {
    setPin(text.replace(/[^0-9]/g, ''));
    setError('');
  };

  const handleSubmit = () => {
    if (!user) return;

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    // Verify PIN
    if (user.pin === pin) {
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            {/* Modal Header */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Enter PIN
              </Text>
              <Text className="text-gray-600 dark:text-gray-400">
                {user?.name}
              </Text>
            </View>

            {/* PIN Input */}
            <View className="mb-4">
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-4 text-gray-900 dark:text-white text-2xl font-bold text-center tracking-widest"
                placeholder="Enter PIN"
                placeholderTextColor="#9CA3AF"
                value={pin}
                onChangeText={handlePinChange}
                secureTextEntry
                keyboardType="number-pad"
                maxLength={4}
                autoFocus
              />
              {error ? (
                <Text className="text-red-600 dark:text-red-400 text-sm mt-2">
                  {error}
                </Text>
              ) : null}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-3">
                <Text className="text-gray-900 dark:text-white text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={pin.length !== 4}
                className={`flex-1 bg-blue-600 dark:bg-blue-500 rounded-lg py-3 ${
                  pin.length !== 4 ? 'opacity-50' : ''
                }`}>
                <Text className="text-white text-center font-semibold">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
