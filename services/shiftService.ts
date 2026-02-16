import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SHIFTS_COLLECTION = 'shifts';

function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (val && typeof (val as Timestamp).toDate === 'function') {
    return (val as Timestamp).toDate();
  }
  return new Date();
}

/**
 * Create a new shift (clock in)
 */
export async function createShift(userId: string, userName: string): Promise<string> {
  const date = new Date().toISOString().slice(0, 10);
  const ref = await addDoc(collection(db, SHIFTS_COLLECTION), {
    userId,
    userName,
    clockInTime: serverTimestamp(),
    date,
  });
  return ref.id;
}

/**
 * Get today's shifts for a user (newest first). Uses client-side date filter to avoid composite index.
 */
export async function getTodayShifts(userId: string): Promise<Shift[]> {
  const today = new Date().toISOString().slice(0, 10);
  const q = query(
    collection(db, SHIFTS_COLLECTION),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  const shifts = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: String(data.userId ?? ''),
      userName: String(data.userName ?? ''),
      clockInTime: toDate(data.clockInTime),
      date: String(data.date ?? today),
    };
  });
  return shifts
    .filter((s) => s.date === today)
    .sort((a, b) => b.clockInTime.getTime() - a.clockInTime.getTime());
}

/**
 * Get today's most recent shift (for "clocked in at" display)
 */
export async function getTodayLatestShift(userId: string): Promise<Shift | null> {
  const shifts = await getTodayShifts(userId);
  return shifts[0] ?? null;
}
