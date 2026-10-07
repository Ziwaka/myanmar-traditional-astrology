// 48-Hour Cloud Sync Monitoring & Reminder Utility

const LAST_SYNC_KEY = 'myanmar_astrology_last_cloud_sync_time';
const DISMISSED_UNTIL_KEY = 'myanmar_astrology_sync_reminder_dismissed_until';
export const OVERDUE_THRESHOLD_HOURS = 48;

export function getLastCloudSyncTime(): number | null {
  try {
    const raw = localStorage.getItem(LAST_SYNC_KEY);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

export function recordCloudSyncTime(timestamp: number = Date.now()): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, timestamp.toString());
    // Clear any temporary dismissal when user syncs
    localStorage.removeItem(DISMISSED_UNTIL_KEY);
  } catch (e) {
    console.error('Error saving last cloud sync time', e);
  }
}

export function getCloudSyncElapsedHours(): number {
  const lastTime = getLastCloudSyncTime();
  if (!lastTime) return 999999; // Never synced
  const diffMs = Date.now() - lastTime;
  return Math.max(0, diffMs / (1000 * 60 * 60));
}

export function isCloudSyncOverdue(): boolean {
  const elapsed = getCloudSyncElapsedHours();
  return elapsed >= OVERDUE_THRESHOLD_HOURS;
}

export function dismissCloudSyncReminder(hours: number = 6): void {
  try {
    const until = Date.now() + (hours * 60 * 60 * 1000);
    localStorage.setItem(DISMISSED_UNTIL_KEY, until.toString());
  } catch (e) {
    console.error('Error setting sync reminder dismissal', e);
  }
}

export function isCloudSyncReminderDismissed(): boolean {
  try {
    const raw = localStorage.getItem(DISMISSED_UNTIL_KEY);
    if (!raw) return false;
    const until = parseInt(raw, 10);
    return !isNaN(until) && Date.now() < until;
  } catch {
    return false;
  }
}

export function shouldShowSyncReminderBanner(hasRecords: boolean): boolean {
  // Permanently disabled in favor of silent automated background sync
  return false;
}

export function formatLastSyncRelative(timestamp: number | null): string {
  if (!timestamp) return 'Cloud သို့ Manual Sync မလုပ်ရသေးပါ';
  const diffMs = Date.now() - timestamp;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) {
    const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `လွန်ခဲ့သော ${mins} မိနစ်က`;
  }
  if (hours < 24) {
    return `လွန်ခဲ့သော ${hours} နာရီက`;
  }
  if (days === 1) {
    return `လွန်ခဲ့သော ၁ ရက်က (${hours} နာရီ)`;
  }
  return `လွန်ခဲ့သော ${days} ရက်က (${hours} နာရီကျော်)`;
}
