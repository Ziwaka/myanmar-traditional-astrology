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

export const LOCAL_APP_VERSION = '1.3.1';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';

// All historical versions curated in code for immediate offline/online display
export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.3.1',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Multi-User Concurrency, Zero Overwrite & Collision Guard',
    badge: 'Latest Release',
    changelog: [
      'Duplicate ID တိုက်မိမှု အလိုအလျောက် ကာကွယ်ခြင်း (Collision-Proof Auto Guard): စက် ၂ လုံးက တစ်ပြိုင်နက် နံပါတ်တူ သွင်းမိပါက အလိုအလျောက် ID အသစ်သို့ ခွဲထုတ်သိမ်းဆည်းပေးခြင်း။',
      'Smart Field-Level Deep Merge (Zero Overwrite): ဆရာက ဟောချက်ဖြည့်နေချိန် ကောင်တာက ငွေရှင်းလျှင် တစ်ဦးပြင်ထားသည်ကို နောက်တစ်ဦးက အစားထိုး မဖျက်ချနိုင်အောင် ပေါင်းစည်းပေးခြင်း။',
      'Multi-Device Workstation Identity (စက်အမည် သတ်မှတ်နိုင်ခြင်း): ကောင်တာ (၁)၊ ဆရာ့အခန်း စသဖြင့် စက်အလိုက် အမည်ပေး၍ မည်သူသွင်း/မည်သူပြင် Audit Trail မှတ်တမ်းတင်ခြင်း။',
      'Unlimited Multi-Device Scale: လူ (၂) ဦးသာမက စက်ပေါင်းစုံ (၃၊ ၅၊ ၁၀ ဦး) ပြိုင်တူ တိုက်ရိုက် အသုံးပြုနိုင်ခြင်း။'
    ]
  },
  {
    version: '1.3.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Google Cloud Firestore Real-time Auto-Sync',
    badge: 'Major Cloud DB',
    changelog: [
      'Google Cloud Firestore Database ဗဟိုစနစ် တည်ဆောက်ချိတ်ဆက်ပြီးစီးခြင်း (dub-height-4wh4c)။',
      'ဖုန်းနှင့် ကွန်ပျူတာ စက် (၂) လုံးကြား Refresh လုပ်စရာမလိုဘဲ စက္ကန့်ပိုင်းအတွင်း အလိုအလျောက် ပေါ်လာသော Real-time Auto-Sync စနစ်။',
      'Database Quota 1 GiB (~မှတ်တမ်းပေါင်း ၁,၀၀၀,၀၀၀+ ကျော်) အထိ အသုံးပြုနိုင်သော Cloud စနစ်။',
      'Navbar နှင့် Sidebar တွင် ၂ ဦးတွဲ Real-time Live Sync အချက်ပြခလုတ်နှင့် လက်ရှိစာရင်းများ Cloud သို့ Push လုပ်နိုင်သော စနစ် ထည့်သွင်းခြင်း။'
    ]
  },
  {
    version: '1.2.1',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'Cloudflare Pages & Super Admin Authentication',
    changelog: [
      'Super Admin သီးသန့် အကောင့်စနစ် (User Name: Amt / Password: Amt999) ဖြင့်သာ ဝင်ရောက်နိုင်ခြင်း။',
      'ကျန်ရှိသော User Accounts အားလုံးကို ဖျက်ပစ်ပြီး လုံခြုံရေး အဆင့်မြှင့်တင်ခြင်း။',
      'Side Bar ကို ခေါ်မှသာ ပေါ်စေသော On-demand Drawer အဖြစ် ပြင်ဆင်ခြင်း။',
      'Online ဝင်တိုင်း Cloud ဗားရှင်းနှင့် Local ဗားရှင်း အလိုအလျောက် တိုက်စစ်ဆေးမှု စနစ်။',
      'GitHub Push & Cloudflare Pages Static Deployment အတွက် အပြည့်အဝ ပြင်ဆင်ပြီးစီးခြင်း။'
    ]
  },
  {
    version: '1.2.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၉',
    title: 'PWA Mobile App & Clean Slate Data',
    changelog: [
      'သန့်ရှင်းသော မူလစာရင်း (Clean Slate Zero Data) ဖြင့် အမှန်တကယ် စာရင်းသွင်းနိုင်အောင် စီစဉ်ခြင်း။',
      'Android / iOS ဖုန်းများတွင် App ကဲ့သို့ ထည့်သွင်းနိုင်သော PWA Install စနစ်။',
      'Offline-First Service Worker ဖြင့် အင်တာနက်မရှိချိန်တွင် အသုံးပြုနိုင်ခြင်း။'
    ]
  },
  {
    version: '1.1.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၈',
    title: 'Monthly Reports & Royal VIP Dossier',
    changelog: [
      'လစဉ် ဝင်ငွေ၊ ထွက်ငွေ၊ အမြတ်စာရင်း အသေးစိတ် ရှင်းတမ်း (Monthly Reports)။',
      'အမြဲအားပေးသော Royal VIP ဖောက်သည်များ စာရင်းနှင့် ဝန်ဆောင်မှု ရာဇဝင်။',
      'ပြေစာ/ဘောက်ချာ Thermal Slip နှင့် A4 Print ထုတ်နိုင်သော စနစ်။'
    ]
  },
  {
    version: '1.0.0',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ ၂၈',
    title: 'Initial Release - Myanmar Traditional Astrology POS',
    changelog: [
      'မြန်မာ့ရိုးရာ မဟာဘုတ်နှင့် မွေးနေ့ တွက်ချက်မှု စနစ်။',
      'ဗေဒင်မေးသူများ စာရင်းသွင်းခြင်းနှင့် ငွေလက်ခံ POS စနစ်။',
      'နဝင်းယတြာနှင့် အဆောင်ပစ္စည်း ကတ်တလောက် ရောင်းချမှု စနစ်။'
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

// Compare semantic versions (e.g. "1.3.1" > "1.3.0")
export function compareVersions(cloudVer: string, localVer: string): number {
  const cParts = cloudVer.split('.').map(n => parseInt(n, 10) || 0);
  const lParts = localVer.split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(cParts.length, lParts.length);

  for (let i = 0; i < maxLen; i++) {
    const c = cParts[i] || 0;
    const l = lParts[i] || 0;
    if (c > l) return 1;  // Cloud is newer
    if (c < l) return -1; // Local is newer
  }
  return 0; // Same version
}

// Fetch Cloud Authoritative Version from /version.json
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
      // Fallback to in-memory authoritative version
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
