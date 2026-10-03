import { AmuletCatalogItem, YatraCatalogItem, ConsultationRecord, ExpenseRecord, ExpenseCategoryConfig } from '../types';
import { getDeviceId } from './deviceProfile';

const STORAGE_KEYS = {
  CONSULTATIONS: 'myanmar_astrology_consultations_v2_clean',
  EXPENSES: 'myanmar_astrology_expenses_v2_clean',
  EXPENSE_CATEGORIES: 'myanmar_astrology_expense_categories_v1',
  AMULETS: 'myanmar_astrology_amulets_v2',
  YATRA_CATALOG: 'myanmar_astrology_yatra_catalog_v1',
  CUSTOM_SERVICES: 'myanmar_astrology_custom_services_history_v1',
  CUSTOM_YATRAS: 'myanmar_astrology_custom_yatras_history_v1',
};

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryConfig[] = [
  {
    id: 'cat_yatra',
    name: 'ယတြာနှင့် ပစ္စည်းဝယ်ယူစရိတ်',
    subCategories: ['ပန်း/သီးနှံ/ဖယောင်းတိုင်', 'ယတြာအိုး/အလံ/စာရွက်', 'အဆောင်ပစ္စည်း/ကတ်တလောက်', 'ဓာတ်ရုပ်/ရုပ်ပွားတော်'],
    color: '#f59e0b',
  },
  {
    id: 'cat_rent',
    name: 'ဆိုင်/ဓမ္မာရုံ/အခန်း စရိတ်',
    subCategories: ['အခန်းငှားခ', 'လျှပ်စစ်မီးခ/ရေဖိုး', 'အင်တာနက်/ဖုန်းဘေလ်', 'ပြင်ဆင်စရိတ်'],
    color: '#3b82f6',
  },
  {
    id: 'cat_staff',
    name: 'ဝန်ထမ်းနှင့် အကူစရိတ်',
    subCategories: ['ဝန်ထမ်းလစာ/နေ့တွက်', 'မုန့်ဖိုး/ဧည့်ခံစရိတ်', 'ခရီးစရိတ်/ကားခ'],
    color: '#10b981',
  },
  {
    id: 'cat_hospitality',
    name: 'ဧည့်ခံနှင့် မီးဖိုချောင်စရိတ်',
    subCategories: ['လက်ဖက်/ရေနွေး/မုန့်', 'ဧည့်သည်ဧည့်ခံစရိတ်', 'သောက်ရေသန့်/အဖျော်ယမကာ'],
    color: '#a855f7',
  },
  {
    id: 'cat_donation',
    name: 'အလှူဒါန်းနှင့် သာသနာရေး',
    subCategories: ['ဘုရားပန်း/ဆီမီး/ဆွမ်း', 'ကျောင်းတိုက်အလှူ', 'သံဃာဒါန/ယတြာအလှူ'],
    color: '#ec4899',
  },
  {
    id: 'cat_general',
    name: 'အထွေထွေ အသုံးစရိတ်',
    subCategories: ['ရုံးသုံး/စာရေးကိရိယာ', 'အထွေထွေ'],
    color: '#f43f5e',
  },
];

export interface SavedCustomService {
  id: string;
  name: string;
  defaultFee: number;
  lastUsedAt: string;
}

export interface SavedCustomYatra {
  id: string;
  name: string;
  defaultFee: number;
  lastUsedAt: string;
}

export function loadConsultations(): ConsultationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    if (!raw) {
      saveConsultations([]);
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading consultations from storage', e);
    return [];
  }
}

export function saveConsultations(records: ConsultationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving consultations to storage', e);
  }
}

export function loadExpenses(): ExpenseRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      saveExpenses([]);
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading expenses from storage', e);
    return [];
  }
}

export function saveExpenses(records: ExpenseRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving expenses to storage', e);
  }
}

export function loadExpenseCategories(): ExpenseCategoryConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
    if (!raw) {
      saveExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
      return DEFAULT_EXPENSE_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : DEFAULT_EXPENSE_CATEGORIES;
  } catch (e) {
    console.error('Error loading expense categories from storage', e);
    return DEFAULT_EXPENSE_CATEGORIES;
  }
}

export function saveExpenseCategories(categories: ExpenseCategoryConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving expense categories to storage', e);
  }
}

export function loadAmuletsCatalog(): AmuletCatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMULETS);
    if (!raw) {
      saveAmuletsCatalog([]);
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading amulets from storage', e);
    return [];
  }
}

export function saveAmuletsCatalog(items: AmuletCatalogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AMULETS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving amulets to storage', e);
  }
}

export function loadYatraCatalog(): YatraCatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.YATRA_CATALOG);
    if (!raw) {
      saveYatraCatalog([]);
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading yatra catalog from storage', e);
    return [];
  }
}

export function saveYatraCatalog(items: YatraCatalogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.YATRA_CATALOG, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving yatra catalog to storage', e);
  }
}

