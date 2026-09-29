export type DayOfWeekBurmese = 
  | 'တနင်္ဂနွေ' 
  | 'တနင်္လာ' 
  | 'အင်္ဂါ' 
  | 'ဗုဒ္ဓဟူး' 
  | 'ရာဟု' 
  | 'ကြာသပတေး' 
  | 'သောကြာ' 
  | 'စနေ';

export type MahaboteHouse = 
  | 'ဘင်္ဂ' 
  | 'မရဏ' 
  | 'အထွန်း' 
  | 'သိုက်' 
  | 'ရာဇ' 
  | 'ပုတိ' 
  | 'အဓိပတိ';

export type NavawinCountType = 
  | 'none'      // မပါ
  | '1_time'    // ၁ ကြိမ်စာ
  | '2_times'   // ၂ ကြိမ်စာ
  | '3_times'   // ၃ ကြိမ်စာ
  | 'special';  // အထူးနဝင်းယတြာ

export type ServiceCategory = 
  | 'general_reading'      // အထွေထွေ ဗေဒင်ဟောစာတမ်း
  | 'detailed_horoscope'  // ဇာတာဖွဲ့/လက်ခဏာစစ်
  | 'navawin_ritual'      // နဝင်းယတြာအစီအရင်
  | 'name_naming'         // အမည်ပေး မင်္ဂလာ
  | 'marriage_match'      // အိမ်ထောင်ဖက် ဓာတ်စစ်
  | 'business_prosperity' // စီးပွားလာဘ်ရွှင် ယတြာ
  | 'health_protection';  // ကျန်းမာရေး/အန္တရာယ်ကင်း

export type ConsultationStatus = 
  | 'scheduled'      // ရက်ချိန်းစောင့်
  | 'yatra_ongoing'  // ယတြာလုပ်ဆဲ
  | 'completed'      // ပြီးစီး (Task Done)
  | 'cancelled';     // ပယ်ဖျက်

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface PurchasedAmulet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface ConsultationRecord {
  id: string;                  // ဗေဒင်မေးသူ ID (e.g. BD-001) - Auto generated with edit option
  customerName: string;        // အမည်
  phone: string;               // ဖုန်းနံပါတ်
  gender?: 'male' | 'female' | 'other';
  birthDayOfWeek: DayOfWeekBurmese; // နေ့နံ
  birthDate?: string;          // မွေးသက္ကရာဇ် (YYYY-MM-DD or မြန်မာနှစ်)
  birthTime?: string;          // မွေးဖွားချိန် (e.g. မနက် ၉:၃၀)
  age?: number;                // အသက်
  mahabote?: MahaboteHouse;    // မဟာဘုတ်ခွင်
  
  bookingDate: string;         // ဘိုကင်တင်သည့်နေ့ (YYYY-MM-DD)
  readingDateTime: string;     // ဟောမည့်နေ့နှင့် အချိန် (YYYY-MM-DDTHH:mm)
  
  serviceCategory: ServiceCategory; // ဗေဒင်ဝန်ဆောင်မှု အမျိုးအစား
  serviceFee: number;          // ဗေဒင်ဟောခ (ကျပ်)
  
  // Custom Yatra System (ယတြာ လုပ်ဆောင်မည် / Dropdown / စိတ်ကြိုက်ယတြာ)
  yatraEnabled?: boolean;      // ယတြာ လုပ်ဆောင်မည် ဟုတ်/မဟုတ်
  yatraType?: string;          // ရွေးချယ်ထားသော ယတြာ Key (e.g. navawin_3, custom_yatra)
  yatraName?: string;          // ယတြာ အမည် (ရွေးချယ်ထားသော အမည် သို့မဟုတ် စိတ်ကြိုက်အမည်)
  yatraFee?: number;           // ယတြာ စရိတ်/အလှူငွေ (ကျပ်)

  // Navawin legacy fields (kept for backward-compatibility)
  navawinType: NavawinCountType; 
  navawinFee: number;          
  
  amulets: PurchasedAmulet[];  // အဆောင် ဝယ်ယူမှုများ (စိတ်ကြိုက်အမည် + စိတ်ကြိုက်ဈေးနှုန်း)
  amuletsTotal: number;        // အဆောင် စုစုပေါင်းငွေ
  
  totalAmount: number;         // စုစုပေါင်း ကျသင့်ငွေ (serviceFee + (yatraFee || navawinFee) + amuletsTotal)
  paidAmount: number;          // ရှင်းပြီးငွေ
  paymentStatus: PaymentStatus;// ငွေပေးချေမှု အခြေအနေ
  paymentMethod: 'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'; // ငွေပေးချေသည့် နည်းလမ်း
  
  status: ConsultationStatus;  // အခြေအနေ
  taskDone: boolean;           // Task Done အမှန်ခြစ်
  
  predictions: string;         // ပေးလိုက်သော ဟောချက်များ
  yatraInstructions: string;   // ယတြာနှင့် ညွှန်ကြားချက်များ
  notes: string;               // အထွေထွေ မှတ်ချက်
  
  recordedBy?: string;         // သွင်းသည့် စက်/တာဝန်ခံ (e.g. ကောင်တာ ၁, ဆရာ့အခန်း)
  updatedBy?: string;          // နောက်ဆုံး ပြင်ဆင်သည့် စက်/တာဝန်ခံ
  deviceId?: string;           // စက် ခွဲခြားသတ်မှတ်မှုကုဒ်
  version?: number;            // Concurrency tracking version counter

  createdAt: string;
  updatedAt: string;
}

export interface AmuletCatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description?: string;
  suggestedDay?: DayOfWeekBurmese | 'အားလုံး';
}

export type ExpenseCategory = 
  | 'yatra_materials'    // ယတြာပစ္စည်း ဝယ်ယူမှု
  | 'flower_candles'     // ပန်း၊ ဆီမီး၊ အမွှေးတိုင်
  | 'offering_pwe'       // ကန်တော့ပွဲ စရိတ်
  | 'office_utilities'   // ရုံးသုံး/မီး/ရေ/အင်တာနက်
  | 'assistant_fee'      // လက်ထောက်/စာရေးစရိတ်
  | 'other';             // အထွေထွေ စရိတ်

export interface ExpenseRecord {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string;
  receiptNumber?: string;
  recordedBy?: string;
  createdAt: string;
}

export interface CustomerSummary {
  name: string;
  phone: string;
  visitCount: number;
  totalSpent: number;
  navawinTotalCount: number;
  lastVisitDate: string;
  isRoyal: boolean; // ၃ ကြိမ်နှင့်အထက်
  loyaltyTier: 'ရွှေတံဆိပ် (Royal VIP)' | 'ငွေတံဆိပ် (Regular VIP)' | 'ဧည့်သည်သစ် (Standard)';
  records: ConsultationRecord[];
}
