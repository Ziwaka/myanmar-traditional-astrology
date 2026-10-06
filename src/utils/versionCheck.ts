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

export const LOCAL_APP_VERSION = '1.8.21';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.8.21',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Tailwind v4 OKLCH Fix with Native Image Exporter Engine',
    badge: 'OKLCH Fix',
    changelog: [
      'Tailwind CSS v4 ၏ \'oklch()\' ရောင်စုံစနစ်အား html2canvas မှ မဖတ်နိုင်ဘဲ \'Attempting to parse an unsupported color function oklch\' ဟု တက်လာသော error အား Browser Native Renderer (html-to-image) Engine သို့ ပြောင်းလဲအသုံးပြု၍ ၁၀၀% အပြည့်အဝ ဖြေရှင်းပေးလိုက်ခြင်း။',
      'PNG/JPEG ပုံရိပ်ထုတ်ယူရာတွင် စာလုံး/အရောင်များ ပျက်ယွင်းမှုမရှိဘဲ လွန်စွာ ကြည်လင်ပြတ်သားစွာ ဒေါင်းလုဒ်ရယူနိုင်ခြင်း။'
    ]
  },
  {
    version: '1.8.20',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Optimized Image Exports & Removed PDF',
    badge: 'Exports Fix',
    changelog: [
      'ပြေစာအား PNG/JPEG ပြုလုပ်ရာတွင် memory limit ကျော်၍ error တက်ခြင်းအား စနစ်တကျ ပြုပြင်ပေးခြင်း',
      'PDF သိမ်းဆည်းရန် ခလုတ်အား လုံးဝဖြုတ်ပယ်ပေးခြင်း'
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
