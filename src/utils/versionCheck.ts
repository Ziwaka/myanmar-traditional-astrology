export interface VersionRelease {
  version: string;
  releaseDate: string;
  title: string;
  badge?: string;
  changelog: string[];
}

export interface CloudVersionInfo {
  version: string;
  releaseDate: string;
  title: string;
  isCloudAuthoritative: boolean;
  changelog: string[];
  history?: VersionRelease[];
}

export const LOCAL_APP_VERSION = '1.7.2';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.7.2',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Account-Specific Expense Deduction (Cash / KPay / Wave / Banking)',
    badge: 'Account Tracking',
    changelog: [
      'အသုံးစရိတ် ထည့်သွင်းရာတွင် ငွေထုတ်ယူသုံးစွဲသည့် အကောင့် (Cash / KPay / Wave / Banking) အလိုက် တိကျစွာ ရွေးချယ်နိုင်ပြီး၊ သက်ဆိုင်ရာ အကောင့် Balance ထဲမှ သီးသန့် အလိုအလျောက် နုတ်ယူတွက်ချက်ပေးခြင်း။'
    ]
  },
  {
    version: '1.7.1',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Zero Horizontal Scroll & Responsive Clean Wrap Grid Layout',
    changelog: [
      'အသုံးစရိတ် စီမံခန့်ခွဲမှု Tab Menu များအား ဘေးတိုက် Scroll မလိုစေဘဲ မျက်နှာပြင်ပေါ်တွင် အပြည့်မြင်ရသော Responsive Grid ဖြင့် ပြင်ဆင်ခြင်း။'
    ]
  },
  {
    version: '1.7.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Daily Cash Flow & Auto-Linked Consultation Income Balance Sheet',
    changelog: [
      'ဗေဒင်ဟောစာရင်းမှ ဝင်ငွေ အလိုအလျောက် ချိတ်ဆက်မှု၊ ထပ်တိုးဝင်ငွေ၊ အသုံးစရိတ်နှင့် တရက်တာ Balance ရှင်းတမ်း။'
    ]
  }
];

export function getStoredLocalVersion(): string {
  try {
    return localStorage.getItem(LOCAL_VERSION_KEY) || LOCAL_APP_VERSION;
  } catch {
    return LOCAL_APP_VERSION;
  }
}

export function saveStoredLocalVersion(version: string): void {
  try {
    localStorage.setItem(LOCAL_VERSION_KEY, version);
  } catch (e) {
    console.error('Error saving local version', e);
  }
}

export function getLastSeenChangelogVersion(): string {
  try {
    return localStorage.getItem(LAST_SEEN_CHANGELOG_KEY) || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export function setLastSeenChangelogVersion(version: string): void {
  try {
    localStorage.setItem(LAST_SEEN_CHANGELOG_KEY, version);
  } catch (e) {
    console.error('Error saving last seen changelog', e);
  }
}

export function compareVersions(cloudVer: string, localVer: string): number {
  const cParts = cloudVer.split('.').map(n => parseInt(n, 10) || 0);
  const lParts = localVer.split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(cParts.length, lParts.length);

  for (let i = 0; i < maxLen; i++) {
    const c = cParts[i] || 0;
    const l = lParts[i] || 0;
    if (c > l) return 1;
    if (c < l) return -1;
  }
  return 0;
}

export async function fetchCloudVersion(): Promise<CloudVersionInfo | null> {
  try {
    const res = await fetch(`/version.json?_t=${Date.now()}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });
    if (!res.ok) {
      return {
        version: ALL_VERSION_HISTORY[0].version,
        releaseDate: ALL_VERSION_HISTORY[0].releaseDate,
        title: ALL_VERSION_HISTORY[0].title,
        isCloudAuthoritative: true,
        changelog: ALL_VERSION_HISTORY[0].changelog,
        history: ALL_VERSION_HISTORY,
      };
    }
    const data: CloudVersionInfo = await res.json();
    return data;
  } catch (e) {
    console.warn('Could not fetch cloud version (possibly offline)', e);
    return {
      version: ALL_VERSION_HISTORY[0].version,
      releaseDate: ALL_VERSION_HISTORY[0].releaseDate,
      title: ALL_VERSION_HISTORY[0].title,
      isCloudAuthoritative: true,
      changelog: ALL_VERSION_HISTORY[0].changelog,
      history: ALL_VERSION_HISTORY,
    };
  }
}
