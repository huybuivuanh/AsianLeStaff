import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'accessCode';
const DOCUMENT_ID = 'AsianLeRestaurant';
const FIELD_CODE = 'code';

/**
 * Fetch the access code from Firestore.
 * Document: accessCode / AsianLeRestaurant, field: code
 */
export async function getAccessCodeFromFirestore(): Promise<string | null> {
  try {
    const ref = doc(db, COLLECTION, DOCUMENT_ID);
    const snap = await getDoc(ref);
    const data = snap.data();
    const code = data?.[FIELD_CODE];
    return typeof code === 'string' ? code.trim() : null;
  } catch (error) {
    console.error('Failed to fetch access code from Firestore:', error);
    return null;
  }
}