// Previously used Custom Services memory
export function loadSavedCustomServices(): SavedCustomService[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_SERVICES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function rememberCustomService(name: string, defaultFee: number): void {
  if (!name.trim()) return;
  try {
    const existing = loadSavedCustomServices();
    const cleanName = name.trim();
    const index = existing.findIndex(s => s.name.toLowerCase() === cleanName.toLowerCase());
    
    if (index >= 0) {
      existing[index].defaultFee = defaultFee || existing[index].defaultFee;
      existing[index].lastUsedAt = new Date().toISOString();
    } else {
      existing.unshift({
        id: `srv-${Date.now()}`,
        name: cleanName,
        defaultFee: defaultFee || 20000,
        lastUsedAt: new Date().toISOString()
      });
    }
    // Keep max 30 recent services
    const trimmed = existing.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SERVICES, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error remembering custom service', e);
  }
}

// Previously used Custom Yatras memory
export function loadSavedCustomYatras(): SavedCustomYatra[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_YATRAS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function rememberCustomYatra(name: string, defaultFee: number): void {
  if (!name.trim()) return;
  try {
    const existing = loadSavedCustomYatras();
    const cleanName = name.trim();
    const index = existing.findIndex(y => y.name.toLowerCase() === cleanName.toLowerCase());
    
    if (index >= 0) {
      existing[index].defaultFee = defaultFee || existing[index].defaultFee;
      existing[index].lastUsedAt = new Date().toISOString();
    } else {
      existing.unshift({
        id: `yat-${Date.now()}`,
        name: cleanName,
        defaultFee: defaultFee || 30000,
        lastUsedAt: new Date().toISOString()
      });
    }
    const trimmed = existing.slice(0, 30);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_YATRAS, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error remembering custom yatra', e);
  }
}

// Collision-Proof Customer ID Generator
// Combines Date Code + Device/Workstation Node Suffix + Sequence Counter
// Example: BD-260930-A01, BD-260930-B02
export function generateNextConsultationId(existingRecords: ConsultationRecord[] = []): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePrefix = `BD-${yy}${mm}${dd}`;

  // Generate a distinct node code from deviceId to avoid collisions across multiple concurrent users
  const devId = getDeviceId() || 'dev-00';
  const nodeChar = (devId.charCodeAt(devId.length - 1) % 26 + 10).toString(36).toUpperCase(); // e.g. 'A', 'B', 'K'

  // Find max sequence for today on this device or globally
  const todayRecords = existingRecords.filter(r => r.id && r.id.startsWith(datePrefix));
  let maxSeq = 0;

  for (const r of todayRecords) {
    const parts = r.id.split('-');
    if (parts.length >= 3) {
      const seqStr = parts[2].replace(/^[A-Z]/, '');
      const seqNum = parseInt(seqStr, 10);
      if (!isNaN(seqNum) && seqNum > maxSeq) {
        maxSeq = seqNum;
      }
    }
  }

  const nextSeq = String(maxSeq + 1).padStart(2, '0');
  let candidateId = `${datePrefix}-${nodeChar}${nextSeq}`;

  // Ensure absolute uniqueness against any existing record in list
  let collisionCounter = 1;
  while (existingRecords.some(r => r.id === candidateId)) {
    candidateId = `${datePrefix}-${nodeChar}${String(maxSeq + 1 + collisionCounter).padStart(2, '0')}`;
    collisionCounter++;
  }

  return candidateId;
}

// Customer Profile Search & History Dossier Lookup
export interface CustomerHistoryProfile {
  customerName: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  birthDayOfWeek: string;
  birthDate?: string;
  birthTime?: string;
  age?: number;
  mahabote?: string;
  firstVisitDate: string;
  lastVisitDate: string;
  totalVisits: number;
  totalSpent: number;
  allRecords: ConsultationRecord[];
}

export function searchCustomerHistoryProfiles(query: string, records: ConsultationRecord[]): CustomerHistoryProfile[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  // Group records by unique customer phone, customerId or name
  const map = new Map<string, ConsultationRecord[]>();

  for (const rec of records) {
    const cleanPhone = rec.phone ? rec.phone.replace(/[^0-9]/g, '') : '';
    const cleanCustId = rec.customerId ? rec.customerId.trim().toLowerCase() : '';
    
    let key = '';
    if (cleanPhone && cleanPhone.length >= 6) {
      key = `phone:${cleanPhone}`;
    } else if (cleanCustId) {
      key = `cust:${cleanCustId}`;
    } else {
      key = `name:${rec.customerName.trim().toLowerCase()}`;
    }

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(rec);
  }

  const results: CustomerHistoryProfile[] = [];

  map.forEach((customerRecords) => {
    // Sort chronological (newest first)
    customerRecords.sort((a, b) => new Date(b.readingDateTime || b.bookingDate).getTime() - new Date(a.readingDateTime || a.bookingDate).getTime());
    const latest = customerRecords[0];

    const matchesName = latest.customerName.toLowerCase().includes(q);
    const matchesPhone = latest.phone.includes(q);
    const matchesId = customerRecords.some(r => 
      r.id.toLowerCase().includes(q) || 
      (r.customerId && r.customerId.toLowerCase().includes(q))
    );

    if (matchesName || matchesPhone || matchesId) {
      const totalSpent = customerRecords.reduce((sum, r) => sum + (r.paidAmount || r.totalAmount || 0), 0);
      const oldest = customerRecords[customerRecords.length - 1];

      results.push({
        customerName: latest.customerName,
        phone: latest.phone,
        gender: latest.gender,
        birthDayOfWeek: latest.birthDayOfWeek,
        birthDate: latest.birthDate,
        birthTime: latest.birthTime,
        age: latest.age,
        mahabote: latest.mahabote,
        firstVisitDate: oldest.bookingDate || oldest.readingDateTime,
        lastVisitDate: latest.readingDateTime || latest.bookingDate,
        totalVisits: customerRecords.length,
        totalSpent,
        allRecords: customerRecords,
      });
    }
  });

  return results;
}

export function exportAllDataAsJSON(): void {
  const data = {
    appName: 'မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်း',
    version: '1.3.7',
    exportDate: new Date().toISOString(),
    consultations: loadConsultations(),
    expenses: loadExpenses(),
    amulets: loadAmuletsCatalog(),
    customServices: loadSavedCustomServices(),
    customYatras: loadSavedCustomYatras(),
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `astrology_records_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function clearAllData(): void {
  saveConsultations([]);
  saveExpenses([]);
}
