export interface QuotaBreakdown {
  label: string;
  bytes: number;
  count: number;
  formattedSize: string;
  percentage: number;
  color: string;
}

export interface DatabaseQuotaReport {
  totalUsedBytes: number;
  totalQuotaBytes: number;
  remainingBytes: number;
  usedPercentage: number;
  status: 'healthy' | 'warning' | 'critical';
  statusLabel: string;
  formattedUsed: string;
  formattedQuota: string;
  formattedRemaining: string;
  recordCount: {
    consultations: number;
    expenses: number;
    amulets: number;
  };
  breakdown: QuotaBreakdown[];
  browserEstimated?: {
    usage?: number;
    quota?: number;
  };
}

export const APP_MAX_QUOTA_BYTES = 5 * 1024 * 1024; // 5 MB Local App Quota (Standard robust allocation)

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function calculateStorageSizeForKeys(keys: string[]): number {
  let total = 0;
  for (const k of keys) {
    const val = localStorage.getItem(k);
    if (val) {
      // 2 bytes per UTF-16 character in memory/local storage
      total += (k.length + val.length) * 2;
    }
  }
  return total;
}

export async function getDatabaseQuotaReport(): Promise<DatabaseQuotaReport> {
  const CONSULTATIONS_KEY = 'myanmar_astrology_consultations_v2_clean';
  const EXPENSES_KEY = 'myanmar_astrology_expenses_v2_clean';
  const AMULETS_KEY = 'myanmar_astrology_amulets_v2';
  const AUTH_KEY = 'myanmar_astrology_super_admin_session_v3';

  // Measure sizes in localStorage
  const consultationsRaw = localStorage.getItem(CONSULTATIONS_KEY) || '[]';
  const expensesRaw = localStorage.getItem(EXPENSES_KEY) || '[]';
  const amuletsRaw = localStorage.getItem(AMULETS_KEY) || '[]';
  const authRaw = localStorage.getItem(AUTH_KEY) || '';

  const consultationsBytes = (CONSULTATIONS_KEY.length + consultationsRaw.length) * 2;
  const expensesBytes = (EXPENSES_KEY.length + expensesRaw.length) * 2;
  const amuletsBytes = (AMULETS_KEY.length + amuletsRaw.length) * 2;
  const authBytes = (AUTH_KEY.length + authRaw.length) * 2;

  let totalAllStorage = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const v = localStorage.getItem(k) || '';
        totalAllStorage += (k.length + v.length) * 2;
      }
    }
  } catch (e) {
    console.warn('Could not iterate localStorage for quota', e);
  }

  const otherBytes = Math.max(0, totalAllStorage - (consultationsBytes + expensesBytes + amuletsBytes + authBytes));
  const totalUsedBytes = totalAllStorage > 0 ? totalAllStorage : (consultationsBytes + expensesBytes + amuletsBytes + authBytes);

  let consultationsCount = 0;
  try {
    consultationsCount = JSON.parse(consultationsRaw).length || 0;
  } catch {}

  let expensesCount = 0;
  try {
    expensesCount = JSON.parse(expensesRaw).length || 0;
  } catch {}

  let amuletsCount = 0;
  try {
    amuletsCount = JSON.parse(amuletsRaw).length || 0;
  } catch {}

  // Attempt browser storage estimation if available
  let browserEstimated: { usage?: number; quota?: number } | undefined;
  let effectiveQuota = APP_MAX_QUOTA_BYTES;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      browserEstimated = {
        usage: estimate.usage,
        quota: estimate.quota,
      };
      // Keep app allocation target as 5 MB (or browser quota if smaller)
      if (estimate.quota && estimate.quota < effectiveQuota) {
        effectiveQuota = estimate.quota;
      }
    } catch {}
  }

  const usedPercentage = Math.min(100, Math.max(0, (totalUsedBytes / effectiveQuota) * 100));
  const remainingBytes = Math.max(0, effectiveQuota - totalUsedBytes);

  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  let statusLabel = 'ပုံမှန် (လုံလောက်ပါသည်)';

  if (usedPercentage >= 90) {
    status = 'critical';
    statusLabel = 'သတိပေးချက်: Quota ပြည့်လုနီးပါးဖြစ်နေပါသည်';
  } else if (usedPercentage >= 70) {
    status = 'warning';
    statusLabel = 'သတိပြုရန်: Quota ၇၀% ကျော် အသုံးပြုထားပါသည်';
  }

  const breakdown: QuotaBreakdown[] = [
    {
      label: 'ဗေဒင်မှတ်တမ်းများ (Consultations)',
      bytes: consultationsBytes,
      count: consultationsCount,
      formattedSize: formatBytes(consultationsBytes),
      percentage: totalUsedBytes > 0 ? (consultationsBytes / totalUsedBytes) * 100 : 0,
      color: '#f59e0b', // amber
    },
    {
      label: 'အသုံးစရိတ် စာရင်းများ (Expenses)',
      bytes: expensesBytes,
      count: expensesCount,
      formattedSize: formatBytes(expensesBytes),
      percentage: totalUsedBytes > 0 ? (expensesBytes / totalUsedBytes) * 100 : 0,
      color: '#f43f5e', // rose
    },
    {
      label: 'အဆောင်ပစ္စည်းများ (Amulets Catalog)',
      bytes: amuletsBytes,
      count: amuletsCount,
      formattedSize: formatBytes(amuletsBytes),
      percentage: totalUsedBytes > 0 ? (amuletsBytes / totalUsedBytes) * 100 : 0,
      color: '#a855f7', // purple
    },
    {
      label: 'စနစ်နှင့် အကောင့် အချက်အလက် (System & Auth)',
      bytes: authBytes + otherBytes,
      count: 1,
      formattedSize: formatBytes(authBytes + otherBytes),
      percentage: totalUsedBytes > 0 ? ((authBytes + otherBytes) / totalUsedBytes) * 100 : 0,
      color: '#10b981', // emerald
    },
  ];

  return {
    totalUsedBytes,
    totalQuotaBytes: effectiveQuota,
    remainingBytes,
    usedPercentage: Number(usedPercentage.toFixed(1)),
    status,
    statusLabel,
    formattedUsed: formatBytes(totalUsedBytes),
    formattedQuota: formatBytes(effectiveQuota),
    formattedRemaining: formatBytes(remainingBytes),
    recordCount: {
      consultations: consultationsCount,
      expenses: expensesCount,
      amulets: amuletsCount,
    },
    breakdown,
    browserEstimated,
  };
}

// Compress / Optimize storage by removing redundant whitespace from JSON keys
export function optimizeStorage(): { freedBytes: number } {
  let before = 0;
  let after = 0;

  const keys = [
    'myanmar_astrology_consultations_v2_clean',
    'myanmar_astrology_expenses_v2_clean',
    'myanmar_astrology_amulets_v2',
  ];

  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (raw) {
      before += raw.length * 2;
      try {
        const parsed = JSON.parse(raw);
        const minified = JSON.stringify(parsed);
        localStorage.setItem(k, minified);
        after += minified.length * 2;
      } catch {}
    }
  }

  return { freedBytes: Math.max(0, before - after) };
}
