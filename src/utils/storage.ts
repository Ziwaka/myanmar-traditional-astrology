import { AmuletCatalogItem, ConsultationRecord, ExpenseRecord } from '../types';
import { DEFAULT_AMULETS_CATALOG, INITIAL_CONSULTATION_RECORDS, INITIAL_EXPENSES } from './mockData';

const STORAGE_KEYS = {
  CONSULTATIONS: 'myanmar_astrology_consultations_v2_clean',
  EXPENSES: 'myanmar_astrology_expenses_v2_clean',
  AMULETS: 'myanmar_astrology_amulets_v2',
  AUTH: 'myanmar_astrology_auth_v2',
};

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

export function loadAmuletsCatalog(): AmuletCatalogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AMULETS);
    if (!raw) {
      saveAmuletsCatalog(DEFAULT_AMULETS_CATALOG);
      return DEFAULT_AMULETS_CATALOG;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading amulets from storage', e);
    return DEFAULT_AMULETS_CATALOG;
  }
}

export function saveAmuletsCatalog(items: AmuletCatalogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AMULETS, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving amulets to storage', e);
  }
}

// Generate next Consultation ID like BD-2026-001
export function generateNextConsultationId(existingRecords: ConsultationRecord[]): string {
  const currentYear = new Date().getFullYear();
  const prefix = `BD-${currentYear}-`;
  let maxSeq = 0;
  for (const r of existingRecords) {
    if (r.id.startsWith(prefix)) {
      const numPart = parseInt(r.id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${prefix}${nextSeq}`;
}

export function exportAllDataAsJSON(): void {
  const data = {
    appName: 'မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်း',
    version: '1.2.0',
    exportDate: new Date().toISOString(),
    consultations: loadConsultations(),
    expenses: loadExpenses(),
    amulets: loadAmuletsCatalog(),
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
