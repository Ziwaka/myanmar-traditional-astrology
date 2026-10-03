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

export const LOCAL_APP_VERSION = '1.5.4';
const LOCAL_VERSION_KEY = 'myanmar_astrology_local_version';
const LAST_SEEN_CHANGELOG_KEY = 'myanmar_astrology_last_seen_changelog';

export const ALL_VERSION_HISTORY: VersionRelease[] = [
  {
    version: '1.5.4',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Complete Historical Watat Exception Table (ceMmDateTime Algorithm)',
    badge: 'Latest Release',
    changelog: [
      'မြန်မာနိုင်ငံ သမိုင်းဝင်ပြက္ခဒိန် အကြွင်းဇယားနှင့် ဝါထပ်ကိန်းများ (၁၃၄၄၊ ၁၃၄၅ ဝါထပ်ကိန်းများ အပါအဝင်) အား အပြည့်အစုံ ထည့်သွင်းခြင်း။',
      '၄-၁၀-၁၉၈၂ (4 October 1982) ရက်စွဲအတွက် "၁၃၄၄ ခု၊ တော်သလင်း လဆုတ် ၂ ရက် (၂ လာ)" နှင့် မဟာဘုတ် "ပုတိ" အဖြစ် မြန်မာပြက္ခဒိန် အစစ်အမှန်နှင့် ၁၀၀% တထပ်တည်း တိကျစွာ တွက်ထုတ်ပြသခြင်း။',
      '၂၃-၃-၁၉၉၀ (23 March 1990) ရက်စွဲအတွက် "၁၃၅၁ ခု၊ တပေါင်း လဆုတ် ၁၃ ရက် (၆ ကြာ)" နှင့် မဟာဘုတ် "အထွန်း" အဖြစ် ၁၀၀% တထပ်တည်း တိကျစွာ တွက်ထုတ်ပြသခြင်း။'
    ]
  },
  {
    version: '1.5.3',
    releaseDate: '၂၀၂၆ ခုနှစ်၊ အောက်တိုဘာ ၂',
    title: 'Precise Waning Moon Formatting (လဆုတ် ၁၃ ရက်) & Editable Myanmar Birth Date Field',
    changelog: [
      'တွက်ချက်ရရှိသော မြန်မာ မွေးရက်စွဲ (myanmarBirthDate) အား လိုအပ်ပါက သုံးစွဲသူစိတ်ကြိုက် တိုက်ရိုက် ပြင်ဆင်ရိုက်ထည့်နိုင်သော Editable Input Field ပြုလုပ်ပေးခြင်း။'
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
