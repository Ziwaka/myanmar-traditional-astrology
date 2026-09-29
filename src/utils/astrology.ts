import { DayOfWeekBurmese, MahaboteHouse, NavawinCountType, ServiceCategory, ExpenseCategory } from '../types';

export const BURMESE_DAYS: { key: DayOfWeekBurmese; label: string; planet: string; number: number; animal: string }[] = [
  { key: 'တနင်္ဂနွေ', label: 'တနင်္ဂနွေ (Sunday)', planet: 'နေမင်း', number: 1, animal: 'ဂဠုန်' },
  { key: 'တနင်္လာ', label: 'တနင်္လာ (Monday)', planet: 'လမင်း', number: 2, animal: 'ကျား' },
  { key: 'အင်္ဂါ', label: 'အင်္ဂါ (Tuesday)', planet: 'အင်္ဂါဂြိုဟ်', number: 3, animal: 'ခြင်္သေ့' },
  { key: 'ဗုဒ္ဓဟူး', label: 'ဗုဒ္ဓဟူး (Wed AM)', planet: 'ဗုဒ္ဓဟူးဂြိုဟ်', number: 4, animal: 'ဆင်စွယ်စုံ' },
  { key: 'ရာဟု', label: 'ရာဟု (Wed PM)', planet: 'ရာဟုဂြိုဟ်', number: 8, animal: 'ဟိုင်းဆင်' },
  { key: 'ကြာသပတေး', label: 'ကြာသပတေး (Thursday)', planet: 'ကြာသပတေးဂြိုဟ်', number: 5, animal: 'ကြွက်' },
  { key: 'သောကြာ', label: 'သောကြာ (Friday)', planet: 'သောကြာဂြိုဟ်', number: 6, animal: 'ပူး' },
  { key: 'စနေ', label: 'စနေ (Saturday)', planet: 'စနေဂြိုဟ်', number: 7, animal: 'နဂါး' },
];

export const MAHABOTE_HOUSES: { key: MahaboteHouse; label: string; meaning: string }[] = [
  { key: 'ဘင်္ဂ', label: 'ဘင်္ဂ', meaning: 'ပျက်စီး၊ ပြောင်းလဲ၊ အစွန်းရောက်' },
  { key: 'မရဏ', label: 'မရဏ', meaning: 'ပင်ပန်း၊ သေကြေ၊ လျှို့ဝှက်' },
  { key: 'အထွန်း', label: 'အထွန်း', meaning: 'ထင်ပေါ်၊ ကျော်ကြား၊ ထွန်းကား' },
  { key: 'သိုက်', label: 'သိုက်', meaning: 'ဥစ္စာရတနာ၊ စုဆောင်း၊ အခြွေအရံ' },
  { key: 'ရာဇ', label: 'ရာဇ', meaning: 'အာဏာ၊ အုပ်ချုပ်၊ မင်းစိုးရာဇာ' },
  { key: 'ပုတိ', label: 'ပုတိ', meaning: 'ဆုတ်ယုတ်၊ ညစ်နွမ်း၊ နှောင့်နှေး' },
  { key: 'အဓိပတိ', label: 'အဓိပတိ', meaning: 'ခေါင်းဆောင်၊ ကြီးစိုး၊ အောင်မြင်' },
];

export const SERVICE_CATEGORIES: { key: ServiceCategory; label: string; defaultFee: number; desc: string }[] = [
  { key: 'general_reading', label: 'ဗေဒင်ဟောစာတမ်း (အထွေထွေ)', defaultFee: 20000, desc: '၁ နှစ်စာ ကံကြမ္မာ အတက်အကျနှင့် သတိပြုရန်များ' },
  { key: 'detailed_horoscope', label: 'ဇာတာဖွဲ့/လက်ခဏာစစ်', defaultFee: 35000, desc: 'မွေးဇာတာဖွဲ့စည်း၍ တသက်တာ ကံကြမ္မာ စစ်ဆေးခြင်း' },
  { key: 'navawin_ritual', label: 'နဝင်းယတြာ အထူးကုစားမှု', defaultFee: 30000, desc: 'ဂြိုဟ်ဆိုးပြေ ပုတီးစိပ်၊ နဝင်းလှည့် ယတြာအစီအရင်' },
  { key: 'name_naming', label: 'အမည်ပေး မင်္ဂလာ', defaultFee: 25000, desc: 'မွေးနေ့နံဓာတ်နှင့် ကိုက်ညီသော မင်္ဂလာအမည် ရွေးချယ်ပေးခြင်း' },
  { key: 'marriage_match', label: 'အိမ်ထောင်ဖက် ဓာတ်စစ်', defaultFee: 30000, desc: 'ဇနီးမောင်နှံ ဓာတ်ဆန့်ကျင်/ဓာတ်ပြေနှင့် မင်္ဂလာရက်ရွေး' },
  { key: 'business_prosperity', label: 'စီးပွားလာဘ်ရွှင် ယတြာ', defaultFee: 40000, desc: 'အရောင်းအဝယ် ကံပွင့်၊ လာဘ်ရွှင် အစီအရင်' },
  { key: 'health_protection', label: 'ကျန်းမာရေး/အန္တရာယ်ကင်း', defaultFee: 25000, desc: 'ရောဂါဝေဒနာ သက်သာစေရန်နှင့် ဘေးလွတ်ကင်း ယတြာ' },
];

