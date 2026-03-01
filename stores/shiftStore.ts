import { getAllShiftsForUser } from "@/services/shiftService";
import { getTodayDateStringLocal } from "@/utils/utils";
import { create } from "zustand";

interface ShiftState {
  shifts: Shift[];
  loading: boolean;
  error: string | null;
  loadShifts: (userId: string) => Promise<void>;
  clearShifts: () => void;
  getShiftsForDate: (dateStr: string) => Shift[];
  getShiftsInRange: (startDateStr: string, endDateStr: string) => Shift[];
  getTodayLatestShift: () => Shift | null;
}

const sortShifts = (shifts: Shift[]) =>
  [...shifts].sort(
    (a, b) =>
      (b.clockInTime?.getTime() ?? b.shift.start.getTime()) -
      (a.clockInTime?.getTime() ?? a.shift.start.getTime()),
  );

export const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: [],
  loading: false,
  error: null,

  loadShifts: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const shifts = await getAllShiftsForUser(userId);
      set({ shifts, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load shifts";
      set({ loading: false, error: message });
    }
  },

  clearShifts: () => set({ shifts: [], error: null }),

  getShiftsForDate: (dateStr: string) => {
    return sortShifts(
      get().shifts.filter((s) => s.date === dateStr),
    );
  },

  getShiftsInRange: (startDateStr: string, endDateStr: string) => {
    return sortShifts(
      get().shifts.filter(
        (s) => s.date >= startDateStr && s.date <= endDateStr,
      ),
    );
  },

  getTodayLatestShift: () => {
    const today = getTodayDateStringLocal();
    const dayShifts = get().getShiftsForDate(today);
    return dayShifts[0] ?? null;
  },
}));
