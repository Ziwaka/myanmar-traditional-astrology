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

export const LOCAL_APP_VERSION = '1.8.25';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.8.25',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Complete Hide of Completed Appointments in Notification Center',
    badge: 'Noti Fix v2',
    changelog: [
      'ယနေ့ရက်ချိန်းများစာရင်းမှ ဟောပြီးစီးသူများကို လုံးဝစစ်ထုတ်ဖယ်ရှားပေးခြင်း',
      'ပြီးစီးသွားသောရက်ချိန်းများ အသိပေးချက်စင်တာမှ တိုက်ရိုက်ပျောက်ကွယ်သွားစေခြင်း'
    ]
  },
  {
    version: '1.8.24',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Auto-Clear Completed Task Notifications',
    badge: 'Noti Fix',
    changelog: [
      'ဟောကြားပြီးစီးကြောင်း သတ်မှတ်လိုက်သည်နှင့် အဆိုပါမေးသူ၏ Notification များ အလိုအလျောက် ဖျက်သိမ်းခြင်း',
      'Notification Badge အမှတ်အသားများ ချက်ချင်း ပျောက်ကွယ်သွားစေရန် ချက်ဆက်ခြင်း'
    ]
  },
  {
    version: '1.8.23',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Grouped & Collapsible Customer Lists (ဟောရန်ကျန် vs ဟောပြီး)',
    badge: 'List UI',
    changelog: [
      'ဟောရန်ကျန် နှင့် ဟောပြီး ကို အုပ်စုခွဲခြားပြသခြင်း',
      'ဟောရန်ကျန်အား ဦးစားပေးအဖြစ် အပေါ်ဆုံးတွင် ထားရှိခြင်း',
      'ချုံ့/ချဲ့ (Collapse/Expand) ပြုလုပ်နိုင်သော Toggle ခလုတ် ထည့်သွင်းခြင်း'
    ]
  },
  {
    version: '1.8.22',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Receipt Layout Refinements & Clean Single-Line Format',
    badge: 'Receipt UI',
    changelog: [
      'ပြေစာတွင် PNG အား ဖြုတ်ပြီး JPEG သာ သုံးရန် ထားရှိခြင်း',
      'Client Profile နှင့် Financial Breakdown အင်္ဂလိပ်စာသားများ ဖြုတ်ပယ်ခြင်း',
      'ID အား ၁ ကြောင်း သီးသန့်ထားပြီး ကျသင့်ငွေ (ကျပ်) ခေါင်းစဉ်သို့ ပြောင်းလဲခြင်း',
      'မလိုအပ်သော 0 ပိုနေခြင်းများနှင့် ပညာရှင်လက်မှတ်နေရာ ဖြုတ်ပယ်ခြင်း'
    ]
  },
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
