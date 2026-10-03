// Myanmar Calendar Astronomical Calculation Engine (mmcal standard)
// Converts between Gregorian Date (YYYY-MM-DD) and Myanmar Era (ME) Date

import { DayOfWeekBurmese, MahaboteHouse } from '../types';

export const MYANMAR_MONTHS = [
  'တန်းခူး',
  'ကဆုန်',
  'နယုန်',
  'ဝါဆို',
  'ဝါခေါင်',
  'တော်သလင်း',
  'သီတင်းကျွတ်',
  'တန်ဆောင်မုန်း',
  'နတ်တော်',
  'ပြာသို',
  'တပို့တွဲ',
  'တပေါင်း',
];

export const MOON_PHASES = ['လဆန်း', 'လပြည့်', 'လဆုတ်', 'လကွယ်'];

export interface MyanmarDateResult {
  myanmarYear: number; // e.g. 1388
  myanmarYearStr: string; // e.g. "၁၃၈၈"
  monthName: string; // e.g. "သီတင်းကျွတ်"
  monthIndex: number; // 0..11
  moonPhase: string; // "လဆန်း" | "လပြည့်" | "လဆုတ်" | "လကွယ်"
  fortnightDay: number; // 1..15
  fortnightDayStr: string; // e.g. "၅"
  dayOfWeek: DayOfWeekBurmese; // e.g. "သောကြာ"
  dayOfWeekShorthand: string; // e.g. "၆ ကြာ"
  mahabote: MahaboteHouse; // e.g. "အထွန်း"
  fullFormattedStr: string; // e.g. "၁၃၈၈ ခု၊ သီတင်းကျွတ် လဆန်း ၅ ရက် (၆ ကြာ)"
}

// Convert English numbers to Burmese numerals
export function toBurmeseNumerals(num: number | string): string {
  const map: Record<string, string> = {
    '0': '၀',
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉',
  };
  return num.toString().replace(/[0-9]/g, (w) => map[w] || w);
}

// Convert Burmese numerals to English numbers
export function toEnglishNumerals(str: string): string {
  const map: Record<string, string> = {
    '၀': '0',
    '၁': '1',
    '၂': '2',
    '၃': '3',
    '၄': '4',
    '၅': '5',
    '၆': '6',
    '၇': '7',
    '၈': '8',
    '၉': '9',
  };
  return str.replace(/[၀-၉]/g, (w) => map[w] || w);
}

// Convert Gregorian Date (y, m, d) to Julian Day Number (JDN)
export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// Convert Julian Day Number (JDN) to Gregorian Date { year, month, day }
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number; dateString: string } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  const mm = month < 10 ? `0${month}` : `${month}`;
  const dd = day < 10 ? `0${day}` : `${day}`;

  return { year, month, day, dateString: `${year}-${mm}-${dd}` };
}

// Get Day of Week from JDN
export function getDayOfWeekFromJDN(jdn: number): DayOfWeekBurmese {
  const day = (jdn + 1) % 7; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  switch (day) {
    case 0:
      return 'တနင်္ဂနွေ';
    case 1:
      return 'တနင်္လာ';
    case 2:
      return 'အင်္ဂါ';
    case 3:
      return 'ဗုဒ္ဓဟူး';
    case 4:
      return 'ကြာသပတေး';
    case 5:
      return 'သောကြာ';
    case 6:
      return 'စနေ';
    default:
      return 'တနင်္လာ';
  }
}

export function getDayShorthand(dow: DayOfWeekBurmese): string {
  switch (dow) {
    case 'တနင်္ဂနွေ':
      return '၁ နွေ';
    case 'တနင်္လာ':
      return '၂ လာ';
    case 'အင်္ဂါ':
      return '၃ ဂါ';
    case 'ဗုဒ္ဓဟူး':
      return '၄ ဟူး';
    case 'ရာဟု':
      return '၈ ရာ';
    case 'ကြာသပတေး':
      return '၅ တေး';
    case 'သောကြာ':
      return '၆ ကြာ';
    case 'စနေ':
      return '၇ နေ';
    default:
      return '၁ နွေ';
  }
}

// Calculate Mahabote House from Myanmar Era Year & Day of Week
export function calculateMahaboteFromME(myanmarYear: number, dow: DayOfWeekBurmese): MahaboteHouse {
  const remainder = myanmarYear % 7;
  const dayMap: Record<DayOfWeekBurmese, number> = {
    'တနင်္ဂနွေ': 1,
    'တနင်္လာ': 2,
    'အင်္ဂါ': 3,
    'ဗုဒ္ဓဟူး': 4,
    'ရာဟု': 4,
    'ကြာသပတေး': 5,
    'သောကြာ': 6,
    'စနေ': 0,
  };

  const dayNum = dayMap[dow] ?? 1;
  const houseIndex = (dayNum - remainder + 7) % 7;

  // Standard index map
  const chart: MahaboteHouse[] = [
    'အဓိပတိ', // 0
    'ဘင်္ဂ',   // 1
    'မရဏ',   // 2
    'အထွန်း', // 3
    'သိုက်',   // 4
    'ရာဇ',   // 5
    'ပုတိ',   // 6
  ];

  return chart[houseIndex] || 'အထွန်း';
}

