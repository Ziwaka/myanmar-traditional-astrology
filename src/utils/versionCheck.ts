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

export const LOCAL_APP_VERSION = '1.8.13';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.8.13',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Streamline Service to ဗေဒင်ဟောစာတမ်း',
    badge: 'Service Streamlined',
    changelog: [
      'ဇာတာဖွဲ့/အထူးဟောစာတမ်း ကို ဖြုတ်ပယ်ပြီး ပုံသေ ဗေဒင်ဟောစာတမ်း အမည်ဖြင့်သာ သန့်ရှင်းစွာ ထားရှိပေးခြင်း။',
      'ဉာဏ်ပူဇော်ခ အား ၃၀,၀၀၀ ကျပ် နှင့် ၅၀,၀၀၀ ကျပ် Tick Boxes ဖြင့် လျင်မြန်စွာ ရွေးချယ်နိုင်အောင် ထားရှိပေးခြင်း။'
    ]
  },
  {
    version: '1.8.12',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Service Fee to ဉာဏ်ပူဇော်ခ & Quick Tick Boxes',
    badge: 'UI & Service Update',
    changelog: [
      'ဗေဒင်မေးသူ စာရင်းသွင်းပုံစံမှ ဖုန်းနံပါတ် Field အား လုံးဝ ဖြုတ်ပယ်ပေးခြင်း။',
      'အမည်အား "ဉာဏ်ပူဇော်ခ" သို့ ပြောင်းလဲပြီး ၃၀,၀၀၀ ကျပ် နှင့် ၅၀,၀၀၀ ကျပ် Tick Box များ ထည့်သွင်းပေးထားခြင်း။'
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
