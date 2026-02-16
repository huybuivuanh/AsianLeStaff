import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Unsubscribe } from 'firebase/firestore';
import { create } from 'zustand';

const USERS_COLLECTION = 'users';

function mapDocToUser(doc: import('firebase/firestore').QueryDocumentSnapshot): User {
  const data = doc.data();
  const createdAt = data?.createdAt?.toDate?.() ?? new Date();
  const updatedAt = data?.updatedAt?.toDate?.() ?? new Date();
  return {
    id: doc.id,
    name: typeof data?.name === 'string' ? data.name : '',
    pin: typeof data?.pin === 'string' ? data.pin : '',
    createdAt,
    updatedAt,
  };
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  unsubscribe: Unsubscribe | null;
  startListening: () => void;
  stopListening: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: true,
  error: null,
  unsubscribe: null,

  startListening: () => {
    set({ loading: true, error: null });
    const colRef = collection(db, USERS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const users = snapshot.docs
          .map(mapDocToUser)
          .sort((a, b) => a.name.localeCompare(b.name));
        set({ users, loading: false, error: null });
      },
      (err) => {
        console.error('Users snapshot error:', err);
        set({
          loading: false,
          error: err?.message ?? 'Failed to load users',
        });
      }
    );
    set({ unsubscribe });
  },

  stopListening: () => {
    const state = useUserStore.getState();
    if (state.unsubscribe) {
      state.unsubscribe();
      set({ unsubscribe: null });
    }
  },
}));
