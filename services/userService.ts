/**
 * User service - handles user data operations
 * Replace with actual API calls when backend is ready
 */

// Mock user data - replace with API call
const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', pin: '1234', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', pin: '5678', email: 'jane@example.com' },
  { id: 3, name: 'Mike Johnson', pin: '9012', email: 'mike@example.com' },
  { id: 4, name: 'Sarah Williams', pin: '3456', email: 'sarah@example.com' },
  { id: 5, name: 'David Brown', pin: '7890', email: 'david@example.com' },
  { id: 6, name: 'Emily Davis', pin: '2468', email: 'emily@example.com' },
  { id: 7, name: 'Chris Wilson', pin: '1357', email: 'chris@example.com' },
  { id: 8, name: 'Lisa Anderson', pin: '9876', email: 'lisa@example.com' },
];

/**
 * Get all users
 * TODO: Replace with actual API call
 */
export const getUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_USERS;
};

/**
 * Get user by ID
 * TODO: Replace with actual API call
 */
export const getUserById = async (id: number): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_USERS.find((user) => user.id === id) || null;
};

/**
 * Verify user PIN
 */
export const verifyPin = (user: User, pin: string): boolean => {
  return user.pin === pin;
};

/**
 * Clock in user
 * TODO: Replace with actual API call
 */
export const clockInUser = async (userId: number): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In real implementation, this would call your backend API
  return true;
};
