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

export const LOCAL_APP_VERSION = '1.3.9';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

// All historical versions curated in code for immediate offline/online display
export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.3.9',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Skipable Name, Social Media Account Fields, Shorthand Day Names & DD / MM / YYYY Date Formatting',
    badge: 'Latest Release',
    changelog: [
      'အမည် မထည့်ဘဲ ကျော်နိုင်ခြင်း (Skipable Name Field): ဗေဒင်မေးသူအမည်ကို မထည့်ဘဲ လွတ်လပ်စွာ ကျော်သွားနိုင်ပါသည်။ မထည့်ပါက "မမေးသူ (အမည်မသိ)" ဟု အလိုအလျောက် မှတ်သားပေးပါမည်။',
      'Social Media အကောင့် ထည့်သွင်းရန် အကွက်များ (Social Account Fields): Viber, Facebook, TikTok, Telegram, Phone Call, Other Dropdown နှင့် ဘေးတွင် Social Account Name / ID ရိုက်ထည့်ရန် အကွက်ပါရှိခြင်း။',
      'မွေးနံ label နှင့် ၁ နွေ၊ ၂ လာ စာသားများ (Shorthand Day Names): "မွေးနေ့ (နေ့နံ)" အစား "မွေးနံ" ဟု ပြောင်းလဲပြီး "၁ နွေ", "၂ လာ", "၃ ဂါ", "၄ ဟူး", "၅ တေး", "၆ ကြာ", "၇ နေ", "၈ ရာ" ဟု ပြောင်းလဲထားခြင်း။',
      'ဟောချက်နှင့် ယတြာ ရိုက်ရန်အကွက်များ ဖြုတ်ခြင်း (Removed Section 7): စာရင်းသွင်းပုံစံမှ Section 7 (ဟောချက်များနှင့် ယတြာညွှန်ကြားချက် ရိုက်သည့် အကွက်ကြီးများ) ကို ဖြုတ်လိုက်ပါပြီ။',
      'DD / MM / YYYY ရက်စွဲ ပြသမှုစနစ် (DD / MM / YYYY Date Formatting): စနစ်တစ်ခွင်ရှိ ရက်စွဲပြသမှုများ၊ ပရင့်ပြေစာများနှင့် ဇယားများတွင် ရက်စွဲများကို DD / MM / YYYY ပုံစံဖြင့် သပ်ရပ်စွာ ပြသပေးခြင်း။'
    ]
  },
  {
    version: '1.3.8',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Direct PDF, PNG & JPEG Export with Full Horoscope Dossier, Yatra, Predictions & Financial Breakdown',
    changelog: [
      'PDF၊ PNG ပုံရိပ်နှင့် JPEG ပုံစံစုံ ထုတ်ယူနိုင်ခြင်း (Multi-Format Export)',
      'မေးသူဇာတာ အပြည့်အစုံ ထည့်သွင်းပေးထားမှု (Client Horoscope Dossier)',
      'ယတြာအစီအရင်နှင့် ညွှန်ကြားချက်များ (Yatra Rituals & Instructions)',
      'ဆရာ့ဟောကိန်း အပြည့်အစုံ (Astrological Predictions)',
      'ကျသင့်ငွေစာရင်း အသေးစိတ် (Itemized Financial Breakdown)'
    ]
  },
  {
    version: '1.3.7',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Zero Presets, Memory Chips, Collision-Proof Multi-User ID & Returning Customer History Dossier',
    changelog: [
      'ကြိုတင်သတ်မှတ်ထားသော Preset များ အကုန်ဖျက်သိမ်းခြင်း (Zero Presets)',
      'ထည့်ဖူးသော စာရင်းများ မှတ်သားပေးထားမှု (Memory Quick-Chips)',
      'စက် ၂/၃ လုံး ပြိုင်တူသုံးသော်လည်း ID မထပ်နိုင်သော စနစ် (Collision-Proof Customer ID)',
      'Customer အဟောင်း ရှာဖွေမှုနှင့် မှတ်တမ်းရာဇဝင် (Returning Customer History Dossier)',
      'စာရင်းအချက်အလက် ခေါင်းစဉ် ပြင်ဆင်ခြင်း (Fixed Summary Stats)'
    ]
  },
  {
    version: '1.3.6',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Forced PWA Install Prompt, Guaranteed Version Pop-up & Multi-Role User RBAC',
    changelog: [
      'Forced PWA Mobile App Install Prompt (PWA အက်ပ် ထည့်သွင်းရန် အမြဲတမ်း အချက်ပြစနစ်)',
      'Guaranteed Version Changelog Pop-up (ဗားရှင်းအသစ်တိုင်း Pop-up မဖြစ်မနေ ပေါ်စေခြင်း)',
      'Role-Based User Account Management & Permissions Matrix (အသုံးပြုသူ အကောင့်များနှင့် လုပ်ပိုင်ခွင့်များ)',
      'Clean Header & Mobile UX (ထိပ်ပိုင်း အိုင်ကွန်များ ရှင်းလင်းကျစ်လျစ်စေခြင်း)',
      'Purely Custom Yatra System (စိတ်ကြိုက် ယတြာ တိုက်ရိုက်ထည့်သွင်းမှု စနစ်)'
    ]
  },
  {
    version: '1.3.5',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Clean Header, Pure Custom Yatra & Multi-Role User Account Management',
    changelog: [
      'ထိပ်ပိုင်း အိုင်ကွန်များ ရှင်းလင်းကျစ်လျစ်စေခြင်း (Clean Header & Mobile UX)',
      'စိတ်ကြိုက် ယတြာ တိုက်ရိုက်ထည့်သွင်းမှု စနစ် (Purely Custom Yatra System)',
      'အသုံးပြုသူ အကောင့်များနှင့် လုပ်ပိုင်ခွင့်များ စီမံခန့်ခွဲမှု (User Management & Permissions Matrix)'
    ]
  },
  {
    version: '1.3.4',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Unified Workflow Status & Automatic Version Release Changelog Pop-up',
    changelog: [
      'အခြေအနေနှင့် ပြီးစီးမှု ပေါင်းစည်းရှင်းလင်းခြင်း (Unified Status Workflow)',
      'ဗားရှင်းအသစ်တိုင်း Pop-up အလိုအလျောက် ပြသခြင်း (Auto Changelog Pop-up)',
      'Auto-Generated ID with Customizer (ဗေဒင်မေးသူ ID အလိုအလျောက် ထွက်ရှိမှု)',
      'Live Online / Offline Status Indicator (ကွန်ရက် အခြေအနေ အချိန်နှင့်တပြေးညီ ပြသခြင်း)'
    ]
  },
  {
    version: '1.3.3',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Auto-ID, Live Online/Offline Status, Custom Yatra & Custom Amulet Pricing',
    changelog: [
      'ဗေဒင်မေးသူ ID အလိုအလျောက် ထွက်ရှိမှု (Auto-Generated ID with Customizer)',
      'Live Online / Offline Status Indicator (ကွန်ရက် ချိတ်ဆက်မှု အချိန်နှင့်တပြေးညီ အချက်ပြစနစ်)',
      'Enhanced Custom Yatra System (ယတြာ စိတ်ကြိုက် ရွေးချယ်မှုနှင့် ထည့်သွင်းမှု စနစ်)',
      'Custom Amulets & Custom Price POS (စိတ်ကြိုက် အဆောင်ပစ္စည်းနှင့် ဈေးနှုန်း သတ်မှတ်နိုင်ခြင်း)'
    ]
  },
  {
    version: '1.3.2',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၃၀',
    title: 'Mobile Viewport Anti-Horizontal-Scroll, Continuous Version Watcher & PWA Experience',
    changelog: [
      'ဘေးသို့ Horizontal Scroll ထွက်နေသည့် ပြဿနာ အပြီးတိုင် ဖြေရှင်းခြင်း (Zero Mobile Overrun)',
      'PWA Mobile App Integration (ဖုန်းတွင် အလွယ်တကူ သွင်းယူနိုင်ခြင်း & iOS Safari Guide)',
      'Continuous Cloud Version Polling (စက္ကန့် ၃၀ လျှင် တစ်ကြိမ် အလိုအလျောက် စစ်ဆေးခြင်း)',
      'Real-time Version Update Pop-up Modal (ဗားရှင်းအသစ် Pop-up ဖြင့် အသိပေးခြင်း)'
    ]
  },
  {
    version: '1.3.1',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Multi-User Concurrency, Zero Overwrite & Collision Guard',
    changelog: [
      'Duplicate ID တိုက်မိမှု အလိုအလျောက် ကာကွယ်ခြင်း (Collision-Proof Auto Guard)',
      'Smart Field-Level Deep Merge (Zero Overwrite)',
      'Multi-Device Workstation Identity (စက်အမည် သတ်မှတ်ခြင်း & Audit Trail)',
      'Unlimited Multi-Device Scale (လူ ၂ ဦးမက စက်ပေါင်းစုံ ပြိုင်တူသုံးစွဲနိုင်ခြင်း)'
    ]
  },
  {
    version: '1.3.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Google Cloud Firestore Real-time Auto-Sync',
    badge: 'Major Cloud DB',
    changelog: [
      'Google Cloud Firestore Database ဗဟိုစနစ် တည်ဆောက်ချိတ်ဆက်ခြင်း (dub-height-4wh4c)',
      'ဖုန်းနှင့် ကွန်ပျူတာ စက် (၂) လုံးကြား Refresh လုပ်စရာမလိုဘဲ စက္ကန့်ပိုင်းအတွင်း ပေါ်လာသော Real-time Auto-Sync',
      'Database Quota 1 GiB (~၁,၀၀၀,၀၀၀+ မှတ်တမ်း) အထိ အသုံးပြုနိုင်သော Cloud စနစ်',
      'Navbar နှင့် Sidebar တွင် Real-time Live Sync အချက်ပြခလုတ်နှင့် Cloud Push စနစ် ထည့်သွင်းခြင်း'
    ]
  },
  {
    version: '1.2.1',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Cloudflare Pages & Super Admin Authentication',
    changelog: [
      'Super Admin သီးသန့် အကောင့်စနစ် (User Name: Amt / Password: Amt999)',
      'ကျန်ရှိသော အကောင့်များ ဖျက်ပစ်ပြီး လုံခြုံရေး အဆင့်မြှင့်တင်ခြင်း',
      'On-demand Drawer Sidebar ပြင်ဆင်ခြင်း',
      'Cloudflare Pages Static Deployment အတွက် အပြည့်အဝ ပြင်ဆင်ခြင်း'
    ]
  },
  {
    version: '1.2.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'PWA Mobile App & Clean Slate Data',
    changelog: [
      'သန့်ရှင်းသော မူလစာရင်း (Clean Slate Zero Data)',
      'Android / iOS ဖုန်းများတွင် App ကဲ့သို့ ထည့်သွင်းနိုင်သော PWA Install စနစ်',
      'Offline-First Service Worker ဖြင့် အင်တာနက်မရှိချိန် အသုံးပြုနိုင်ခြင်း'
    ]
  },
  {
    version: '1.1.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၈',
    title: 'Monthly Reports & Royal VIP Dossier',
    changelog: [
      'လစဉ် ဝင်ငွေ၊ ထွက်ငွေ၊ အမြတ်စာရင်း အသေးစိတ် ရှင်းတမ်း (Monthly Reports)',
      'Royal VIP ဖောက်သည်များ စာရင်းနှင့် ဝန်ဆောင်မှု ရာဇဝင်',
      'ပြေစာ/ဘောက်ချာ Print စနစ်'
    ]
  },
  {
    version: '1.0.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၈',
    title: 'Initial Release - Myanmar Traditional Astrology POS',
    changelog: [
      'မြန်မာ့ရိုးရာ မဟာဘုတ်နှင့် မွေးနေ့ တွက်ချက်မှု စနစ်',
      'ဗေဒင်မေးသူများ စာရင်းသွင်းခြင်းနှင့် ငွေလက်ခံ POS စနစ်',
      'နဝင်းယတြာနှင့် အဆောင်ပစ္စည်း ကတ်တလောက် ရောင်းချမှု စနစ်'
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
