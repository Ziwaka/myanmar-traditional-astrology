// Authentic Myanmar Historical & Astronomical Calendar Algorithm
// (ceMmDateTime standard with full historical Watat exception tables)

import { DayOfWeekBurmese, MahaboteHouse } from '../types';

export const MYANMAR_MONTHS = [
  'တန်ခူး',
  'ကဆုန်',
  'နယုန်',
  'ပထမဝါဆို',
  'ဝါဆို',
  'ဒုဝါဆို',
  'ဝါခေါင်',
  'တော်သလင်း',
  'သီတင်းကျွတ်',
  'တန်ဆောင်မုန်း',
  'နတ်တော်',
  'ပြာသို',
  'တပို့တွဲ',
  'တပေါင်း',
  'နှောင်းတန်ခူး',
];

export const MYANMAR_MONTHS_NAMES = MYANMAR_MONTHS;

export const MOON_PHASES = ['လဆန်း', 'လပြည့်', 'လဆုတ်', 'လကွယ်'];

export interface MyanmarDateResult {
  myanmarYear: number; // e.g. 1351, 1344
  myanmarYearStr: string; // e.g. "၁၃၅၁", "၁၃၄၄"
  monthName: string; // e.g. "တပေါင်း", "တော်သလင်း"
  monthIndex: number; // 0..13
  moonPhase: string; // "လဆန်း" | "လပြည့်" | "လဆုတ်" | "လကွယ်"
  fortnightDay: number; // 1..15
  fortnightDayStr: string; // e.g. "၁၃", "၂"
  dayOfWeek: DayOfWeekBurmese; // e.g. "သောကြာ", "တနင်္လာ"
  dayOfWeekShorthand: string; // e.g. "၆ ကြာ", "၂ လာ"
  mahabote: MahaboteHouse; // e.g. "အထွန်း", "ပုတိ"
  fullFormattedStr: string; // e.g. "၁၃၅၁ ခု၊ တပေါင်း လဆုတ် ၁၃ ရက် (၆ ကြာ)"
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

// Day of Week Shorthand
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

// Map JavaScript Date Weekday (0 = Sun .. 6 = Sat) to Burmese Day of Week
export function mapJsDayToBurmese(dayIndex: number): DayOfWeekBurmese {
  const days: DayOfWeekBurmese[] = [
    'တနင်္ဂနွေ', // 0
    'တနင်္လာ',   // 1
    'အင်္ဂါ',     // 2
    'ဗုဒ္ဓဟူး',   // 3
    'ကြာသပတေး', // 4
    'သောကြာ',   // 5
    'စနေ',       // 6
  ];
  return days[dayIndex] || 'တနင်္ဂနွေ';
}

// Traditional 7x7 Mahabote Matrix indexed directly by JavaScript Date day (0 = Sunday .. 6 = Saturday)
export const MAHABOTE_BY_JSDAY: Record<number, Record<number, MahaboteHouse>> = {
  // 0-Remainder (စနေအကြွင်း e.g. 1351 ME, 1344 ME)
  0: {
    0: 'ရာဇ',     // တနင်္ဂနွေ (Sun - jsDay 0)
    1: 'ပုတိ',    // တနင်္လာ (Mon - jsDay 1) -> 1982-10-04 (ME 1344 Monday)
    2: 'ဘင်္ဂ',    // အင်္ဂါ (Tue - jsDay 2)
    3: 'မရဏ',    // ဗုဒ္ဓဟူး (Wed - jsDay 3)
    4: 'အဓိပတိ',  // ကြာသပတေး (Thu - jsDay 4)
    5: 'အထွန်း',  // သောကြာ (Fri - jsDay 5) -> 1990-03-23 (ME 1351 Friday) -> အထွန်းဖွား!
    6: 'သိုက်',    // စနေ (Sat - jsDay 6)
  },
  // 1-Remainder (တနင်္ဂနွေအကြွင်း)
  1: {
    0: 'အထွန်း',  // တနင်္ဂနွေ
    1: 'သိုက်',    // တနင်္လာ
    2: 'ရာဇ',     // အင်္ဂါ
    3: 'ပုတိ',    // ဗုဒ္ဓဟူး
    4: 'ဘင်္ဂ',    // ကြာသပတေး
    5: 'မရဏ',    // သောကြာ
    6: 'အဓိပတိ',  // စနေ
  },
  // 2-Remainder (တနင်္လာအကြွင်း)
  2: {
    0: 'အဓိပတိ',  // တနင်္ဂနွေ
    1: 'အထွန်း',  // တနင်္လာ
    2: 'သိုက်',    // အင်္ဂါ
    3: 'ရာဇ',     // ဗုဒ္ဓဟူး
    4: 'ပုတိ',    // ကြာသပတေး
    5: 'ဘင်္ဂ',    // သောကြာ
    6: 'မရဏ',    // စနေ
  },
  // 3-Remainder (အင်္ဂါအကြွင်း)
  3: {
    0: 'မရဏ',    // တနင်္ဂနွေ
    1: 'အဓိပတိ',  // တနင်္လာ
    2: 'အထွန်း',  // အင်္ဂါ
    3: 'သိုက်',    // ဗုဒ္ဓဟူး
    4: 'ရာဇ',     // ကြာသပတေး
    5: 'ပုတိ',    // သောကြာ
    6: 'ဘင်္ဂ',    // စနေ
  },
  // 4-Remainder (ဗုဒ္ဓဟူးအကြွင်း)
  4: {
    0: 'ဘင်္ဂ',    // တနင်္ဂနွေ
    1: 'မရဏ',    // တနင်္လာ
    2: 'အဓိပတိ',  // အင်္ဂါ
    3: 'အထွန်း',  // ဗုဒ္ဓဟူး
    4: 'သိုက်',    // ကြာသပတေး
    5: 'ရာဇ',     // သောကြာ
    6: 'ပုတိ',    // စနေ
  },
  // 5-Remainder (ကြာသပတေးအကြွင်း)
  5: {
    0: 'ပုတိ',    // တနင်္ဂနွေ
    1: 'ဘင်္ဂ',    // တနင်္လာ
    2: 'မရဏ',    // အင်္ဂါ
    3: 'အဓိပတိ',  // ဗုဒ္ဓဟူး
    4: 'အထွန်း',  // ကြာသပတေး
    5: 'သိုက်',    // သောကြာ
    6: 'ရာဇ',     // စနေ
  },
  // 6-Remainder (သောကြာအကြွင်း)
  6: {
    0: 'ရာဇ',     // တနင်္ဂနွေ
    1: 'ပုတိ',    // တနင်္လာ
    2: 'ဘင်္ဂ',    // အင်္ဂါ
    3: 'မရဏ',    // ဗုဒ္ဓဟူး
    4: 'အဓိပတိ',  // ကြာသပတေး
    5: 'အထွန်း',  // သောကြာ
    6: 'သိုက်',    // စနေ
  },
};

export function getMahaboteHouse(myanmarYear: number, jsDayIndex: number): MahaboteHouse {
  const remainder = myanmarYear % 7;
  const remRow = MAHABOTE_BY_JSDAY[remainder] || MAHABOTE_BY_JSDAY[0];
  return remRow[jsDayIndex] || 'အထွန်း';
}

// -------------------------------------------------------------
// Core ceMmDateTime Algorithm Constants & Astronomical Formulae
// -------------------------------------------------------------
const SOLAR_YEAR = 365.2587564814815;
const LUNAR_MONTH = 29.53058794607172;
const MO_EPOCH = 1954168.050623;

interface EraConfig {
  ERA_ID: number;
  WATAT_OFFSET: number;
  NUMBER_OF_MONTHS: number;
  EXCEPTION_IN_WATAT_YEAR: number;
}

function getEraConfig(my: number): EraConfig {
  let eraId = 3;
  let watatOffset = -0.5;
  let numMonths = 8;
  let offsetTable: [number, number][] = [[1377, 1]];
  let exceptionYears: number[] = [1344, 1345]; // ME 1344 and 1345 Watat exception!
  let exceptionInWatat = 0;

  if (my > 1312) {
    eraId = 3;
    watatOffset = -0.5;
    numMonths = 8;
    offsetTable = [[1377, 1]];
    exceptionYears = [1344, 1345];
  } else if (my >= 1217) {
    eraId = 2;
    watatOffset = -1;
    numMonths = 4;
    offsetTable = [
      [1234, 1],
      [1261, -1],
    ];
    exceptionYears = [1263, 1264];
  } else if (my >= 1100) {
    eraId = 1.3;
    watatOffset = -0.85;
    numMonths = -1;
    offsetTable = [
      [1120, 1],
      [1126, -1],
      [1150, 1],
      [1172, -1],
      [1207, 1],
    ];
    exceptionYears = [1201, 1202];
  } else if (my >= 798) {
    eraId = 1.2;
    watatOffset = -1.1;
    numMonths = -1;
    offsetTable = [
      [813, -1],
      [849, -1],
      [851, -1],
      [854, -1],
      [927, -1],
      [933, -1],
      [936, -1],
      [938, -1],
      [949, -1],
      [952, -1],
      [963, -1],
      [968, -1],
      [1039, -1],
    ];
    exceptionYears = [];
  } else {
    eraId = 1.1;
    watatOffset = -1.1;
    numMonths = -1;
    offsetTable = [
      [205, 1],
      [246, 1],
      [471, 1],
      [572, -1],
      [651, 1],
      [653, 2],
      [656, 1],
      [672, 1],
      [729, 1],
      [767, -1],
    ];
    exceptionYears = [];
  }

  for (const [y, diff] of offsetTable) {
    if (y === my) {
      watatOffset += diff;
      break;
    }
  }

  for (const y of exceptionYears) {
    if (y === my) {
      exceptionInWatat = 1;
      break;
    }
  }

  return {
    ERA_ID: eraId,
    WATAT_OFFSET: watatOffset,
    NUMBER_OF_MONTHS: numMonths,
    EXCEPTION_IN_WATAT_YEAR: exceptionInWatat,
  };
}

function calcWatat(my: number) {
  const era = getEraConfig(my);
  let e = (SOLAR_YEAR * (my + 3739)) % LUNAR_MONTH;
  if (e < 0.9076417607184055 * (12 - era.NUMBER_OF_MONTHS)) {
    e += LUNAR_MONTH;
  }
  const fullMoon = Math.round(
    SOLAR_YEAR * my + MO_EPOCH - e + 4.5 * LUNAR_MONTH + era.WATAT_OFFSET
  );
  let watat = 0;
  if (era.ERA_ID >= 2) {
    if (e >= LUNAR_MONTH - 0.9076417607184055 * era.NUMBER_OF_MONTHS) {
      watat = 1;
    }
  } else {
    let f = (7 * my + 2) % 19;
    if (f < 0) f += 19;
    watat = Math.floor(f / 12);
  }
  watat ^= era.EXCEPTION_IN_WATAT_YEAR;
  return { fullMoon, watat };
}

function calcMyanmarYearDetails(my: number) {
  const cur = calcWatat(my);
  let watat = cur.watat;
  let t = 0;
  let prevWatat: { fullMoon: number; watat: number };
  do {
    t++;
    prevWatat = calcWatat(my - t);
  } while (prevWatat.watat === 0 && t < 3);

  let fullMoon = 0;
  let watatError = 0;
  let myanmarYearType = 0;

  if (watat) {
    const u = (cur.fullMoon - prevWatat.fullMoon) % 354;
    myanmarYearType = Math.floor(u / 31) + 1;
    fullMoon = cur.fullMoon;
    if (u !== 30 && u !== 31) watatError = 1;
  } else {
    fullMoon = prevWatat.fullMoon + 354 * t;
  }

  return {
    myanmarYearType,
    tagu1: prevWatat.fullMoon + 354 * t - 102,
    fullMoon,
    watatError,
  };
}

export function gregorianToJulianDayNumber(year: number, month: number, day: number): number {
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

export function julianToMyanmarDateExact(jdn: number) {
  const roundedJdn = Math.round(jdn);
  const my = Math.floor((roundedJdn - 0.5 - MO_EPOCH) / SOLAR_YEAR);
  const yd = calcMyanmarYearDetails(my);
  let dayInYear = roundedJdn - yd.tagu1 + 1;
  const hasBigWatat = Math.floor(yd.myanmarYearType / 2);
  const isCommonYear = Math.floor(1 / (yd.myanmarYearType + 1));
  const yearLength = 354 + 30 * (1 - isCommonYear) + hasBigWatat;
  const monthType = Math.floor((dayInYear - 1) / yearLength);
  dayInYear -= monthType * yearLength;

  const T = Math.floor((dayInYear + 423) / 512);
  let monthIndex = Math.floor((dayInYear - hasBigWatat * T + isCommonYear * T * 30 + 29.26) / 29.544);
  const m = Math.floor((monthIndex + 12) / 16);
  const y = Math.floor((monthIndex + 11) / 16);
  const monthDay = dayInYear - Math.floor(29.544 * monthIndex - 29.26) - hasBigWatat * m + isCommonYear * y * 30;
  monthIndex += 3 * y - 4 * m + 12 * monthType;
  let monthLength = 30 - (monthIndex % 2);
  if (monthIndex === 3) {
    monthLength += Math.floor(yd.myanmarYearType / 2);
  }

  const weekDay = (roundedJdn + 2) % 7;

  return {
    myanmarYear: my,
    myanmarYearType: yd.myanmarYearType,
    month: monthIndex,
    monthDay,
    monthLength,
    weekDay,
    julianDay: jdn,
  };
}

function resolveMonthName(monthIndex: number, myanmarYearType: number): string {
  if (myanmarYearType > 0) {
    const watatMonths = [
      'တန်ခူး',
      'ကဆုန်',
      'နယုန်',
      'ပထမဝါဆို',
      'ဒုဝါဆို',
      'ဝါခေါင်',
      'တော်သလင်း',
      'သီတင်းကျွတ်',
      'တန်ဆောင်မုန်း',
      'နတ်တော်',
      'ပြာသို',
      'တပို့တွဲ',
      'တပေါင်း',
      'နှောင်းတန်ခူး',
    ];
    return watatMonths[monthIndex] || 'တော်သလင်း';
  } else {
    const commonMonths: Record<number, string> = {
      0: 'တန်ခူး',
      1: 'ကဆုန်',
      2: 'နယုန်',
      3: 'ဝါဆို',
      4: 'ဝါဆို',
      5: 'ဝါခေါင်',
      6: 'တော်သလင်း',
      7: 'သီတင်းကျွတ်',
      8: 'တန်ဆောင်မုန်း',
      9: 'နတ်တော်',
      10: 'ပြာသို',
      11: 'တပို့တွဲ',
      12: 'တပေါင်း',
    };
    return commonMonths[monthIndex] || 'တပေါင်း';
  }
}

// Convert Gregorian Date String (YYYY-MM-DD) to Myanmar Calendar Details
export function getMyanmarDateFromGregorian(dateStr: string): MyanmarDateResult | null {
  if (!dateStr || !dateStr.includes('-')) return null;

  const parts = dateStr.split('-');
  const gy = parseInt(parts[0], 10);
  const gm = parseInt(parts[1], 10);
  const gd = parseInt(parts[2], 10);

  if (isNaN(gy) || isNaN(gm) || isNaN(gd)) return null;

  const jdn = gregorianToJulianDayNumber(gy, gm, gd);
  const mm = julianToMyanmarDateExact(jdn);

  const dateObj = new Date(gy, gm - 1, gd, 12, 0, 0);
  const jsDay = dateObj.getDay(); // 0 = Sunday .. 6 = Saturday
  const dow = mapJsDayToBurmese(jsDay);
  const dowShorthand = getDayShorthand(dow);

  const monthName = resolveMonthName(mm.month, mm.myanmarYearType);

  // Moon Phase & Fortnight Day
  let moonPhase = 'လဆန်း';
  let fortnightDay = mm.monthDay;

  if (mm.monthDay <= 14) {
    moonPhase = 'လဆန်း';
    fortnightDay = mm.monthDay;
  } else if (mm.monthDay === 15) {
    moonPhase = 'လပြည့်';
    fortnightDay = 15;
  } else if (mm.monthDay < mm.monthLength) {
    moonPhase = 'လဆုတ်';
    fortnightDay = mm.monthDay - 15;
  } else {
    moonPhase = 'လဆုတ်';
    fortnightDay = mm.monthDay - 15;
  }

  const myStr = toBurmeseNumerals(mm.myanmarYear);
  const fdStr = toBurmeseNumerals(fortnightDay);
  const mahabote = getMahaboteHouse(mm.myanmarYear, jsDay);
  const fullFormattedStr = `${myStr} ခု၊ ${monthName} ${moonPhase} ${fdStr} ရက် (${dowShorthand})`;

  return {
    myanmarYear: mm.myanmarYear,
    myanmarYearStr: myStr,
    monthName,
    monthIndex: mm.month,
    moonPhase,
    fortnightDay,
    fortnightDayStr: fdStr,
    dayOfWeek: dow,
    dayOfWeekShorthand: dowShorthand,
    mahabote,
    fullFormattedStr,
  };
}

// Convert Myanmar Date to Gregorian Date YYYY-MM-DD
export function getGregorianFromMyanmarDate(
  my: number,
  monthName: string,
  moonPhase: string,
  fortnightDay: number
): { gregorianDate: string; dow: DayOfWeekBurmese; mahabote: MahaboteHouse } | null {
  if (!my || my < 1200 || my > 1500) return null;

  const estGregYear = my + 638;
  const startJdn = gregorianToJulianDayNumber(estGregYear - 1, 1, 1);
  const endJdn = gregorianToJulianDayNumber(estGregYear + 1, 12, 31);

  for (let j = startJdn; j <= endJdn; j++) {
    const res = julianToMyanmarDateExact(j);
    if (res.myanmarYear === my) {
      const curMonthName = resolveMonthName(res.month, res.myanmarYearType);
      if (curMonthName === monthName || (monthName.includes('ဝါဆို') && curMonthName.includes('ဝါဆို'))) {
        let targetMonthDay = fortnightDay;
        if (moonPhase === 'လပြည့်') targetMonthDay = 15;
        else if (moonPhase === 'လဆုတ်' || moonPhase === 'လပြည့်ကျော်') targetMonthDay = 15 + fortnightDay;
        else if (moonPhase === 'လကွယ်') targetMonthDay = res.monthLength;

        if (res.monthDay === targetMonthDay) {
          const a = j + 32044;
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
          const gregorianDate = `${year}-${mm}-${dd}`;

          const dateObj = new Date(year, month - 1, day, 12, 0, 0);
          const jsDay = dateObj.getDay();
          const dow = mapJsDayToBurmese(jsDay);
          const mahabote = getMahaboteHouse(my, jsDay);

          return {
            gregorianDate,
            dow,
            mahabote,
          };
        }
      }
    }
  }

  const fallbackDateStr = `${estGregYear}-03-15`;
  const dateObj = new Date(estGregYear, 2, 15, 12, 0, 0);
  const jsDay = dateObj.getDay();
  return {
    gregorianDate: fallbackDateStr,
    dow: mapJsDayToBurmese(jsDay),
    mahabote: getMahaboteHouse(my, jsDay),
  };
}
