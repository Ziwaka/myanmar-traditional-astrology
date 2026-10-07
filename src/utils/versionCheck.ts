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

export const LOCAL_APP_VERSION = '2.0';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '2.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Seamless Silent Auto-Sync & Permanent Banner Removal',
    badge: 'Auto Sync',
    changelog: [
      'မျက်စိနောက်စေသော Sync သတိပေးချက် Banner ကြီးအား လုံးဝဖယ်ရှားပေးခြင်း',
      'နောက်ကွယ်မှ အလိုအလျောက် (Background) စက္ကန့်မလပ် အပြန်အလှန် ချိတ်ဆက်ပေးသော Silent Auto-Sync Engine စနစ် အပြည့်အဝ ထည့်သွင်းပေးခြင်း',
      'စက်ပစ္စည်းအားလုံး ဒေတာမပျောက်ပျက်ဘဲ အချိန်နှင့်တစ်ပြေးညီ Real-time Auto-Sync ဖြစ်စေခြင်း'
    ]
  },
  {
    version: '1.9',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Exact Cash Flow Real-Time Accounting Engine',
    badge: 'Financial Fix',
    changelog: [
      'ယနေ့ဝင်ငွေအား ဟောမည့်ရက်စွဲအစား အမှန်တကယ် ငွေပေးချေမှုပြီးမြောက်သည့်နေ့ (Payment Date) ဖြင့် စနစ်တကျ တွက်ချက်ခြင်း',
      'နေ့စဉ်ဝင်ငွေအချက်အလက်များကို အခြေပြမြေပြင် တကယ့်ငွေရှင်း Cash Flow စာရင်းအတိုင်း တိုက်ရိုက်ချိတ်ဆက်ခြင်း'
    ]
  },
  {
    version: '1.8',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Date Parsing Engine Fix & Collapsible Grouping',
    badge: 'Parsing & Grouping',
    changelog: [
      'ရက်စွဲအုပ်စုခွဲရာတွင် အချိန်အပိုင်းအခြားများ ရောထွေးပါဝင်နေမှုအား regex (space & T split) စနစ်ဖြင့် အပြည့်အဝခွဲခြားခြင်း',
      'ရက်စွဲခေါင်းစဉ်များ၌ ရက်စွဲသက်သက်သာ ပေါ်လာစေပြီး ရက်နှင့်အချိန်များ ရောထွေးနေခြင်းကို ဖြေရှင်းခြင်း',
      'ဟောရန်ကျန်/ဟောပြီးအုပ်စုများအောက်တွင် ရက်စွဲအလိုက်၊ ရက်စွဲတစ်ခုစီအောက်တွင် အချိန်အလိုက် ၃ ဆင့် အုပ်စုခွဲခြားပြသခြင်း'
    ]
  },
  {
    version: '1.7',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Auto-Clear Completed Task Notifications & Today Scope',
    badge: 'Notifications',
    changelog: [
      'ယနေ့ရက်ချိန်းများစာရင်းမှ ဟောပြီးစီးသူများကို လုံးဝစစ်ထုတ်ဖယ်ရှားပြီး Notification စင်တာမှ ပျောက်သွားစေခြင်း',
      'ဟောကြားပြီးစီးကြောင်း သတ်မှတ်လိုက်သည်နှင့် အဆိုပါမေးသူ၏ Notification များ အလိုအလျောက် ဖျက်သိမ်းခြင်း'
    ]
  },
  {
    version: '1.6',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Grouped & Collapsible Customer Lists (ဟောရန်ကျန် vs ဟောပြီး)',
    badge: 'List UI',
    changelog: [
      'ဟောရန်ကျန် နှင့် ဟောပြီး ကို အုပ်စုခွဲခြားပြသပြီး ချုံ့/ချဲ့ (Collapse/Expand) တိုဂယ်ခလုတ် ထည့်သွင်းခြင်း',
      'ဟောရန်ကျန်အား ဦးစားပေးအဖြစ် အပေါ်ဆုံးတွင် ထားရှိခြင်း'
    ]
  },
  {
    version: '1.5',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Receipt Layout Refinements & Clean Single-Line Format',
    badge: 'Receipt UI',
    changelog: [
      'ပြေစာတွင် PNG အား ဖြုတ်ပြီး JPEG သာ သုံးရန် ထားရှိခြင်း',
      'Client Profile နှင့် Financial Breakdown အင်္ဂလိပ်စာသားများ၊ ပညာရှင်လက်မှတ်နေရာ ဖြုတ်ပယ်ခြင်း',
      'ID အား ၁ ကြောင်း သီးသန့်ထားပြီး ကျသင့်ငွေ (ကျပ်) ခေါင်းစဉ်သို့ ပြောင်းလဲခြင်း'
    ]
  },
  {
    version: '1.4',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၆',
    title: 'Tailwind v4 OKLCH Fix with Native Image Exporter Engine',
    badge: 'OKLCH Fix',
    changelog: [
      'Tailwind CSS v4 ၏ oklch() အား Native Renderer (html-to-image) Engine သို့ ပြောင်းလဲအသုံးပြု၍ ဖြေရှင်းခြင်း',
      'PNG/JPEG ပုံရိပ်ထုတ်ယူရာတွင် စာလုံး/အရောင်များ ပျက်ယွင်းမှုမရှိဘဲ လွန်စွာ ကြည်လင်ပြတ်သားစွာ ဒေါင်းလုဒ်ရယူနိုင်ခြင်း'
    ]
  },
  {
    version: '1.3',
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
