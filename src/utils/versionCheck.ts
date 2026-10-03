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

export const LOCAL_APP_VERSION = '1.8.19';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.8.19',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Catalog Edit Actions for Yatras & Amulets',
    badge: 'Catalog Edit',
    changelog: [
      'ယတြာ ကတ်တလောက်နှင့် အဆောင် ကတ်တလောက်များတွင် သတ်မှတ်ထားသော ပစ္စည်းများအား ပြန်လည်ပြင်ဆင်နိုင်သည့် \'Edit (ပြင်ဆင်ရန်)\' စနစ် အပြည့်အဝ ထည့်သွင်းခြင်း။',
      'ကတ်တလောက်ကတ်ပြားများတွင် \'Edit Icon\' အသစ်ထည့်သွင်းပေးပြီး၊ ၎င်းအား နှိပ်ပါက ယခင်အချက်အလက်ဟောင်းများကို မူလအတိုင်း ဖြည့်သွင်းပေးထားပြီး ပြင်ဆင်ချက်များကို Cloud နှင့် Local Storage နှစ်ဖက်လုံးတွင် စနစ်တကျ Auto-Sync သိမ်းဆည်းပေးခြင်း။'
    ]
  },
  {
    version: '1.8.18',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Print Receipt & Customer Card UI Refinements',
    badge: 'UI Refinements',
    changelog: [
      'ဘောက်ချာ (Print Receipt) ထိပ်ရှိ မလိုလားအပ်သော စာသားအပိုများအား ဖျက်ထုတ်ပေးခြင်း။',
      'ဘောက်ချာရှိ မေးသူအချက်အလက် (Client Profile) များအား ဖုန်းမျက်နှာပြင်ငယ်များတွင် ဘေးဘက်သို့လိပ်မထွက်စေဘဲ ၁ ခုလျှင် ၁ ကြောင်းစီ သန့်ရှင်းသပ်ရပ်စွာ ပြသပေးခြင်း။',
      'ပင်မစာရင်း ကတ်ပြားများတွင် ဖုန်းနံပါတ် မဖြည့်ထားပါက မလိုလားအပ်သော \'09- (မဖြည့်ရသေး)\' စာသားအား လုံးဝဖျက်သိမ်းကာ ဖုံးကွယ်ပေးခြင်း။'
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
