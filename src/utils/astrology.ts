import { DayOfWeekBurmese, MahaboteHouse, NavawinCountType, ExpenseCategory } from '../types';

export const BURMESE_DAYS: { key: DayOfWeekBurmese; shorthand: string; label: string; planet: string; number: number; animal: string }[] = [
  { key: 'တနင်္ဂနွေ', shorthand: '၁ နွေ', label: '၁ နွေ (Sunday)', planet: 'နေမင်း', number: 1, animal: 'ဂဠုန်' },
  { key: 'တနင်္လာ', shorthand: '၂ လာ', label: '၂ လာ (Monday)', planet: 'လမင်း', number: 2, animal: 'ကျား' },
  { key: 'အင်္ဂါ', shorthand: '၃ ဂါ', label: '၃ ဂါ (Tuesday)', planet: 'အင်္ဂါဂြိုဟ်', number: 3, animal: 'ခြင်္သေ့' },
  { key: 'ဗုဒ္ဓဟူး', shorthand: '၄ ဟူး', label: '၄ ဟူး (Wed AM)', planet: 'ဗုဒ္ဓဟူးဂြိုဟ်', number: 4, animal: 'ဆင်စွယ်စုံ' },
  { key: 'ကြာသပတေး', shorthand: '၅ တေး', label: '၅ တေး (Thursday)', planet: 'ကြာသပတေးဂြိုဟ်', number: 5, animal: 'ကြွက်' },
  { key: 'သောကြာ', shorthand: '၆ ကြာ', label: '၆ ကြာ (Friday)', planet: 'သောကြာဂြိုဟ်', number: 6, animal: 'ပူး' },
  { key: 'စနေ', shorthand: '၇ နေ', label: '၇ နေ (Saturday)', planet: 'စနေဂြိုဟ်', number: 7, animal: 'နဂါး' },
  { key: 'ရာဟု', shorthand: '၈ ရာ', label: '၈ ရာ (Wed PM)', planet: 'ရာဟုဂြိုဟ်', number: 8, animal: 'ဟိုင်းဆင်' },
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

// Convert Date string to DD / MM / YYYY format
export function formatDateDDMMYYYY(dateStr?: string | null): string {
  if (!dateStr) return '';
  const cleanStr = dateStr.trim();
  
  // Handles ISO date strings like "2026-09-29T18:49" or "2026-09-29"
  if (cleanStr.includes('T') || cleanStr.includes(' ')) {
    const parts = cleanStr.split(/T|\s+/);
    const datePart = parts[0];
    const timePart = parts[1] ? parts[1].slice(0, 5) : '';
    if (datePart.includes('-')) {
      const [y, m, d] = datePart.split('-');
      return `${d} / ${m} / ${y}${timePart ? ' (' + timePart + ')' : ''}`;
    }
  }

  if (cleanStr.includes('-')) {
    const [y, m, d] = cleanStr.split('-');
    if (y && m && d) {
      return `${d} / ${m} / ${y}`;
    }
  }

  return cleanStr;
}

// Convert English Date to Burmese Day of Week
export function getBurmeseDayFromDate(dateString: string): DayOfWeekBurmese {
  if (!dateString) return 'တနင်္လာ';
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  switch (day) {
    case 0: return 'တနင်္ဂနွေ';
    case 1: return 'တနင်္လာ';
    case 2: return 'အင်္ဂါ';
    case 3: return 'ဗုဒ္ဓဟူး';
    case 4: return 'ကြာသပတေး';
    case 5: return 'သောကြာ';
    case 6: return 'စနေ';
    default: return 'တနင်္လာ';
  }
}

// Calculate Mahabote House from Burmese Era Year and Day
export function calculateMahabote(burmeseYear: number, dayOfWeek: DayOfWeekBurmese): MahaboteHouse {
  const remainder = burmeseYear % 7;
  const dayNumberMap: Record<DayOfWeekBurmese, number> = {
    'တနင်္ဂနွေ': 1,
    'တနင်္လာ': 2,
    'အင်္ဂါ': 3,
    'ဗုဒ္ဓဟူး': 4,
    'ရာဟု': 4,
    'ကြာသပတေး': 5,
    'သောကြာ': 6,
    'စနေ': 0, // In standard mahabote, Saturday is remainder 0
  };

  const dayNum = dayNumberMap[dayOfWeek];
  const houseRemainder = (remainder - dayNum + 7) % 7;

  switch (houseRemainder) {
    case 1: return 'ဘင်္ဂ';
    case 2: return 'မရဏ';
    case 3: return 'အထွန်း';
    case 4: return 'သိုက်';
    case 5: return 'ရာဇ';
    case 6: return 'ပုတိ';
    case 0: return 'အဓိပတိ';
    default: return 'အထွန်း';
  }
}
