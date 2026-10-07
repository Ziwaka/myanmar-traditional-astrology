// Real-time Sync Logging Utility

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  action: 'auto_sync' | 'auto_listener_sync' | 'manual_push' | 'manual_pull' | 'single_doc_write' | 'single_doc_delete' | 'connection_check';
  collection: 'consultations' | 'expenses' | 'amulets' | 'all' | 'system';
  itemCount: number;
  status: 'success' | 'warning' | 'error';
  details: string;
}

const SYNC_LOGS_KEY = 'myanmar_astrology_sync_activity_logs_v1';
const MAX_LOGS = 50;

export function getSyncLogs(): SyncLogEntry[] {
  try {
    const raw = localStorage.getItem(SYNC_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SyncLogEntry[];
  } catch {
    return [];
  }
}

export function addSyncLog(entry: Omit<SyncLogEntry, 'id' | 'timestamp'>): SyncLogEntry {
  const logs = getSyncLogs();
  const newEntry: SyncLogEntry = {
    ...entry,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [newEntry, ...logs].slice(0, MAX_LOGS);
  try {
    localStorage.setItem(SYNC_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save sync log', e);
  }

  return newEntry;
}

export function clearSyncLogs(): void {
  try {
    localStorage.removeItem(SYNC_LOGS_KEY);
  } catch (e) {
    console.error(e);
  }
}
