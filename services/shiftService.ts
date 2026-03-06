import { db } from "@/lib/firebase";
import {
  formatDateToLocalDateString,
  getTodayDateStringLocal,
} from "@/utils/utils";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

const SHIFTS_COLLECTION = "shifts";

function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (val && typeof (val as Timestamp).toDate === "function") {
    return (val as Timestamp).toDate();
  }
  return new Date();
}

/**
 * Create a new shift (clock in).
 * - noShift: true = ad-hoc clock-in (no scheduled shift); we still store shift start/end as now for consistency.
 */
export async function createShift(
  userId: string,
  userName: string,
  options?: { noShift?: boolean },
): Promise<string> {
  const date = getTodayDateStringLocal();
  const now = serverTimestamp();
  const payload: Record<string, unknown> = {
    userId,
    userName,
    clockInTime: now,
    date,
    shift: { start: now, end: now },
  };
  if (options?.noShift === true) {
    payload.noShift = true;
  }
  const ref = await addDoc(collection(db, SHIFTS_COLLECTION), payload);
  return ref.id;
}

/**
 * Update an existing shift: set clockInTime to now (for "not clocked in" → clock in, or re-clock in).
 */
export async function updateShiftClockInTime(shiftId: string): Promise<void> {
  const ref = doc(db, SHIFTS_COLLECTION, shiftId);
  await updateDoc(ref, { clockInTime: serverTimestamp() });
}

/**
 * Get today's shifts for a user (newest first). Uses client-side date filter to avoid composite index.
 */
export async function getTodayShifts(userId: string): Promise<Shift[]> {
  const today = getTodayDateStringLocal();
  const q = query(
    collection(db, SHIFTS_COLLECTION),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  const shifts = snap.docs.map((d) => mapDocToShift(d));
  return shifts
    .filter((s) => s.date === today)
    .sort(
      (a, b) =>
        (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
        (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
    );
}

/**
 * Get today's most recent shift (for "clocked in at" display)
 */
export async function getTodayLatestShift(
  userId: string,
): Promise<Shift | null> {
  const shifts = await getTodayShifts(userId);
  return shifts[0] ?? null;
}

/**
 * Get all shifts for a user on a specific date (for schedule view).
 * dateStr format: YYYY-MM-DD
 */
export async function getShiftsForDate(
  userId: string,
  dateStr: string,
): Promise<Shift[]> {
  const q = query(
    collection(db, SHIFTS_COLLECTION),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  const shifts = snap.docs.map((d) => mapDocToShift(d));
  return shifts
    .filter((s) => s.date === dateStr)
    .sort(
      (a, b) =>
        (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
        (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
    );
}

/**
 * Get all shifts for a user (no date filter). Used for loading into the app store once.
 */
export async function getAllShiftsForUser(userId: string): Promise<Shift[]> {
  const q = query(
    collection(db, SHIFTS_COLLECTION),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  const shifts = snap.docs.map((d) => mapDocToShift(d));
  return shifts.sort(
    (a, b) =>
      (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
      (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
  );
}

/**
 * Get all shifts for a user in a date range (for schedule month grid).
 * startDateStr, endDateStr format: YYYY-MM-DD (inclusive).
 */
export async function getShiftsInRange(
  userId: string,
  startDateStr: string,
  endDateStr: string,
): Promise<Shift[]> {
  const q = query(
    collection(db, SHIFTS_COLLECTION),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  const shifts = snap.docs.map((d) => mapDocToShift(d));
  return shifts
    .filter((s) => s.date >= startDateStr && s.date <= endDateStr)
    .sort(
      (a, b) =>
        (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
        (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
    );
}

function mapDocToShift(d: QueryDocumentSnapshot): Shift {
  const data = d.data() as Record<string, unknown>;
  const shiftMap = data.shift as { start?: unknown; end?: unknown } | undefined;
  const start = shiftMap?.start != null ? toDate(shiftMap.start) : new Date();
  const end = shiftMap?.end != null ? toDate(shiftMap.end) : start;
  const clockInTime =
    data.clockInTime != null ? toDate(data.clockInTime) : null;
  const dateStored =
    data.date != null && String(data.date).trim() !== ""
      ? String(data.date)
      : formatDateToLocalDateString(start);

  return {
    id: d.id,
    userId: String(data.userId ?? ""),
    userName: String(data.userName ?? ""),
    date: dateStored,
    clockInTime,
    shift: { start, end },
    break: null,
    noShift: Boolean(data.noShift),
  };
}
