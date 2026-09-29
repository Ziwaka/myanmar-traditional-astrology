import { AmuletCatalogItem, ConsultationRecord, ExpenseRecord } from '../types';

export const DEFAULT_AMULETS_CATALOG: AmuletCatalogItem[] = [
  {
    id: 'amulet-1',
    name: 'နဝရတ် ၉ ပါး စီခြယ် မင်္ဂလာလက်စွပ်',
    category: 'ကျောက်မျက်လက်ဝတ်',
    price: 65000,
    inStock: true,
    description: 'နဝရတ်ကိုးပါးဓာတ်ဆင်ထားပြီး ဘေးအန္တရာယ်ကင်း၍ လာဘ်ရွှင်စေသော မင်္ဂလာလက်စွပ်',
    suggestedDay: 'အားလုံး'
  },
  {
    id: 'amulet-2',
    name: 'ရွှေငွေလာဘ်မိုးရွာ မဟာလာဘံ အင်းပြားတော်',
    category: 'အင်း/အစီအရင်',
    price: 25000,
    inStock: true,
    description: 'ဆိုင်ခန်းနှင့် လုပ်ငန်းခွင်တွင် ကပ်လှူထားရှိရသော ရွှေသွန်းအင်းပြား',
    suggestedDay: 'ကြာသပတေး'
  },
  {
    id: 'amulet-3',
    name: 'ရှင်ဥပဂုတ် ရဟန္တာ မဟာကြေးရုပ်ပွားတော်',
    category: 'ရုပ်ပွားတော်',
    price: 38000,
    inStock: true,
    description: 'ရေကန်ထဲတွင် ပူဇော်ရသော မာရ်နတ်မင်းဘေးကင်း လာဘ်ရွှင်ဆုတောင်း အဆောင်',
    suggestedDay: 'ဗုဒ္ဓဟူး'
  },
  {
    id: 'amulet-4',
    name: 'နဝင်းစီး မဟာအမွှေးတိုင် (၉ ရက်စာ ထုပ်)',
    category: 'ယတြာပစ္စည်း',
    price: 12000,
    inStock: true,
    description: 'နဝင်းလှည့်ရာတွင် ဘုရားပူဇော်ရန် အထူးမွှေးကြိုင်သော စန္ဒကူးအမွှေးတိုင် ၉ ထုပ်',
    suggestedDay: 'အားလုံး'
  },
  {
    id: 'amulet-5',
    name: 'သပြေညွန့် + ရွှေသင်္ကန်း ကပ်လှူပွဲစုံ',
    category: 'ကန်တော့ပွဲ',
    price: 15000,
    inStock: true,
    description: 'နေ့နံအလိုက် ဘုရားထောင့်တွင် ကပ်လှူရန် အောင်သပြေနှင့် သင်္ကန်းစုံ',
    suggestedDay: 'တနင်္လာ'
  },
  {
    id: 'amulet-6',
    name: 'မဟာဂန္ဓာရီ ဂြိုဟ်ပြေ ပရိတ်လက်ဖွဲ့ကြိုး',
    category: 'ပရိတ်ကြိုး/လက်ဖွဲ့',
    price: 8000,
    inStock: true,
    description: 'ဆရာတော်ကြီးများ မေတ္တာပို့ အဓိဋ္ဌာန်တင်ထားသော မင်္ဂလာပရိတ်ချည်ကြိုး',
    suggestedDay: 'အင်္ဂါ'
  },
  {
    id: 'amulet-7',
    name: 'စနေဂြိုဟ်ပြေ နဂါးပတ် ကျောက်နီ လက်စွပ်',
    category: 'ကျောက်မျက်လက်ဝတ်',
    price: 45000,
    inStock: true,
    description: 'စနေနံဆိုး ဒဏ်ခံနေရသူများ အဆင်ပြေစေရန် ဓာတ်စီးလက်စွပ်',
    suggestedDay: 'စနေ'
  },
  {
    id: 'amulet-8',
    name: 'ရာဟုအညံ့ပြေ ဆီမီး ၈ တိုင် မီးပူဇော်ပွဲအစုံ',
    category: 'ယတြာပစ္စည်း',
    price: 10000,
    inStock: true,
    description: 'ဗုဒ္ဓဟူး ညနေ ရာဟုထောင့်တွင် ဆီမီး ၈ တိုင် ထွန်းညှိပူဇော်ရန်',
    suggestedDay: 'ရာဟု'
  }
];

// Clean state - Zero demo data as requested by user
export const INITIAL_CONSULTATION_RECORDS: ConsultationRecord[] = [];
export const INITIAL_EXPENSES: ExpenseRecord[] = [];