export const NAWAWIN_OPTIONS: { key: NavawinCountType; label: string; count: number; defaultFee: number }[] = [
  { key: 'none', label: 'မပါရှိပါ', count: 0, defaultFee: 0 },
  { key: '1_time', label: '၁ ကြိမ်စာ နဝင်းယတြာ', count: 1, defaultFee: 15000 },
  { key: '2_times', label: '၂ ကြိမ်စာ နဝင်းယတြာ', count: 2, defaultFee: 30000 },
  { key: '3_times', label: '၃ ကြိမ်စာ နဝင်းယတြာ (အပြည့်အစုံ)', count: 3, defaultFee: 45000 },
  { key: 'special', label: 'အထူး ၉ ရက်နဝင်း ယတြာ', count: 9, defaultFee: 60000 },
];

export const EXPENSE_CATEGORIES: { key: ExpenseCategory; label: string }[] = [
  { key: 'yatra_materials', label: 'ယတြာပစ္စည်း ဝယ်ယူမှု' },
  { key: 'flower_candles', label: 'ပန်း၊ ဆီမီး၊ အမွှေးတိုင်' },
  { key: 'offering_pwe', label: 'ကန်တော့ပွဲ/ပူဇော်ပွဲ စရိတ်' },
  { key: 'office_utilities', label: 'ရုံးသုံး/ခန်းမ/မီး/ရေ' },
  { key: 'assistant_fee', label: 'လက်ထောက်/စာရေး စရိတ်' },
  { key: 'other', label: 'အထွေထွေ ကုန်ကျစရိတ်' },
];

// Helper to format currency in Myanmar Kyats
export function formatMMK(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '၀ ကျပ်';
  return new Intl.NumberFormat('my-MM').format(amount) + ' ကျပ်';
}

export function formatNumberEN(amount: number | undefined | null): string {
  if (!amount) return '0';
  return new Intl.NumberFormat('en-US').format(amount);
}

// Convert English numbers to Burmese numerals (e.g. 1234 -> ၁,၂၃၄)
export function toBurmeseNumerals(n: number | string): string {
  const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  return String(n).replace(/[0-9]/g, (w) => burmeseDigits[+w]);
}

// Helper to get Burmese day of week from standard date string YYYY-MM-DD
export function getBurmeseDayFromDate(dateStr: string): DayOfWeekBurmese {
  if (!dateStr) return 'တနင်္ဂနွေ';
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const map: Record<number, DayOfWeekBurmese> = {
    0: 'တနင်္ဂနွေ',
    1: 'တနင်္လာ',
    2: 'အင်္ဂါ',
    3: 'ဗုဒ္ဓဟူး',
    4: 'ကြာသပတေး',
    5: 'သောကြာ',
    6: 'စနေ'
  };
  return map[day] || 'တနင်္ဂနွေ';
}

// Helper to calculate approximate Mahabote house from Gregorian birthdate and Burmese day
export function calculateMahabote(birthDateStr: string, dayOfWeek: DayOfWeekBurmese): MahaboteHouse {
  if (!birthDateStr) return 'အထွန်း';
  const d = new Date(birthDateStr);
  const year = d.getFullYear();
  // Myanmar Era approx: CE year - 638 (if after Tagu approx April)
  const myanmarYear = Math.max(1, year - 638);
  const remainder = myanmarYear % 7;

  const dayNumberMap: Record<DayOfWeekBurmese, number> = {
    'တနင်္ဂနွေ': 1,
    'တနင်္လာ': 2,
    'အင်္ဂါ': 3,
    'ဗုဒ္ဓဟူး': 4,
    'ရာဟု': 8, // treated astrologically or 4
    'ကြာသပတေး': 5,
    'သောကြာ': 6,
    'စနေ': 0, // or 7
  };

  const dayNum = dayNumberMap[dayOfWeek] === 8 ? 4 : dayNumberMap[dayOfWeek];
  // Standard Mahabote chart position: (Remainder offset + day) % 7
  const houseOrder: MahaboteHouse[] = ['ဘင်္ဂ', 'အထွန်း', 'ရာဇ', 'အဓိပတိ', 'မရဏ', 'သိုက်', 'ပုတိ'];
  const index = Math.abs((dayNum - remainder + 7) % 7);
  return houseOrder[index] || 'အထွန်း';
}

// Format Date to friendly localized format
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('my-MM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
