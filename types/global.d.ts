/**
 * Global type definitions — use these types without importing.
 * Add new shared types here.
 */
declare global {
  interface User {
    id: number;
    name: string;
    pin: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface ClockInRecord {
    id: string;
    userId: number;
    userName: string;
    clockInTime: Date;
    clockOutTime?: Date;
    status: "clocked-in" | "clocked-out";
  }

  interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  }
}

export {};