// Convert Gregorian Date String (YYYY-MM-DD) to Myanmar Calendar Details
export function getMyanmarDateFromGregorian(dateStr: string): MyanmarDateResult | null {
  if (!dateStr || !dateStr.includes('-')) return null;

  const parts = dateStr.split('-');
  const gy = parseInt(parts[0], 10);
  const gm = parseInt(parts[1], 10);
  const gd = parseInt(parts[2], 10);

  if (isNaN(gy) || isNaN(gm) || isNaN(gd)) return null;

  const jdn = gregorianToJDN(gy, gm, gd);
  const dow = getDayOfWeekFromJDN(jdn);

  // Approximate Myanmar Calendar calculation
  // SY = 1577917828 / 4320000 = 365.2587565
  // MO = 1954168.050623
  const MO = 1954168.050623;
  const SY = 365.2587565;
  const myanmarYear = Math.floor((jdn - MO) / SY);

  // Month calculation based on solar day position
  const dayInMY = (jdn - MO) % SY;
  const approxMonthIdx = Math.floor((dayInMY / SY) * 12) % 12;
  const monthName = MYANMAR_MONTHS[approxMonthIdx] || 'သီတင်းကျွတ်';

  // Moon phase calculation
  // Synodic month length = 29.530588 days
  const synodicMonth = 29.530588;
  const moonAge = (jdn - 0.5) % synodicMonth;
  let moonPhase = 'လဆန်း';
  let fortnightDay = Math.floor(moonAge) + 1;

  if (fortnightDay > 29) fortnightDay = 29;

  if (fortnightDay <= 14) {
    moonPhase = 'လဆန်း';
  } else if (fortnightDay === 15) {
    moonPhase = 'လပြည့်';
  } else if (fortnightDay < 29) {
    moonPhase = 'လဆုတ်';
    fortnightDay = fortnightDay - 15;
  } else {
    moonPhase = 'လကွယ်';
    fortnightDay = 15;
  }

  const mahabote = calculateMahaboteFromME(myanmarYear, dow);
  const dowShorthand = getDayShorthand(dow);
  const myStr = toBurmeseNumerals(myanmarYear);
  const fdStr = toBurmeseNumerals(fortnightDay);

  const fullFormattedStr = `${myStr} ခု၊ ${monthName} ${moonPhase} ${fdStr} ရက် (${dowShorthand})`;

  return {
    myanmarYear,
    myanmarYearStr: myStr,
    monthName,
    monthIndex: approxMonthIdx,
    moonPhase,
    fortnightDay,
    fortnightDayStr: fdStr,
    dayOfWeek: dow,
    dayOfWeekShorthand: dowShorthand,
    mahabote,
    fullFormattedStr,
  };
}

// Convert Myanmar Date (my, monthName, moonPhase, fortnightDay) to Gregorian Date YYYY-MM-DD
export function getGregorianFromMyanmarDate(
  my: number,
  monthName: string,
  moonPhase: string,
  fortnightDay: number
): { gregorianDate: string; dow: DayOfWeekBurmese; mahabote: MahaboteHouse } | null {
  if (!my || my < 1200 || my > 1500) return null;

  const mIdx = MYANMAR_MONTHS.indexOf(monthName);
  const validMIdx = mIdx >= 0 ? mIdx : 6; // default Thadingyut

  // Base JDN formula
  const MO = 1954168.050623;
  const SY = 365.2587565;
  const baseJDN = MO + my * SY;

  const monthOffset = (validMIdx / 12) * SY;
  let phaseOffset = fortnightDay;
  if (moonPhase === 'လပြည့်') phaseOffset = 15;
  if (moonPhase === 'လဆုတ်') phaseOffset = 15 + fortnightDay;
  if (moonPhase === 'လကွယ်') phaseOffset = 29;

  const approxJDN = Math.round(baseJDN + monthOffset + phaseOffset);
  const g = jdnToGregorian(approxJDN);
  const dow = getDayOfWeekFromJDN(approxJDN);
  const mahabote = calculateMahaboteFromME(my, dow);

  return {
    gregorianDate: g.dateString,
    dow,
    mahabote,
  };
}
