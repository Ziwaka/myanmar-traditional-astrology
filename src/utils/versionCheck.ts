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

export const LOCAL_APP_VERSION = '1.5.0';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.5.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Two-Way Birth Date Syncing & Myanmar Astronomical Calendar Engine',
    badge: 'Latest Release',
    changelog: [
      'မွေးနေ့အချက်အလက် ထည့်သွင်းမှုကို အပေါ်ဆုံးသို့ ရွှေ့ဆိုင်းပြီး Mode ၃ မျိုး (အင်္ဂလိပ်မွေးနေ့ / မြန်မာမွေးနေ့ / မွေးနံသီးသန့်) အဖြစ် ပြင်ဆင်ခြင်း။',
      'အင်္ဂလိပ် မွေးရက်စွဲ (Gregorian Date) ထည့်လိုက်သည်နှင့် မွေးနံ (Day of Week)၊ မဟာဘုတ်ခွင်နှင့် မြန်မာမွေးရက်စွဲ (၁၃၈၈ ခု၊ သီတင်းကျွတ် လဆန်း ၅ ရက်) အား အလိုအလျောက် တွက်ချက်ပေးခြင်း။',
      'မြန်မာ သက္ကရာဇ်၊ လ၊ လဆန်း/လဆုတ်၊ ရက်များ ရွေးချယ်ပါကလည်း အင်္ဂလိပ် မွေးရက်စွဲ၊ မွေးနံနှင့် မဟာဘုတ်အား နှစ်ဖက်အပြန်အလှန် (Two-way Sync) အလိုအလျောက် တွက်ထုတ်ပေးခြင်း။',
      'မွေးနေ့ မထည့်ဘဲ မွေးနံ သီးသန့် ရွေးချယ်လိုသူများအတွက်လည်း လွတ်လပ်စွာ ရွေးချယ်နိုင်စေခြင်း။'
    ]
  },
  {
    version: '1.4.9',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Single-line Per Item Form Layout, Zero-Zoom Mobile Focus, Calendar Picker (DD/MM/YYYY) & AM/PM Time Selector',
    changelog: [
      '၁ ကြောင်းလျှင် Item ၁ ခုနှုန်းဖြင့် စာရိုက်ရမည့် Input ကွက်များအားလုံးကို သန့်ရှင်းသပ်ရပ်စွာ Single-line Layout သို့ ပြင်ဆင်ပြောင်းလဲခြင်း။',
      'ဖုန်းမျက်နှာပြင်တွင် Input ကွက်များအား နှိပ်လိုက်သည့်အခါ မျက်နှာပြင် ကြီးထွက်မသွားစေရန်နှင့် Horizontal Scroll မဖြစ်စေရန် 16px Font Size & Viewport Config။',
      'မွေးသက္ကရာဇ်နှင့် ရက်စွဲများ ရွေးချယ်ရာတွင် အမြဲတမ်း ပြက္ခဒိန် (Calendar Picker) ပေါ်စေပြီး ရက်စွဲပြသမှုကို DD / MM / YYYY ပုံစံဖြင့်သာ ပြသပေးခြင်း။',
      'အချိန် (Time) ရွေးချယ်မှုများတွင် AM / PM ရှင်းလင်းစွာ ရွေးချယ်နိုင်သော စနစ်။'
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
