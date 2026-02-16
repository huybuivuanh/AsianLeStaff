/**
 * Type definitions for the application
 */

export interface User {
  id: number;
  name: string;
  pin: string;
  email?: string;
  role?: string;
  department?: string;
}

export interface ClockInRecord {
  id: string;
  userId: number;
  userName: string;
  clockInTime: Date;
  clockOutTime?: Date;
  status: 'clocked-in' | 'clocked-out';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
