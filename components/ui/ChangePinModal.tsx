import { updateUserPin } from '@/services/userService';
import { useState } from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

interface ChangePinModalProps {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePinModal({
  visible,
  userId,
  onClose,
  onSuccess,
}: ChangePinModalProps) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setNewPin('');
    setConfirmPin('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    const pin = newPin.replace(/[^0-9]/g, '');
    const confirm = confirmPin.replace(/[^0-9]/g, '');

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    if (pin !== confirm) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      await updateUserPin(userId, pin);
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update PIN:', err);
      setError('Failed to update PIN. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Change PIN
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Enter your new 4-digit PIN twice
            </Text>

            <TextInput
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white mb-3"
              placeholder="New PIN"
              placeholderTextColor="#9CA3AF"
              value={newPin}
              onChangeText={(t) => {
                setNewPin(t.replace(/[^0-9]/g, '').slice(0, 4));
                setError('');
              }}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
            />
            <TextInput
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white mb-3"
              placeholder="Confirm PIN"
              placeholderTextColor="#9CA3AF"
              value={confirmPin}
              onChangeText={(t) => {
                setConfirmPin(t.replace(/[^0-9]/g, '').slice(0, 4));
                setError('');
              }}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={4}
            />

            {error ? (
              <Text className="text-red-600 dark:text-red-400 text-sm mb-3">
                {error}
              </Text>
            ) : null}

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                onPress={handleClose}
                disabled={loading}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-3">
                <Text className="text-gray-900 dark:text-white text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || newPin.length !== 4 || confirmPin.length !== 4}
                className={`flex-1 bg-blue-600 dark:bg-blue-500 rounded-lg py-3 ${
                  newPin.length !== 4 || confirmPin.length !== 4 || loading
                    ? 'opacity-50'
                    : ''
                }`}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
