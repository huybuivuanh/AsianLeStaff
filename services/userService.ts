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
 * Clock in user
 * TODO: Call Firestore or Cloud Function to record clock-in
 */
export const clockInUser = async (userId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
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
