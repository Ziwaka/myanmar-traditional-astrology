import React, { useState } from 'react';
import { 
  BookOpen, 
  CalendarDays, 
  TrendingUp, 
  Crown, 
  Wallet, 
  Flame, 
  ShoppingBag, 
  ShieldCheck, 
  Activity, 
  Database, 
  CheckCircle, 
  HelpCircle,
  FileText,
  UserCheck,
  Smartphone,
  Cloud,
  ChevronRight,
  Info
} from 'lucide-react';

export const SystemGuideView: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string>('intro');

  const topics = [
    {
      id: 'intro',
      title: 'စတင်အသုံးပြုခြင်း (Introduction)',
      icon: <Info className="w-4 h-4 text-amber-400" />,
      subtitle: 'စနစ်တစ်ခုလုံး၏ ရည်ရွယ်ချက်နှင့် စွမ်းဆောင်ရည်'
    },
    {
      id: 'pos',
      title: '၁။ ဗေဒင်မေးသူများ စာရင်းသွင်းပုံစံ & POS',
      icon: <CalendarDays className="w-4 h-4 text-emerald-400" />,
      subtitle: 'မေးသူအချက်အလက်၊ မဟာဘုတ်ခွင်၊ ဉာဏ်ပူဇော်ခ လက်ခံခြင်း'
    },
    {
      id: 'yatra',
      title: '၂။ ယတြာ စီမံခန့်ခွဲမှုစနစ် (Yatra System)',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      subtitle: 'ယတြာအကြိမ်ရေ၊ ကတ်တလောက်မှ အလိုအလျောက် ရွေးချယ်တွက်ချက်ခြင်း'
    },
    {
      id: 'amulet',
      title: '၃။ အဆောင်ပစ္စည်း POS အရောင်းစနစ်',
      icon: <ShoppingBag className="w-4 h-4 text-purple-400" />,
      subtitle: 'ပစ္စည်းအရေအတွက် တိုး/လျှော့နှင့် စတော့ထိန်းသိမ်းခြင်း'
    },
    {
      id: 'vip',
      title: '၄။ VIP ဖောက်သည်ကြီးများ (Royal VIP)',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      subtitle: 'သစ္စာရှိဖောက်သည်ကြီးများ ရှာဖွေစိစစ်ခြင်းနှင့် ဦးစားပေးရက်ချိန်းယူခြင်း'
    },
    {
      id: 'insights',
      title: '၅။ Data Insights Dashboard (Trend Lines)',
      icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
      subtitle: 'ဝင်ငွေ/ထွက်ငွေ ဇယားများ၊ ဖွံ့ဖြိုးတိုးတက်မှု Trend Lines'
    },
    {
      id: 'security',
      title: '၆။ အသုံးပြုသူအကောင့်များ & လုံခြုံရေး',
      icon: <ShieldCheck className="w-4 h-4 text-red-400" />,
      subtitle: 'Super Admin, Admin, Operator ဟု လုပ်ပိုင်ခွင့်အလိုက် ခွဲခြားခြင်း'
    },
    {
      id: 'sync',
      title: '၇။ Cloud Sync & Offline အော့ဖ်လိုင်းစနစ်',
      icon: <Cloud className="w-4 h-4 text-sky-400" />,
      subtitle: 'လိုင်းမရှိလည်းသုံးရပြီး အင်တာနက်မိပါက Cloud သို့ Auto-Sync စနစ်'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Upper Banner Section */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/30 rounded-3xl border border-amber-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              System Manual
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
              <span>စနစ်အသုံးပြုပုံ လမ်းညွှန်ချက်များနှင့် Features များ</span>
            </h2>
            <p className="text-xs text-stone-400 max-w-2xl">
              ဤဗေဒင်မှတ်တမ်းနှင့် POS စနစ်တစ်ခုလုံးတွင် မည်သည့်လုပ်ဆောင်ချက်များပါဝင်ပြီး မည်သို့စနစ်တကျ အသုံးပြုရမည်ကို ဤနေရာတွင် တစ်ဆင့်ချင်းစီ အသေးစိတ် ဖတ်ရှုလေ့လာနိုင်ပါသည်။
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Topic Navigator */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-stone-400 block px-2 uppercase tracking-widest">
            လမ်းညွှန်ချက် ခေါင်းစဉ်များ
          </span>
          <div className="space-y-1 bg-stone-950/60 p-2 rounded-2xl border border-stone-800">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between gap-2 border cursor-pointer ${
                  activeTopic === t.id
                    ? 'bg-amber-500/10 text-amber-200 border-amber-500/40 shadow-sm'
                    : 'bg-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTopic === t.id ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-900 text-stone-500'
                  }`}>
                    {t.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{t.title}</div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">{t.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition ${
                  activeTopic === t.id ? 'text-amber-400 translate-x-0.5' : 'text-stone-700'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Details Panel */}
        <div className="lg:col-span-8 bg-stone-950 p-5 sm:p-6 rounded-3xl border border-stone-800 shadow-xl space-y-6 min-h-[400px]">
          
          {/* TOPIC: Introduction */}
          {activeTopic === 'intro' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">Introduction</span>
                <h3 className="text-lg font-bold text-amber-200">စနစ်တစ်ခုလုံး၏ ရည်ရွယ်ချက်နှင့် စွမ်းဆောင်ရည်</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                ဤစနစ်သည် **မြန်မာ့ရိုးရာဗေဒင်ပညာရှင်များနှင့် ဟောခန်းလုပ်ငန်းများအတွက်** အထူးရည်ရွယ်ထုတ်လုပ်ထားသော သီးသန့် **ဗေဒင်မေးသူများ မှတ်တမ်းထိန်းသိမ်းခြင်း၊ ယတြာနှင့် အဆောင်ပစ္စည်းများ ရောင်းချခြင်း (POS)၊ ငွေစာရင်းတွက်ချက်ခြင်းနှင့် စီးပွားရေးခွဲခြမ်းစိတ်ဖြာခြင်း (Business Intelligence & Data Insights)** စနစ်ဖြစ်ပါသည်။
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400">🔥 Real-Time Database Sync</span>
                  <p className="text-[11px] text-stone-400">
                    ဖုန်းမျိုးစုံ၊ ကွန်ပျူတာမျိုးစုံမှ တပြိုင်နက်တည်းအသုံးပြုနိုင်ပြီး ဒေတာများအားလုံး Cloud ပေါ်တွင် Live တစ်ပြိုင်နက် Sync ညီမျှနေမည်ဖြစ်ပါသည်။
                  </p>
                </div>
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400">🔌 Zero Data Loss (Offline-First)</span>
                  <p className="text-[11px] text-stone-400">
                    အင်တာနက်လိုင်း လုံးဝမရှိချိန်၌လည်း မေးသူစာရင်းသွင်းခြင်း၊ ပြင်ဆင်ခြင်းများ ပုံမှန်အတိုင်း ပြုလုပ်နိုင်ပြီး လိုင်းပြန်ရပါက အလိုအလျောက် Cloud သို့ တင်ပေးမည်။
                  </p>
                </div>
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-purple-400">🛍️ Catalog & Dual POS System</span>
                  <p className="text-[11px] text-stone-400">
                    ယတြာအလှူငွေများနှင့် အဆောင်ပစ္စည်းများအား သီးခြား ကတ်တလောက်များဖြင့် စနစ်တကျ POS စနစ်သုံး အရောင်းမှတ်တမ်းတင်နိုင်ပါသည်။
                  </p>
                </div>
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-cyan-400">🛡️ Role-Based Access Security</span>
                  <p className="text-[11px] text-stone-400">
                    ပိုင်ရှင်၊ မန်နေဂျာနှင့် အရောင်းဝန်ထမ်း ဟူ၍ လုပ်ပိုင်ခွင့်များအား အဆင့်အတန်းအလိုက် တိကျစွာ ခွဲခြားသတ်မှတ်ထားပါသည်။
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-xs text-stone-300 leading-relaxed space-y-1.5">
                <span className="font-bold text-amber-300 block">💡 အမြန်သိကောင်းစရာ:</span>
                စနစ်အတွင်းသို့ ဝင်ရောက်ရာတွင် သက်ဆိုင်ရာ ဝန်ထမ်းအကောင့်အသီးသီး၏ Username ဖြင့် လွယ်ကူစွာ ဝင်ရောက်နိုင်ပြီး ဒေတာများ ဆုံးရှုံးမှုမရှိစေရန် Cloud Backup အား စက္ကန့်တိုင်း နောက်ကွယ်မှ ပြုလုပ်ပေးနေပါသည်။
              </div>
            </div>
          )}

          {/* TOPIC: POS Form */}
          {activeTopic === 'pos' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">Feature 1</span>
                <h3 className="text-lg font-bold text-emerald-200">၁။ ဗေဒင်မေးသူများ စာရင်းသွင်းပုံစံ & POS</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                ဖောက်သည်တစ်ဦး ရောက်ရှိလာပါက သို့မဟုတ် အွန်လိုင်းမှ ဆက်သွယ်လာပါက ၎င်း၏ အချက်အလက်များအားလုံးကို ဤနေရာတွင် လျင်မြန်တိကျစွာ စာရင်းသွင်းနိုင်ပါသည်။
              </p>

              <div className="space-y-3.5">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">၁</div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-200">အခြေခံအချက်အလက် ဖြည့်သွင်းခြင်း:</span>
                    <p className="text-stone-400">
                      အမည်၊ လူကိုယ်တိုင် လာမေးသလား (In Person) သို့မဟုတ် အဝေးမှမေးသလား (Remote - Messenger / Viber) ဟု ခွဲခြားမှတ်တမ်းတင်နိုင်ပါသည်။
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">၂</div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-200">မွေးသက္ကရာဇ်နှင့် အလိုအလျောက် မဟာဘုတ်ခွင်:</span>
                    <p className="text-stone-400">
                      မွေးနေ့သက္ကရာဇ် (မြန်မာ/အင်္ဂလိပ်) ထည့်သွင်းလိုက်သည်နှင့် စနစ်မှ ၎င်း၏ မွေးနေ့အင်္ဂါ၊ အသက်နှင့် **မဟာဘုတ်ဖွားဇာတာခွင် (ဥပမာ - အဓိပတိ၊ အထွန်း၊ သိုက် စသည်)** အား Auto တွက်ချက်ဖော်ပြပေးမည်။
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">၃</div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-200">ဉာဏ်ပူဇော်ခ အလွယ်ရွေးခြင်း:</span>
                    <p className="text-stone-400">
                      ပုံသေ ဗေဒင်ဟောစာတမ်းအတွက် ဟောခများကို **`[၃၀,၀၀၀ ကျပ်]`** နှင့် **`[၅၀,၀၀၀ ကျပ်]`** တက်ဘ်ခလုတ်များဖြင့် တစ်ချက်တည်း နှိပ်ရုံဖြင့် အလိုအလျောက် ဖြည့်သွင်းနိုင်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 text-xs">
                <span className="font-bold text-emerald-400 block mb-1">💡 အကြံပြုချက်:</span>
                မေးသူစာရင်းသွင်းပြီးပါက ဟောကိန်းများ (Predictions) နှင့် ယတြာညွှန်ကြားချက်များအား ဟောခန်းပြီးချိန်တွင် တိုက်ရိုက် ရိုက်ထည့်သိမ်းဆည်းနိုင်ပြီး၊ ဘောက်ချာအား **PDF / Print ထုတ်ယူပြီး** ဖောက်သည်ထံသို့ ပေးပို့နိုင်ပါသည်။
              </div>
            </div>
          )}

          {/* TOPIC: Yatra Rituals */}
          {activeTopic === 'yatra' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">Feature 2</span>
                <h3 className="text-lg font-bold text-amber-200">၂။ ယတြာ စီမံခန့်ခွဲမှုစနစ် (Yatra System)</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                ဗေဒင်မေးသူအတွက် ယတြာအစီအရင်များ ပြုလုပ်ပေးရန်လိုအပ်ပါက ယတြာသီးသန့် ကတ်တလောက်နှင့် ချိတ်ဆက်ကာ အလွန်လွယ်ကူလျင်မြန်စွာ ဖြည့်သွင်းတွက်ချက်နိုင်ပါသည်။
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 flex items-start gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-200">၁-Click ကတ်တလောက်ချိတ်ဆက်မှု:</span>
                    <p className="text-stone-400">
                      ယတြာ ကတ်တလောက် (Yatra Catalog) ထဲရှိ အဆင်သင့်ယတြာများ (ဥပမာ - နဝင်းယတြာ၊ စီးပွားလာဘ်ရွှင်ယတြာ) ကို ကလစ်တစ်ချက်နှိပ်ရုံဖြင့် Entry Form ထဲသို့ အလိုအလျောက် ဖြည့်သွင်းပေးသည်။
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-200">အကြိမ်အရေအတွက် (Multiplier):</span>
                    <p className="text-stone-400">
                      ယတြာအား ၁ ကြိမ်၊ ၂ ကြိမ်၊ ၃ ကြိမ်၊ ၅ ကြိမ် စသဖြင့် အကြိမ်ရေအလိုက် ရွေးချယ်နိုင်ပြီး **`၁ ကြိမ်နှုန်း × အကြိမ်ရေ`** ကို စနစ်မှ အလိုအလျောက် တွက်ချက်ပေးပါသည်။
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 text-xs">
                <span className="font-bold text-amber-400 block mb-1">⚠️ သတိပြုရန်:</span>
                ယတြာ ကတ်တလောက်ကို ဘေးဘားမီနူးရှိ **"ယတြာ ကတ်တလောက် (Yatra Catalog)"** နေရာတွင် သွားရောက်၍ မိမိတို့သတ်မှတ်လိုသော အမည်နှင့် default စရိတ်များကို အချိန်မရွေး ကြိုတင်ဖြည့်သွင်းပြင်ဆင်ထားနိုင်ပါသည်။
              </div>
            </div>
          )}

          {/* TOPIC: Amulets POS */}
          {activeTopic === 'amulet' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-purple-400 block uppercase">Feature 3</span>
                <h3 className="text-lg font-bold text-purple-200">၃။ အဆောင်ပစ္စည်း POS အရောင်းစနစ်</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                ဟောခန်းတွင် ရောင်းချသော အဆောင်ကျောက်မြတ်ရတနာများ၊ သိဒ္ဓိဝင်ပစ္စည်းများ၊ အဆောင်လက်ဖွဲ့များကို စာရင်းသွင်းချိန်၌ တပြိုင်နက်တည်း POS စနစ်ကဲ့သို့ ရောင်းချမှတ်တမ်းတင်နိုင်ပါသည်။
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-purple-300">🛍️ Catalog Quick Select:</span>
                  <p className="text-stone-400 leading-relaxed">
                    ကြိုတင်ထည့်သွင်းထားသော အဆောင်ပစ္စည်းစာရင်းမှ ပစ္စည်းများကို ကလစ်တစ်ချက်နှိပ်ရုံဖြင့် ဈေးနှုန်း၊ အမျိုးအစားအလိုက် ဝယ်ယူသူ၏ ဘောက်ချာထဲသို့ အလိုအလျောက် ထည့်သွင်းပေးသွားမည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-purple-300">🔢 အရေအတွက် တိုး/လျှော့စနစ် (+ / -):</span>
                  <p className="text-stone-400 leading-relaxed">
                    စာရင်းသွင်းပြီးသော ပစ္စည်းများ၏ အရေအတွက်ကို `[-]` နှင့် `[+]` ခလုတ်များဖြင့် တိုက်ရိုက် လျင်မြန်စွာ တိုး/လျှော့ ပြုလုပ်နိုင်ပြီး ဈေးနှုန်းစုစုပေါင်းကို အလိုအလျောက် သီချင်းတစ်ပုဒ်လို မြန်ဆန်စွာ တွက်ချက်ပေးပါသည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-purple-300">📦 Stock tracking (စတော့အခြေအနေ):</span>
                  <p className="text-stone-400 leading-relaxed">
                    အဆောင်ပစ္စည်း ကတ်တလောက်တွင် ပစ္စည်းတစ်ခုချင်းစီ၌ စတော့ရှိ/မရှိ (In Stock / Out of Stock) အား အလွယ်တကူ Switch ခလုတ်လေးဖြင့် ဖွင့်/ပိတ် ထိန်းချုပ်ထားနိုင်ပါသည်။
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC: Royal VIP */}
          {activeTopic === 'vip' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">Feature 4</span>
                <h3 className="text-lg font-bold text-amber-200">၄။ VIP ဖောက်သည်ကြီးများ (Royal VIP)</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                တစ်ကြိမ်ထက်မက ထပ်ခါတလဲလဲ လာရောက်မေးမြန်းကြသော **သစ္စာရှိဖောက်သည်ကြီးများအား** စနစ်မှ အလိုအလျောက် အဆင့်ခွဲခြားသတ်မှတ်ပေးပြီး အထူးဦးစားပေးလုပ်ဆောင်ပေးနိုင်သော စနစ်ဖြစ်ပါသည်။
              </p>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex gap-2.5 items-center p-2.5 bg-stone-900/60 rounded-xl border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-200">အကြိမ်ရေအလိုက် သတ်မှတ်ခြင်း:</span>
                    <span className="text-stone-400 ml-1">၂ ကြိမ်မေးဖူးသူအား <span className="text-cyan-400 font-bold">Regular</span>၊ ၃ ကြိမ်ထက်မက မေးဖူးသူအား <span className="text-amber-400 font-bold">Royal VIP ⭐</span> အဖြစ် အလိုအလျောက် သတ်မှတ်ပေးသည်။</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center p-2.5 bg-stone-900/60 rounded-xl border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-200">ဟောခန်းမှတ်တမ်းရာဇဝင် (Dossier):</span>
                    <span className="text-stone-400 ml-1">ဖောက်သည်ကြီး၏ အမည်ကို နှိပ်လိုက်သည်နှင့် ၎င်းမေးခဲ့ဖူးသော မွေးနေ့ဇာတာ၊ ဟောကိန်းဟောင်းများနှင့် ယခင်ယူခဲ့ဖူးသော အဆောင်ပစ္စည်း ရာဇဝင်အားလုံးကို တစ်စုတစ်စည်းတည်း မြင်တွေ့ရမည်။</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-center p-2.5 bg-stone-900/60 rounded-xl border border-stone-800">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-200">လျင်မြန်စွာ ရက်ချိန်းအသစ်ယူပေးခြင်း:</span>
                    <span className="text-stone-400 ml-1">ဖောက်သည်ကြီးများစာရင်းထဲမှ `[ရက်ချိန်းစောင့်]` ခလုတ်ကို နှိပ်ရုံဖြင့် ၎င်း၏ အမည်၊ ဂျန်ဒါနှင့် မွေးဇာတာတို့အား အလိုအလျောက် ဖြည့်ပြီးသား အဆင်သင့် စာရင်းသွင်းပေးမည်။</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC: Insights */}
          {activeTopic === 'insights' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-cyan-400 block uppercase">Feature 5</span>
                <h3 className="text-lg font-bold text-cyan-200">၅။ Data Insights Dashboard (Trend Lines)</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                စနစ်အတွင်းရှိ ဝင်ငွေ၊ ထွက်ငွေ၊ ဗေဒင်ဟောခ၊ ယတြာနှင့် အဆောင်ပစ္စည်းများမှ ရရှိသော အမြတ်အစွန်းများအားလုံးကို အချိန်ကာလအလိုက် စီးပွားရေးခွဲခြမ်းစိတ်ဖြာပြသပေးသော Dashboard ဖြစ်ပါသည်။
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-xs font-bold text-cyan-400">📊 Interactive Trend Lines</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    လအလိုက် ဝင်ငွေစီးဆင်းမှုနှုန်းနှင့် အသုံးစရိတ်များကို တစ်ချက်ကြည့်ရုံဖြင့် သိသာစေရန် လှပသော SVG Trend Line မြှားလိုင်းများဖြင့် ဆွဲပြပေးသည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-400">📈 Profitability Insights</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    စုစုပေါင်း ဝင်ငွေမှ စုစုပေါင်း အသုံးစရိတ်များကို နှုတ်၍ အသားတင် အမြတ်အစွန်း (Net Profit) ကို လအလိုက် တိကျစွာ ခွဲခြားပြသပေးသည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-xs font-bold text-purple-400">📦 Categories Breakdown</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    ဗေဒင်ဟောခ၊ ယတြာနှင့် အဆောင်ပစ္စည်း အရောင်းအဝယ်တို့မှ ရရှိသော ရာခိုင်နှုန်းခွဲဝေမှု (Revenue Share) ကို ပြသပေးသဖြင့် မည်သည့်ဝန်ဆောင်မှုက အဓိကဝင်ငွေကောင်းသည်ကို သိနိုင်ပါသည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-xs font-bold text-red-400">💸 Expense Tracker Analysis</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    လစာ၊ ကတ်တလောက်ဝယ်ယူစရိတ်၊ ဟောခန်းအလှူနှင့် အထွေထွေအသုံးစရိတ်များအနက် မည်သည့်နေရာတွင် အသုံးစရိတ်အများဆုံး ဖြစ်နေသည်ကို စိစစ်နိုင်ပါသည်။
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC: Security & Accounts */}
          {activeTopic === 'security' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-red-400 block uppercase">Feature 6</span>
                <h3 className="text-lg font-bold text-red-200">၆။ အသုံးပြုသူအကောင့်များ & လုပ်ပိုင်ခွင့်များ</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                လုံခြုံရေးသည် အလွန်အရေးကြီးသဖြင့် လုပ်ငန်းခွင်ရှိ ဝန်ထမ်းတစ်ဦးချင်းစီ၏ ကဏ္ဍအလိုက် လုပ်ဆောင်နိုင်စွမ်းများအား ကန့်သတ်ခွဲခြားထားရှိပါသည်။
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 bg-gradient-to-r from-stone-900 to-red-950/20 rounded-2xl border border-stone-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-stone-200">Super Admin (လုပ်ငန်းရှင် / ဆရာကြီး):</span>
                    <p className="text-stone-400">
                      စနစ်တစ်ခုလုံးရှိ ဒေတာများအားလုံးကို ဖျက်ခြင်း၊ ပြင်ခြင်း၊ ငွေစာရင်း အစီရင်ခံစာများကြည့်ခြင်း၊ ဝန်ထမ်းအကောင့်အသစ်များ တည်ဆောက်ခြင်းနှင့် အကောင့်များကို ပိတ်သိမ်းခြင်းတို့ ပြုလုပ်နိုင်ပါသည်။
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-900/60 rounded-2xl border border-stone-800 flex items-start gap-3">
                  <UserCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-stone-200">Admin (မန်နေဂျာ / စာရင်းကိုင်):</span>
                    <p className="text-stone-400">
                      ဗေဒင်မေးသူစာရင်းများသွင်းခြင်း၊ ငွေလက်ခံခြင်း၊ အသုံးစရိတ်များ ထည့်သွင်းခြင်း၊ ယတြာနှင့် အဆောင်ကတ်တလောက်များ စီမံခန့်ခွဲခြင်းတို့ ပြုလုပ်နိုင်သော်လည်း စနစ်ထဲရှိ အခြားအကောင့်များကို ဖျက်ဆီးခွင့်မရှိပါ။
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-900/60 rounded-2xl border border-stone-800 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-stone-200">Operator (အရောင်းစာရေး / လက်ထောက်):</span>
                    <p className="text-stone-400">
                      ဗေဒင်မေးသူများ စာရင်းသွင်းခြင်း၊ အဆောင်ပစ္စည်းအရောင်း POS စာရင်းသွင်းခြင်းတို့သာ ပြုလုပ်နိုင်ပြီး လစဉ်ရှင်းတမ်းငွေစာရင်းများနှင့် အသုံးစရိတ် စာရင်းများကို လုံးဝ (လုံးဝ) ကြည့်ရှုခွင့်မရှိပါ။
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC: Sync & Offline */}
          {activeTopic === 'sync' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-sky-400 block uppercase">Feature 7</span>
                <h3 className="text-lg font-bold text-sky-200">၇။ Cloud Sync & Offline အော့ဖ်လိုင်းစနစ်</h3>
              </div>
              
              <p className="text-xs text-stone-300 leading-relaxed">
                အင်တာနက်လိုင်းမကောင်းသော မြန်မာနိုင်ငံ၏ လက်ရှိအခြေအနေနှင့် အကိုက်ညီဆုံးဖြစ်စေရန် ဤစနစ်ကို **Offline-First & Auto Cloud Sync** စနစ်အဖြစ် တည်ဆောက်ထားပါသည်။
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-sky-300">📶 အော့ဖ်လိုင်းအသုံးပြုခြင်း (Offline Mode):</span>
                  <p className="text-stone-400 leading-relaxed">
                    အင်တာနက်လိုင်း ပိတ်ထားသော်လည်း ဒေတာများအားလုံးကို သင့်ဖုန်း၏ Storage ထဲတွင် လုံခြုံစွာ သိမ်းဆည်းထားပြီး ပုံမှန်အတိုင်း စာရင်းသွင်း/ဘောက်ချာထုတ်ခြင်းများ ပြုလုပ်နိုင်ပါသည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-sky-300">🔄 အလိုအလျောက် Cloud Sync (Auto-Sync):</span>
                  <p className="text-stone-400 leading-relaxed">
                    ဖုန်းတွင် အင်တာနက်လိုင်း ပြန်ရသည်နှင့်တစ်ပြိုင်နက် စနစ်သည် သင့်ဖုန်းထဲရှိ ဒေတာအသစ်များကို Firebase Cloud Firestore ပေါ်သို့ အလိုအလျောက် သီချင်းတစ်ပုဒ်လို လုံခြုံစွာ ပို့ဆောင်ပေးမည်ဖြစ်သည်။
                  </p>
                </div>

                <div className="p-3 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-1">
                  <span className="font-bold text-sky-300">📱 PWA အက်ပ်အဖြစ် ထည့်သွင်းခြင်း:</span>
                  <p className="text-stone-400 leading-relaxed">
                    ဤဝဘ်ဆိုက်အား Chrome သို့မဟုတ် Safari တွင်ဖွင့်ပြီး **"Add to Home Screen (အိမ်သုံးမျက်နှာပြင်သို့ ထည့်ရန်)"** ကို နှိပ်ခြင်းဖြင့် သင့်ဖုန်းထဲ၌ Software/App အစစ်တစ်ခုကဲ့သို့ လုံးဝ အင်တာနက်မလိုဘဲ အချိန်မရွေး ဖွင့်လှစ်အသုံးပြုနိုင်ပါသည်။
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
