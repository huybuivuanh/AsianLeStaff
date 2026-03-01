import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  createShift,
  updateShiftClockInTime,
} from '@/services/shiftService';

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
 * Clock in user:
 * - No shift today → create a new shift with noShift: true (ad-hoc clock-in).
 * - Has shift today (not clocked in or re-clock in) → update that shift's clockInTime to now.
 */
export const clockInUser = async (
  userId: string,
  userName: string,
  existingShiftId?: string
): Promise<boolean> => {
  if (existingShiftId) {
    await updateShiftClockInTime(existingShiftId);
  } else {
    await createShift(userId, userName, { noShift: true });
  }
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
