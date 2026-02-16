import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage service for persisting app data
 * TODO: Install @react-native-async-storage/async-storage if not already installed
 */

const ACCESS_CODE_KEY = '@app_access_code_verified';
const USER_SESSION_KEY = '@user_session';

/**
 * Store that access code has been verified
 * This allows users to skip the access code screen on subsequent app opens
 */
export const setAccessCodeVerified = async (verified: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCESS_CODE_KEY, JSON.stringify(verified));
  } catch (error) {
    console.error('Failed to save access code verification:', error);
  }
};

/**
 * Check if access code has been verified
 */
export const isAccessCodeVerified = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ACCESS_CODE_KEY);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Failed to read access code verification:', error);
    return false;
  }
};

/**
 * Clear access code verification (for logout/reset)
 */
export const clearAccessCodeVerification = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACCESS_CODE_KEY);
  } catch (error) {
    console.error('Failed to clear access code verification:', error);
  }
};

/**
 * Store user session data (after clock-in)
 */
export const setUserSession = async (
  userId: string,
  userName: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      USER_SESSION_KEY,
      JSON.stringify({ userId, userName, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Failed to save user session:', error);
  }
};

/**
 * Get user session data
 */
export const getUserSession = async (): Promise<{
  userId: string;
  userName: string;
  timestamp: number;
} | null> => {
  try {
    const value = await AsyncStorage.getItem(USER_SESSION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    return {
      userId: String(parsed.userId ?? ''),
      userName: String(parsed.userName ?? ''),
      timestamp: Number(parsed.timestamp ?? 0),
    };
  } catch (error) {
    console.error('Failed to read user session:', error);
    return null;
  }
};

/**
 * Clear user session
 */
export const clearUserSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear user session:', error);
  }
};
