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

export const LOCAL_APP_VERSION = '1.8.15';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.8.15',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Quantity Multipliers & Auto-Calculators in Entry Form',
    badge: 'Quantity Multipliers',
    changelog: [
      'ယတြာများအတွက် အကြိမ်အရေအတွက် (၁ ကြိမ် ၊ ၂ ကြိမ် ၊ ၃ ကြိမ် စသည်) ကို လျင်မြန်စွာ ရွေးချယ်နိုင်သော စနစ် ထည့်သွင်းပေးခြင်း။',
      'အဆောင်ပစ္စည်းများအတွက် ဝယ်ယူပြီးစာရင်းတွင် တိုက်ရိုက် အရေအတွက် အတိုး/အလျော့ ပြုလုပ်နိုင်သော (+ / -) ခလုတ်များ တည်ဆောက်ခြင်း။',
      'ရွေးချယ်လိုက်သည့် အရေအတွက်အပေါ် မူတည်၍ ကျသင့်ငွေများကို စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် တိကျစွာ တွက်ချက်ပေးခြင်း။'
    ]
  },
  {
    version: '1.8.14',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Separate Yatra & Amulet Catalogs & Cloud Sync Integration',
    badge: 'Database & UI Split',
    changelog: [
      'ယတြာ ကတ်တလောက် (Yatra Catalog) နှင့် အဆောင် ကတ်တလောက် (Amulet Catalog) အား တက်ဘ်များနှင့် ဘေးဘားမီနူးတွင် သီးခြားစီ ခွဲထုတ်ပြီးစနစ်တကျ ပြင်ဆင်ခြင်း။',
      'Firebase Firestore တွင် \'yatras\' collection အသစ်တည်ဆောက်၍ Real-time Sync စနစ် အပြည့်အဝ ချိတ်ဆက်ခြင်း။',
      'ယခင်အမှားအယွင်းကြောင့် အဆောင်စုဆောင်းမှုထဲ ရောက်ရှိနေသည့် ယတြာမှတ်တမ်းများအား Cloud နှင့် local storage နှစ်ဖက်စလုံးတွင် အလိုအလျောက် ရွေးထုတ်ပြောင်းရွှေ့ပေးသည့် (Automatic Migration) စနစ်ထည့်သွင်းခြင်း။',
      'ဗေဒင်မေးသူစာရင်းသွင်းပုံစံ (Entry Form) တွင် ယတြာကတ်တလောက်မှ ရွေးချယ်မှုများကို အလွယ်တကူ ကလစ်တစ်ချက်နှိပ်ရုံဖြင့် အလိုအလျောက် ဖြည့်သွင်းနိုင်စေခြင်း။'
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
