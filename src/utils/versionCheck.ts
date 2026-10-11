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

export const LOCAL_APP_VERSION = '2.9';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '2.9',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'မူလလက်ရာ အမဲနှင့် ရွှေရောင်/အန်ဘာ Theme သို့ ပြန်လည်ပြောင်းလဲခြင်း (Restore Original Dark & Gold Theme)',
    badge: 'Design Revert',
    changelog: [
      'အသုံးပြုသူအလိုရှိသည့်အတိုင်း မူလလက်ရာ ပုံစံကောင်းမွန်ပြီး လှပထည်ဝါသည့် အမဲနှင့် ရွှေရောင်/အန်ဘာ (Dark & Gold) Theme သို့ အပြည့်အဝ ပြန်လည်ပြောင်းလဲပေးခြင်း',
      'ရိုးရာဗေဒင်နန်းတော်ပုံစံ ပိုမိုပေါ်လွင်စေရန် မူလ UI အလှတရားများကို မပျက်မယွင်းဘဲ မူလအတိုင်း ပြန်လည်ထိန်းသိမ်းပေးခြင်း'
    ]
  },
  {
    version: '2.8',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'သန့်ရှင်းလင်းသော အဖြူရောင်၊ အပြာနှင့် ဆင်စွယ်ရောင်/နံသာရောင် Theme သို့ ပြောင်းလဲခြင်း (Clean White, Blue & Ivory Sandalwood UI)',
    badge: 'Design Upgrade',
    changelog: [
      'နောက်ခံကို သန့်ရှင်းလင်းလက်သော အဖြူရောင်နှင့် ဆင်စွယ်ရောင် (Ivory) ဖြင့် ပြောင်းလဲပေးခြင်း',
      'အဓိက ခလုတ်များနှင့် နေရာများတွင် မျက်စိအေးစေပြီး ကြည့်ရရှင်းသော အပြာရောင် (Blue) နှင့် နံသာရောင် ဖျော့ဖျော့ (Soft Sandalwood) အဆင်အယင်များကို အသုံးပြုခြင်း',
      'စာသားများကို ပိုမိုထင်ရှားဖတ်ရလွယ်ကူစေရန် Contrast အား စနစ်တကျ ချိန်ညှိပေးခြင်း'
    ]
  },
  {
    version: '2.7',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'Sage & Sand အေးချမ်းသော Theme အသစ်သို့ ပြောင်းလဲခြင်း (Calming Sage & Sand UI)',
    badge: 'Design Update',
    changelog: [
      'မျက်စိကို အထူးအေးမြစေပြီး ကြည့်ရရှင်းသော Sage (အစိမ်းနုရောင်) နှင့် Sand (သဲရောင်) အခြေခံ Theme သို့ ပြောင်းလဲခြင်း',
      'အသုံးပြုသူများ အချိန်ကြာမြင့်စွာ အသုံးပြုသော်လည်း မျက်စိမပင်ပန်းစေရန် အဆင်ပြေချောမွေ့သည့် UI အရောင်စနစ်သစ်ကို အသုံးပြုခြင်း',
      'Interface တစ်ခုလုံးအား သဘာဝနှင့် နီးစပ်သော စိတ်ကြည်လင်လန်းဆန်းစေသည့် အရောင်အသွေးများဖြင့် မွမ်းမံခြင်း'
    ]
  },
  {
    version: '2.6',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'မျက်စိအေးပြီး ကြည့်ရရှင်းစေသော Soft Eye-Care Theme (Soft-Light UI)',
    badge: 'UI Refresh',
    changelog: [
      'မျက်စိကို အနှောင့်အယှက်မဖြစ်စေရန် အရောင်များကို ပိုမိုပျော့ပြောင်းသော Soft-Stone နှင့် Warm-Amber Palette များသို့ ပြောင်းလဲခြင်း',
      'စာသားများ ပိုမိုဖတ်ရလွယ်ကူစေရန် Contrast အား ပိုမိုညင်သာစွာ ချိန်ညှိပေးခြင်း',
      'အသုံးပြုသူ ကြာရှည်စွာကြည့်ရှုနိုင်ရန် Interface တစ်ခုလုံးကို ကြည့်ရရှင်းပြီး စိတ်ကြည်လင်စေသော Zen-Like UI ပုံစံသို့ မွမ်းမံခြင်း'
    ]
  },
  {
    version: '2.5',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'ဖုန်းနံပါတ်နှင့် ဆက်စပ်အချက်အလက်များ အပြီးသတ် ဖယ်ရှားရှင်းလင်းခြင်း (Total Phone Stripping & Privacy Clean)',
    badge: 'Privacy & Clean',
    changelog: [
      'ဖုန်းနံပါတ် (Phone Number) နှင့် ဆက်စပ်နေသော အချက်အလက်များ၊ အိုင်ကွန်များနှင့် စာသားများကို Booking Form၊ ရက်ချိန်းကတ်များ၊ Detail Modal၊ အသိပေးချက်များနှင့် ပြေစာများအပါအဝင် စနစ်တစ်ခုလုံးမှ လုံးဝဖယ်ရှားရှင်းလင်းခြင်း',
      'ဖောက်သည်ဟောင်း ရှာဖွေရာတွင် ဖုန်းနံပါတ်မပါဘဲ မေးသူအမည် နှင့် Customer ID တို့ဖြင့်သာ သန့်ရှင်းမြန်ဆန်စွာ ရှာဖွေနိုင်အောင် ပြင်ဆင်ခြင်း',
      'ယခင်မေးမြန်းမှုရာဇဝင် (History Dossier) တိုက်စစ်ခြင်းနှင့် VIP ဖောက်သည်စာရင်းများတွင် ဖုန်းနံပါတ်မလိုဘဲ အမည်နှင့် ID ဖြင့်သာ စနစ်တကျ အုပ်စုဖွဲ့ပြသခြင်း'
    ]
  },
  {
    version: '2.4',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'ငွေပေးချေသည့်နည်းလမ်းနှင့် ငွေရှင်းရက်စွဲ ဖြုတ်ပယ်ခြင်း (Instant Auto-Paid & Streamlined Payment)',
    badge: 'Instant Payment',
    changelog: [
      'ငွေပေးချေသည့် နည်းလမ်း (Payment Method - KPay, Wave, Cash) ရွေးချယ်မှုအား စနစ်၏ နေရာတိုင်းမှ အပြီးသတ်ဖြုတ်ပယ်ခြင်း',
      'Booking တင်သည်နှင့် တပြိုင်နက် ငွေရှင်းပြီးသား (Auto-Paid) အဖြစ် သတ်မှတ်ပြီး ငွေပေးချေသည့်ရက်စွဲ (Payment Date) အား ဖြုတ်ပယ်ခြင်း',
      'ပြေစာ၊ ဘောက်ချာနှင့် ဝင်ငွေမှတ်တမ်းများတွင် မလိုအပ်သော Payment Method စာသားများ ရှင်းလင်းပေးခြင်း'
    ]
  },
  {
    version: '2.3',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'Client Name ဖြင့်သာ ရက်ချိန်းထပ်တိုက်စစ်ခြင်းနှင့် စာသားများ ရှင်းလင်းခြင်း (Client Name Duplicate Detection)',
    badge: 'Duplicate Detection',
    changelog: [
      'ရက်ချိန်းထပ်နေမှု (Duplicate Booking) စစ်ဆေးခြင်းကို မေးသူအမည် (Client Name) ဖြင့်သာ တိကျစွာ သီးသန့်စစ်ဆေးစေခြင်း',
      'မလိုအပ်သော စာသားများနှင့် သတိပေးချက်စာတိုများကို ဖြုတ်ပယ်ပြီး ခပ်ရှင်းရှင်း သန့်သန့် ဖြစ်စေရန် မွမ်းမံခြင်း',
      'အချိန်ထပ်နေခြင်း (Double Booking) နှင့် အမည်တူ ရက်ချိန်းများအတွက် သီးသန့် Popup နှင့် အသံသတိပေးချက် ချိတ်ဆက်ခြင်း'
    ]
  },
  {
    version: '2.2',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၁၀',
    title: 'Side by Side 2-Tab (Scheduled & Done) နှင့် Custom ဗေဒင်ဟောခ (Custom Consultation Fee)',
    badge: 'Side by Side Tabs',
    changelog: [
      'ဟောရန်ကျန်ရှိသူများ နှင့် ဟောကြားပြီးစီးသူများကို Side by Side (2-Tab) ခွဲခြားပေးခြင်း (Scheduled နှင့် Done အဖြစ် ခေါင်းစဉ်တပ်ဆင်ခြင်း)',
      'Default အားဖြင့် Scheduled (ဟောရန်ကျန်သူများ) Tab အား အမြဲတမ်း Expand Mode ဖြင့် ဖွင့်လှစ်ပြသထားပြီး Done Tab အား လိုမှဖွင့်ကြည့်နိုင်ရန် စီစဉ်ခြင်း',
      'ဗေဒင်ဟောခတွင် ပုံသေ ၃၀,၀၀၀ နှင့် ၅၀,၀၀၀ အပြင် စိတ်ကြိုက်ထည့်သွင်းနိုင်သော Custom ဟောခ (ကျပ်) ကွက် အသစ် ထည့်သွင်းပေးခြင်း'
    ]
  },
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
    const res = await fetch(`/version.json?_t=${Date.now()}&_r=${Math.random()}`, {
      cache: 'reload',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
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
