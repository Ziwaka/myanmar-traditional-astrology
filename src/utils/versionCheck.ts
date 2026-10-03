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

export const LOCAL_APP_VERSION = '1.8.18';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
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
  },
  {
    version: '1.8.17',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၃',
    title: 'Business Intelligence Data Insight Dashboard & System Guide',
    badge: 'Business Insights',
    changelog: [
      'လစဉ်အစီရင်ခံစာဟောင်းအား အဆင့်မြှင့်တင်ပြီး ပိုမိုပြည့်စုံစုံလင်သော \'Data Insight Dashboard\' သစ်အဖြစ် ပြောင်းလဲတည်ဆောက်ပေးခြင်း။',
      'လစဉ် ဝင်ငွေ၊ အသုံးစရိတ် နှင့် အသားတင်အမြတ်ငွေ တိုးတက်ပြောင်းလဲမှု လမ်းကြောင်းများကို လှပသော Interactive Trend Lines (Area Charts) များဖြင့် ဆွဲပြပေးခြင်း။',
      'မေးမြန်းသူတစ်ဦးချင်းစီ၏ ပျမ်းမျှဉာဏ်ပူဇော်ခ၊ အသုံးစရိတ်ကျန်းမာမှုအချိုးနှင့် အဆောင်ရောင်းအားအချိုးများအပေါ် မူတည်ပြီး စနစ်မှ အလိုအလျောက် စီးပွားရေးအကြံပြုချက်များပေးသည့် \'Smart Business Suggestion Analysis\' ထည့်သွင်းခြင်း။',
      'စနစ်တစ်ခုလုံး၏ Features များနှင့် အသေးစိတ်သုံးစွဲပုံတစ်ဆင့်ချင်းစီကို ရှင်းပြပေးထားသော \'စနစ်လမ်းညွှန် & Features (System Guide)\' Tab အသစ် ထည့်သွင်းပေးခြင်း။'
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
