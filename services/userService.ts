import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const USERS_COLLECTION = 'users';

/**
 * Get user by ID from a users array
 */
export const getUserById = (id: string, users: User[]): User | null => {
  return users.find((user) => user.id === id) ?? null;
};

/**
 * Verify user PIN
 */
export const verifyPin = (user: User, pin: string): boolean => {
  return user.pin === pin;
};

/**
 * Clock in user: creates a shift in Firestore
 */
export const clockInUser = async (
  userId: string,
  userName: string
): Promise<boolean> => {
  const { createShift } = await import('@/services/shiftService');
  await createShift(userId, userName);
  return true;
};

/**
 * Update user PIN in Firestore
 */
export const updateUserPin = async (
  userId: string,
  newPin: string
): Promise<void> => {
  const ref = doc(db, USERS_COLLECTION, userId);
  await updateDoc(ref, {
    pin: newPin,
    updatedAt: serverTimestamp(),
  });
};
