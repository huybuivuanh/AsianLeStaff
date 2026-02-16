/**
 * User service - user-related helpers
 * Users are loaded from Firestore via stores/userStore (snapshot listener)
 */

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
  // TODO: e.g. addDoc(collection(db, 'clockIns'), { userId, clockInTime: serverTimestamp() })
  await new Promise((resolve) => setTimeout(resolve, 300));
  return true;
};
