import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Calculator, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard,
  Wifi,
  WifiOff,
  Flame,
  Tag,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { 
  AmuletCatalogItem, 
  ConsultationRecord, 
  DayOfWeekBurmese, 
  MahaboteHouse, 
  NavawinCountType, 
  PurchasedAmulet, 
  ServiceCategory 
} from '../types';
import { 
  BURMESE_DAYS, 
  calculateMahabote, 
  formatMMK, 
  getBurmeseDayFromDate, 
  MAHABOTE_HOUSES, 
  NAWAWIN_OPTIONS, 
  SERVICE_CATEGORIES
} from '../utils/astrology';

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ConsultationRecord) => void;
  initialData?: ConsultationRecord | null;
  amuletsCatalog: AmuletCatalogItem[];
  nextId: string;
}

export const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  amuletsCatalog,
  nextId,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const nowDateTimeStr = `${todayStr}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Network online status
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Form states - ID
  const [id, setId] = useState(initialData?.id || nextId);
  const [isCustomizingId, setIsCustomizingId] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'female');
  const [birthDayOfWeek, setBirthDayOfWeek] = useState<DayOfWeekBurmese>(initialData?.birthDayOfWeek || 'တနင်္ဂနွေ');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialData?.birthTime || '');
  const [age, setAge] = useState<number | undefined>(initialData?.age || undefined);
  const [mahabote, setMahabote] = useState<MahaboteHouse | undefined>(initialData?.mahabote || 'အထွန်း');

  // Booking & status
  const [bookingDate, setBookingDate] = useState(initialData?.bookingDate || todayStr);
  const [readingDateTime, setReadingDateTime] = useState(initialData?.readingDateTime || nowDateTimeStr);
  const [status, setStatus] = useState<'scheduled' | 'yatra_ongoing' | 'completed' | 'cancelled'>(initialData?.status || 'completed');
  const [taskDone, setTaskDone] = useState<boolean>(initialData?.taskDone || true);

  // Service Fee
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(initialData?.serviceCategory || 'general_reading');
  const [serviceFee, setServiceFee] = useState<number>(initialData?.serviceFee !== undefined ? initialData.serviceFee : 20000);

  // Yatra System
  const [yatraEnabled, setYatraEnabled] = useState<boolean>(
    initialData?.yatraEnabled !== undefined 
      ? initialData.yatraEnabled 
      : (initialData?.navawinType && initialData.navawinType !== 'none') || false
  );
  const [yatraType, setYatraType] = useState<string>(
    initialData?.yatraType || 
    (initialData?.navawinType === 'special' ? 'navawin_special' : initialData?.navawinType === '3_times' ? 'navawin_3' : 'navawin_3')
  );
  const [customYatraName, setCustomYatraName] = useState<string>(initialData?.yatraName || '');
  const [yatraFee, setYatraFee] = useState<number>(
    initialData?.yatraFee !== undefined 
      ? initialData.yatraFee 
      : (initialData?.navawinFee || 45000)
  );

  // Amulets (POS)
  const [amulets, setAmulets] = useState<PurchasedAmulet[]>(initialData?.amulets || []);

  // Custom Amulet Inputs
  const [customAmuletName, setCustomAmuletName] = useState('');
  const [customAmuletPrice, setCustomAmuletPrice] = useState<number | ''>(15000);
  const [customAmuletQty, setCustomAmuletQty] = useState<number>(1);
  const [showCustomAmuletForm, setShowCustomAmuletForm] = useState(false);

  // Payment
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>(initialData?.paymentStatus || 'paid');
  const [paidAmount, setPaidAmount] = useState<number>(initialData?.paidAmount || 20000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>(initialData?.paymentMethod || 'kpay');

  // Predictions & Notes
  const [predictions, setPredictions] = useState(initialData?.predictions || '');
  const [yatraInstructions, setYatraInstructions] = useState(initialData?.yatraInstructions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const amuletsTotal = amulets.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const currentYatraFee = yatraEnabled ? (Number(yatraFee) || 0) : 0;
  const totalAmount = (Number(serviceFee) || 0) + currentYatraFee + amuletsTotal;

  // Auto calculate birth day & mahabote when birthdate changes
  const handleBirthDateChange = (val: string) => {
    setBirthDate(val);
    if (val) {
      const calculatedDay = getBurmeseDayFromDate(val);
      setBirthDayOfWeek(calculatedDay);
      const calculatedMahabote = calculateMahabote(val, calculatedDay);
      setMahabote(calculatedMahabote);

      // Estimate age
      const bYear = new Date(val).getFullYear();
      const currentYear = new Date().getFullYear();
      if (bYear && currentYear >= bYear) {
        setAge(currentYear - bYear);
      }
    }
  };

  // Change Service Category and update fee default
  const handleServiceChange = (cat: ServiceCategory) => {
    setServiceCategory(cat);
    const found = SERVICE_CATEGORIES.find(s => s.key === cat);
    if (found) {
      setServiceFee(found.defaultFee);
    }
  };

  // Auto-adjust paid amount if full payment selected
  const handleSetPaidFull = () => {
    setPaymentStatus('paid');
    setPaidAmount(totalAmount);
  };

  // Add amulet from preset catalog
  const handleAddCatalogAmulet = (catalogItem: AmuletCatalogItem) => {
    const existingIndex = amulets.findIndex(a => a.id === catalogItem.id);
    if (existingIndex >= 0) {
      const updated = [...amulets];
      updated[existingIndex].quantity += 1;
      setAmulets(updated);
    } else {
      setAmulets([
        ...amulets,
        {
          id: catalogItem.id,
          name: catalogItem.name,
          category: catalogItem.category,
          price: catalogItem.price,
          quantity: 1,
        }
      ]);
    }
  };

  // Add Custom Amulet item with custom name and price
  const handleAddCustomAmulet = () => {
    if (!customAmuletName.trim()) {
      alert('အဆောင်ပစ္စည်း အမည် ထည့်သွင်းပေးပါ။');
      return;
    }
    const priceNum = Number(customAmuletPrice) || 0;
    const qtyNum = Math.max(1, Number(customAmuletQty) || 1);

    const newItem: PurchasedAmulet = {
      id: `custom-amulet-${Date.now()}`,
      name: customAmuletName.trim(),
      category: 'စိတ်ကြိုက်အဆောင်',
      price: priceNum,
      quantity: qtyNum,
    };

    setAmulets([...amulets, newItem]);
    setCustomAmuletName('');
    setCustomAmuletPrice(15000);
    setCustomAmuletQty(1);
    setShowCustomAmuletForm(false);
  };

  // Update amulet price or quantity in cart
  const handleUpdateAmuletItem = (index: number, updates: Partial<PurchasedAmulet>) => {
    const updated = [...amulets];
    updated[index] = { ...updated[index], ...updates };
    setAmulets(updated);
  };

  // Remove amulet
  const handleRemoveAmulet = (index: number) => {
    setAmulets(amulets.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('ကျေးဇူးပြု၍ ဗေဒင်မေးသူအမည် ထည့်သွင်းပေးပါ။');
      return;
    }

    // Determine final yatra name & legacy navawin mapping
    const finalYatraName = customYatraName.trim() || (yatraEnabled ? 'ယတြာ အစီအရင်' : '');
    const legacyNavawin: NavawinCountType = yatraEnabled ? '3_times' : 'none';

    const record: ConsultationRecord = {
      id: id || nextId,
      customerName: customerName.trim(),
      phone: phone.trim() || '09-',
      gender,
      birthDayOfWeek,
      birthDate,
      birthTime,
      age: age ? Number(age) : undefined,
      mahabote,
      bookingDate,
      readingDateTime,
      serviceCategory,
      serviceFee: Number(serviceFee) || 0,
      
      // Yatra system
      yatraEnabled,
      yatraType: yatraEnabled ? yatraType : undefined,
      yatraName: yatraEnabled ? finalYatraName : undefined,
      yatraFee: currentYatraFee,

      // Legacy Navawin
      navawinType: legacyNavawin,
      navawinFee: currentYatraFee,

      amulets,
      amuletsTotal,
      totalAmount,
      paidAmount: paymentStatus === 'paid' ? totalAmount : Number(paidAmount) || 0,
      paymentStatus,
      paymentMethod,
      status,
      taskDone: status === 'completed' ? true : taskDone,
      predictions: predictions.trim(),
      yatraInstructions: yatraInstructions.trim(),
      notes: notes.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/30 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header with Auto-ID & Live Online/Offline Status */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-950/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-amber-200">
                  {isEditing ? 'ဗေဒင်မှတ်တမ်း & POS ပြင်ဆင်ရန်' : 'ဗေဒင်မေးသူ အသစ်စာရင်းသွင်းခြင်း & POS'}
                </h2>
                
                {/* Live Online / Offline Status Badge */}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border ${
                  isOnline 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online (Cloud Sync)</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-400" />
                      <span>Offline (စက်တွင်းသိမ်းမည်)</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                မေးသူအချက်အလက်၊ စိတ်ကြိုက်ယတြာ၊ အဆောင်ဝယ်ယူမှု POS နှင့် ဟောချက်များ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Section 1: Customer Profile & Auto-Generated ID */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-3.5">
            
            {/* Auto ID Display & Customizer */}
            <div className="bg-stone-900/90 border border-amber-500/30 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-amber-300">
                  ဗေဒင်မေးသူ ID (အလိုအလျောက် ထွက်ရှိသည်):
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs sm:text-sm">
                  {id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isCustomizingId ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      placeholder="ID ပြင်ရန်..."
                      className="px-2.5 py-1 bg-stone-950 border border-amber-500/50 rounded-lg text-amber-300 font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomizingId(false)}
                      className="px-2 py-1 rounded bg-stone-800 text-stone-300 text-[11px]"
                    >
                      ပြီးပါပြီ
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustomizingId(true)}
                    className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>ID ပြင်လိုပါက နှိပ်ပါ</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <User className="w-4 h-4" />
              <span>၁။ ဗေဒင်မေးသူ ကိုယ်ရေးအချက်အလက်နှင့် မွေးဇာတာ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">ဗေဒင်မေးသူ အမည် *</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - ဒေါ်သန်းသန်းဆွေ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ဖုန်းနံပါတ် *</label>
                <input
                  type="text"
                  placeholder="09-xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ကျား / မ ရွေးချယ်မှု</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
                >
                  <option value="female">မ (Female)</option>
                  <option value="male">ကျား (Male)</option>
                  <option value="other">အခြား (Other)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">မွေးနေ့ရက်စွဲ</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">နေ့နံ (Day of Week)</label>
                <select
                  value={birthDayOfWeek}
                  onChange={(e) => setBirthDayOfWeek(e.target.value as DayOfWeekBurmese)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-medium focus:border-amber-500 cursor-pointer"
                >
                  {BURMESE_DAYS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label} ({d.animal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မွေးဖွားချိန် (Time)</label>
                <input
                  type="text"
                  placeholder="မနက် ၈:၁၅"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မဟာဘုတ်ခွင်</label>
                <select
                  value={mahabote || 'အထွန်း'}
                  onChange={(e) => setMahabote(e.target.value as MahaboteHouse)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
                >
                  {MAHABOTE_HOUSES.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label} ({m.meaning})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Booking, Schedule & Status */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <Calendar className="w-4 h-4" />
              <span>၂။ ဘိုကင်ရက်စွဲ၊ ဟောကြားမည့် အချိန်နှင့် လုပ်ငန်းစဉ်အခြေအနေ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">ဘိုကင်တင်သည့်နေ့</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ဗေဒင်ဟောမည့် နေ့နှင့်အချိန် *</label>
                <input
                  type="datetime-local"
                  value={readingDateTime}
                  onChange={(e) => setReadingDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">လုပ်ငန်းစဉ် အခြေအနေ (Status)</label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setStatus(newStatus);
                    setTaskDone(newStatus === 'completed');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-amber-500/40 text-stone-100 focus:border-amber-400 cursor-pointer font-medium"
                >
                  <option value="completed">✅ ဟောကြားပြီးစီး (Completed)</option>
                  <option value="yatra_ongoing">⏳ ယတြာလုပ်ဆဲ (Ongoing Yatra)</option>
                  <option value="scheduled">📅 ရက်ချိန်းစောင့် (Scheduled)</option>
                  <option value="cancelled">❌ ပယ်ဖျက် (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Consultation Services */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Calculator className="w-4 h-4" />
                <span>၃။ ဗေဒင်ဝန်ဆောင်မှု အမျိုးအစားနှင့် ဟောခ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-2">
                <label className="block text-stone-300 font-medium">ဗေဒင်ဝန်ဆောင်မှု အမျိုးအစား</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => handleServiceChange(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
                >
                  {SERVICE_CATEGORIES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} ({formatMMK(s.defaultFee)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-300 font-medium block">ဗေဒင်ဟောခ (ကျပ်)</span>
                  <span className="text-[10px] text-stone-500">စိတ်ကြိုက် ပြင်ဆင်နိုင်သည်</span>
                </div>
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-40 px-3 py-1.5 text-right rounded-xl bg-stone-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-base focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Purely Custom User-Defined Yatra */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-amber-500/30 space-y-3.5 bg-gradient-to-br from-stone-850 to-amber-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>၄။ ယတြာ ပြုလုပ်ဆောင်ရွက်မှု</span>
              </div>

              {/* Yatra Enable Toggle Button */}
              <label className="flex items-center gap-2 cursor-pointer bg-stone-900 px-3 py-1.5 rounded-xl border border-amber-500/40 hover:bg-stone-800 transition">
                <input
                  type="checkbox"
                  checked={yatraEnabled}
                  onChange={(e) => setYatraEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300">
                  {yatraEnabled ? '✅ ယတြာ ပြုလုပ်မည်' : '❌ ယတြာ မပါပါ'}
                </span>
              </label>
            </div>

            {yatraEnabled ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Yatra Name Direct Input */}
                  <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800 space-y-1.5">
                    <label className="block text-stone-300 font-medium text-xs">
                      ယတြာ အမည် (ရိုက်ထည့်ပါ) *
                    </label>
                    <input
                      type="text"
                      placeholder="ဥပမာ - နဝင်းယတြာ၊ စီးပွားလာဘ်ရွှင်ယတြာ၊ ဇာတာပြင်ယတြာ"
                      value={customYatraName}
                      onChange={(e) => setCustomYatraName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-amber-500/40 text-stone-100 focus:border-amber-400 text-xs sm:text-sm font-medium"
                      required={yatraEnabled}
                    />
                  </div>

                  {/* Yatra Fee Input */}
                  <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-stone-300 font-medium block text-xs">ယတြာ ကုန်ကျငွေ / အလှူငွေ (ကျပ်) *</span>
                      <span className="text-[10px] text-stone-500">စိတ်ကြိုက် သတ်မှတ်ပါ</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={yatraFee}
                      onChange={(e) => setYatraFee(Number(e.target.value))}
                      className="w-36 px-3 py-1.5 text-right rounded-xl bg-stone-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-base focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic bg-stone-900/50 p-3 rounded-xl border border-stone-800">
                ယတြာ ထည့်သွင်းလိုပါက အပေါ်ရှိ <strong>"✅ ယတြာ ပြုလုပ်မည်"</strong> ကို အမှန်ခြစ်၍ ယတြာအမည်နှင့် စရိတ်အား စိတ်ကြိုက် ရိုက်ထည့်နိုင်ပါသည်။
              </p>
            )}
          </div>

          {/* Section 5: Amulets & Custom Price / Manual Item Entry (POS) */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <ShoppingBag className="w-4 h-4" />
                <span>၅။ အဆောင်ပစ္စည်း ဝယ်ယူမှု (POS) & စိတ်ကြိုက်ဈေးနှုန်း သတ်မှတ်ခြင်း</span>
              </div>
              <span className="text-xs text-stone-400">
                အဆောင် စုစုပေါင်း: <strong className="text-purple-300">{formatMMK(amuletsTotal)}</strong>
              </span>
            </div>

            {/* Quick Catalog Item Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-stone-400">ကတ်တလောက်မှ အမြန်ထည့်ရန်:</p>
                <button
                  type="button"
                  onClick={() => setShowCustomAmuletForm(!showCustomAmuletForm)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showCustomAmuletForm ? 'မထည့်တော့ပါ' : '+ စိတ်ကြိုက် အဆောင်အသစ် ထည့်မည်'}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {amuletsCatalog.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddCatalogAmulet(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs transition cursor-pointer hover:border-purple-500"
                  >
                    <Plus className="w-3 h-3 text-purple-400" />
                    <span>{item.name}</span>
                    <span className="text-purple-300 font-mono">({formatMMK(item.price)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amulet Form */}
            {showCustomAmuletForm && (
              <div className="p-3.5 rounded-2xl bg-stone-900 border border-purple-500/40 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>စိတ်ကြိုက် အဆောင်ပစ္စည်း နှင့် ဈေးနှုန်း အသစ်ထည့်သွင်းရန်:</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">ပစ္စည်းအမည် *</label>
                    <input
                      type="text"
                      placeholder="ဥပမာ - မဟူရာ လက်စွပ် အထူး"
                      value={customAmuletName}
                      onChange={(e) => setCustomAmuletName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">စိတ်ကြိုက် ဈေးနှုန်း (ကျပ်) *</label>
                    <input
                      type="number"
                      placeholder="35000"
                      value={customAmuletPrice}
                      onChange={(e) => setCustomAmuletPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-purple-300 font-mono text-xs focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">အရေအတွက်</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={customAmuletQty}
                        onChange={(e) => setCustomAmuletQty(Math.max(1, Number(e.target.value) || 1))}
                        className="w-20 px-2.5 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomAmulet}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                      >
                        + ထည့်မည်
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Amulets List / Cart */}
            {amulets.length > 0 && (
              <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-2">
                <p className="text-xs text-stone-300 font-medium">ရွေးချယ်ထားသော အဆောင်ပစ္စည်းများ (ဈေးနှုန်း ပြင်နိုင်သည်):</p>
                <div className="divide-y divide-stone-800">
                  {amulets.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2">
                      <div className="flex-1">
                        <span className="font-medium text-stone-200">{item.name}</span>
                        <span className="text-[11px] text-stone-400 ml-2">({item.category})</span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {/* Unit price edit */}
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-stone-400">နှုန်း:</span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleUpdateAmuletItem(idx, { price: Number(e.target.value) || 0 })}
                            className="w-24 px-2 py-1 text-right bg-stone-950 border border-stone-700 rounded-lg text-xs font-mono text-purple-300"
                          />
                        </div>

                        {/* Qty edit */}
                        <div className="flex items-center border border-stone-700 rounded-lg bg-stone-950">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) handleRemoveAmulet(idx);
                              else handleUpdateAmuletItem(idx, { quantity: item.quantity - 1 });
                            }}
                            className="px-2 py-0.5 text-stone-400 hover:text-stone-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-medium text-amber-300 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateAmuletItem(idx, { quantity: item.quantity + 1 })}
                            className="px-2 py-0.5 text-stone-400 hover:text-stone-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Total per item */}
                        <span className="w-24 text-right font-mono text-purple-300 font-bold text-xs">
                          {formatMMK(item.price * item.quantity)}
                        </span>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmulet(idx)}
                          className="p-1 text-stone-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Billing, Total & Payment */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-amber-500/30 space-y-3.5 bg-gradient-to-r from-stone-850 via-stone-850 to-amber-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>၆။ စုစုပေါင်း ကျသင့်ငွေနှင့် ငွေပေးချေမှု (Billing)</span>
              </div>
              <button
                type="button"
                onClick={handleSetPaidFull}
                className="text-xs px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition cursor-pointer font-semibold"
              >
                အပြေအကြေ ရှင်းပြီးအမှတ်အသားပြု
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800">
                <span className="text-xs text-stone-400">စုစုပေါင်း ကျသင့်ငွေ (Total)</span>
                <p className="text-xl font-bold text-amber-300 font-mono mt-0.5">
                  {formatMMK(totalAmount)}
                </p>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  (ဗေဒင်ခ + {yatraEnabled ? 'ယတြာ' : 'ယတြာမပါ'} + အဆောင်)
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ရှင်းပြီးငွေ (Paid Amount)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-emerald-400 font-mono font-bold text-base focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ငွေရှင်း အခြေအနေ</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
                >
                  <option value="paid">အပြေအကြေ ရှင်းပြီး (Paid)</option>
                  <option value="partial">တစ်စိတ်တစ်ပိုင်း/စရန် (Partial)</option>
                  <option value="unpaid">မရှင်းရသေး (Unpaid)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ပေးချေသည့် နည်းလမ်း</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
                >
                  <option value="kpay">KPay (KBZPay)</option>
                  <option value="cash">ငွေသား (Cash)</option>
                  <option value="wave">Wave Money</option>
                  <option value="cbbank">CB Pay</option>
                  <option value="ayapay">AYA Pay</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 7: Astrological Predictions & Yatra Instructions */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <FileText className="w-4 h-4" />
              <span>၇။ ဟောချက်များနှင့် ယတြာညွှန်ကြားချက်များ</span>
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                ပေးလိုက်သော ဟောချက်များ / ဟောကိန်း (Predictions Given)
              </label>
              <textarea
                rows={3}
                placeholder="ဥပမာ - ယခုနှစ်တွင် စီးပွားရေးလုပ်ငန်းချဲ့ထွင်မှု အလွန်ကောင်းမွန်မည်။ စပ်တူရှယ်ယာသတိပြုပါ..."
                value={predictions}
                onChange={(e) => setPredictions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                ညွှန်ကြားလိုက်သော ယတြာနှင့် အစီအရင်များ (Yatra Ritual Instructions)
              </label>
              <textarea
                rows={3}
                placeholder="ဥပမာ - တနင်္လာထောင့်တွင် နို့ထမင်း ၉ ပွဲ ကပ်လှူပါ။ နဝင်း ၃ ကြိမ်စာ ဆက်တိုက် ၉ ရက်စီးရမည်..."
                value={yatraInstructions}
                onChange={(e) => setYatraInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                အထွေထွေ မှတ်ချက် / သတိပြုရန် (General Notes)
              </label>
              <input
                type="text"
                placeholder="ဥပမာ - ဖောက်သည်ဟောင်း၊ နောက်တစ်ကြိမ် လာရောက်ရန် ချိန်းဆိုထား..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              မလုပ်တော့ပါ (Cancel)
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'မှတ်တမ်း ပြင်ဆင်သိမ်းဆည်းမည်' : 'ဗေဒင်မှတ်တမ်း သွင်းမည်'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
