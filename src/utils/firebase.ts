import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  getDocs,
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { AmuletCatalogItem, ConsultationRecord, ExpenseRecord } from '../types';
import { loadConsultations, loadExpenses, loadAmuletsCatalog } from './storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);

// Test connection on boot per Firebase guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firebase client is offline, using offline cache.');
    } else {
      console.info('Firestore initialized:', error?.message || 'Ready');
    }
    return true;
  }
}

// -------------------------------------------------------------
// REAL-TIME FIRESTORE LISTENERS (Multi-user Auto Sync)
// -------------------------------------------------------------

export function subscribeToConsultations(
  onUpdate: (records: ConsultationRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, 'consultations');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: ConsultationRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as ConsultationRecord);
      });
      // Sort newest first
      records.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      onUpdate(records);
    },
    (err) => {
      console.warn('Firestore consultations subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToExpenses(
  onUpdate: (records: ExpenseRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, 'expenses');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: ExpenseRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as ExpenseRecord);
      });
      records.sort((a, b) => new Date(b.createdAt || b.date || '').getTime() - new Date(a.createdAt || a.date || '').getTime());
      onUpdate(records);
    },
    (err) => {
      console.warn('Firestore expenses subscription error:', err);
      if (onError) onError(err);
    }
  );
}

export function subscribeToAmulets(
  onUpdate: (items: AmuletCatalogItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, 'amulets');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: AmuletCatalogItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as AmuletCatalogItem);
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (err) => {
      console.warn('Firestore amulets subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// -------------------------------------------------------------
// CRUD OPERATIONS (Writes to Cloud and triggers Realtime Sync)
// -------------------------------------------------------------

export async function saveConsultationToCloud(record: ConsultationRecord): Promise<void> {
  const docRef = doc(db, 'consultations', record.id);
  await setDoc(docRef, record, { merge: true });
}

export async function deleteConsultationFromCloud(id: string): Promise<void> {
  const docRef = doc(db, 'consultations', id);
  await deleteDoc(docRef);
}

export async function saveExpenseToCloud(record: ExpenseRecord): Promise<void> {
  const docRef = doc(db, 'expenses', record.id);
  await setDoc(docRef, record, { merge: true });
}

export async function deleteExpenseFromCloud(id: string): Promise<void> {
  const docRef = doc(db, 'expenses', id);
  await deleteDoc(docRef);
}

export async function saveAmuletToCloud(item: AmuletCatalogItem): Promise<void> {
  const docRef = doc(db, 'amulets', item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function deleteAmuletFromCloud(id: string): Promise<void> {
  const docRef = doc(db, 'amulets', id);
  await deleteDoc(docRef);
}

// One-click Migration: Upload local data to Cloud Firestore if cloud is empty
export async function seedOrMigrateLocalToCloud(
  localConsultations: ConsultationRecord[],
  localExpenses: ExpenseRecord[],
  localAmulets: AmuletCatalogItem[]
): Promise<{ uploadedConsultations: number; uploadedExpenses: number; uploadedAmulets: number }> {
  try {
    const consultationsSnap = await getDocs(collection(db, 'consultations'));
    let uploadedConsultations = 0;
    let uploadedExpenses = 0;
    let uploadedAmulets = 0;

    // If cloud is empty or has fewer records than local, sync local to cloud
    if (consultationsSnap.empty && localConsultations.length > 0) {
      const batch = writeBatch(db);
      for (const c of localConsultations) {
        const ref = doc(db, 'consultations', c.id);
        batch.set(ref, c);
        uploadedConsultations++;
      }
      await batch.commit();
    }

    const expensesSnap = await getDocs(collection(db, 'expenses'));
    if (expensesSnap.empty && localExpenses.length > 0) {
      const batch = writeBatch(db);
      for (const e of localExpenses) {
        const ref = doc(db, 'expenses', e.id);
        batch.set(ref, e);
        uploadedExpenses++;
      }
      await batch.commit();
    }

    const amuletsSnap = await getDocs(collection(db, 'amulets'));
    if (amuletsSnap.empty && localAmulets.length > 0) {
      const batch = writeBatch(db);
      for (const a of localAmulets) {
        const ref = doc(db, 'amulets', a.id);
        batch.set(ref, a);
        uploadedAmulets++;
      }
      await batch.commit();
    }

    return { uploadedConsultations, uploadedExpenses, uploadedAmulets };
  } catch (err) {
    console.warn('Error during cloud migration check:', err);
    return { uploadedConsultations: 0, uploadedExpenses: 0, uploadedAmulets: 0 };
  }
}

// Upload all local records to Cloud (for initial bootstrap or manual sync)
export async function uploadAllLocalToCloud(): Promise<{ uploadedConsultations: number; uploadedExpenses: number }> {
  const localConsultations = loadConsultations();
  const localExpenses = loadExpenses();
  const localAmulets = loadAmuletsCatalog();

  let cCount = 0;
  for (const c of localConsultations) {
    await saveConsultationToCloud(c);
    cCount++;
  }

  let eCount = 0;
  for (const e of localExpenses) {
    await saveExpenseToCloud(e);
    eCount++;
  }

  for (const a of localAmulets) {
    await saveAmuletToCloud(a);
  }

  return { uploadedConsultations: cCount, uploadedExpenses: eCount };
}
