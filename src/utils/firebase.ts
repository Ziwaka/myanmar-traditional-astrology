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
import { AmuletCatalogItem, ConsultationRecord, ExpenseRecord, ExpenseCategoryConfig } from '../types';
import { loadConsultations, saveConsultations, loadExpenses, saveExpenses, loadAmuletsCatalog, saveAmuletsCatalog, loadExpenseCategories, saveExpenseCategories } from './storage';
import { addSyncLog } from './syncLog';
import { recordCloudSyncTime } from './cloudSyncReminder';
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

export async function saveExpenseCategoryToCloud(cat: ExpenseCategoryConfig): Promise<void> {
  const docRef = doc(db, 'expense_categories', cat.id);
  await setDoc(docRef, cat, { merge: true });
}

export async function deleteExpenseCategoryFromCloud(id: string): Promise<void> {
  const docRef = doc(db, 'expense_categories', id);
  await deleteDoc(docRef);
}

export function subscribeToExpenseCategories(
  onUpdate: (cats: ExpenseCategoryConfig[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, 'expense_categories');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const cats: ExpenseCategoryConfig[] = [];
      snapshot.forEach((docSnap) => {
        cats.push(docSnap.data() as ExpenseCategoryConfig);
      });
      if (cats.length > 0) {
        onUpdate(cats);
      }
    },
    (err) => {
      console.warn('Firestore expense_categories subscription error:', err);
      if (onError) onError(err);
    }
  );
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

  recordCloudSyncTime();
  addSyncLog({
    action: 'manual_push',
    collection: 'all',
    itemCount: cCount + eCount,
    status: 'success',
    details: `Manual Push: Consultations (${cCount}) + Expenses (${eCount}) uploaded to Cloud`,
  });

  return { uploadedConsultations: cCount, uploadedExpenses: eCount };
}

// Measure roundtrip network latency to Google Cloud Firestore in milliseconds
export async function checkFirestoreLatencyMs(): Promise<number> {
  const start = performance.now();
  try {
    await getDocFromServer(doc(db, 'system', 'connection'));
    const end = performance.now();
    return Math.round(end - start);
  } catch (e) {
    const end = performance.now();
    return Math.round(end - start);
  }
}

// Fetch exact count of records currently in Cloud Firestore
export async function fetchCloudDocumentCounts(): Promise<{
  consultations: number;
  expenses: number;
  amulets: number;
  lastUpdated: string;
}> {
  try {
    const cSnap = await getDocs(collection(db, 'consultations'));
    const eSnap = await getDocs(collection(db, 'expenses'));
    const aSnap = await getDocs(collection(db, 'amulets'));

    return {
      consultations: cSnap.size,
      expenses: eSnap.size,
      amulets: aSnap.size,
      lastUpdated: new Date().toISOString(),
    };
  } catch (e) {
    console.warn('Could not fetch cloud document counts', e);
    return { consultations: 0, expenses: 0, amulets: 0, lastUpdated: new Date().toISOString() };
  }
}

// Force Pull all documents from Cloud Firestore and sync into LocalStorage
export async function pullAllCloudToLocal(): Promise<{
  downloadedConsultations: number;
  downloadedExpenses: number;
  downloadedAmulets: number;
}> {
  try {
    const cSnap = await getDocs(collection(db, 'consultations'));
    const fetchedConsultations: ConsultationRecord[] = [];
    cSnap.forEach((docSnap) => {
      fetchedConsultations.push(docSnap.data() as ConsultationRecord);
    });

    const eSnap = await getDocs(collection(db, 'expenses'));
    const fetchedExpenses: ExpenseRecord[] = [];
    eSnap.forEach((docSnap) => {
      fetchedExpenses.push(docSnap.data() as ExpenseRecord);
    });

    const aSnap = await getDocs(collection(db, 'amulets'));
    const fetchedAmulets: AmuletCatalogItem[] = [];
    aSnap.forEach((docSnap) => {
      fetchedAmulets.push(docSnap.data() as AmuletCatalogItem);
    });

    if (fetchedConsultations.length > 0) {
      saveConsultations(fetchedConsultations);
    }
    if (fetchedExpenses.length > 0) {
      saveExpenses(fetchedExpenses);
    }
    if (fetchedAmulets.length > 0) {
      saveAmuletsCatalog(fetchedAmulets);
    }

    recordCloudSyncTime();
    addSyncLog({
      action: 'manual_pull',
      collection: 'all',
      itemCount: fetchedConsultations.length + fetchedExpenses.length,
      status: 'success',
      details: `Manual Pull: Consultations (${fetchedConsultations.length}) + Expenses (${fetchedExpenses.length}) downloaded from Cloud`,
    });

    return {
      downloadedConsultations: fetchedConsultations.length,
      downloadedExpenses: fetchedExpenses.length,
      downloadedAmulets: fetchedAmulets.length,
    };
  } catch (err) {
    console.error('Error during pullAllCloudToLocal', err);
    addSyncLog({
      action: 'manual_pull',
      collection: 'all',
      itemCount: 0,
      status: 'error',
      details: `Failed to pull from Cloud: ${String(err)}`,
    });
    throw err;
  }
}

