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
  CreditCard 
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

  // Form states
  const [id, setId] = useState(initialData?.id || nextId);
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'female');
  const [birthDayOfWeek, setBirthDayOfWeek] = useState<DayOfWeekBurmese>(initialData?.birthDayOfWeek || 'တနင်္ဂနွေ');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [birthTime, setBirthTime] = useState(initialData?.birthTime || '');
  const [age, setAge] = useState<number | undefined>(initialData?.age || undefined);
  const [mahabote, setMahabote] = useState<MahaboteHouse | undefined>(initialData?.mahabote || 'အထွန်း');

  const [bookingDate, setBookingDate] = useState(initialData?.bookingDate || todayStr);
  const [readingDateTime, setReadingDateTime] = useState(initialData?.readingDateTime || nowDateTimeStr);

  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(initialData?.serviceCategory || 'general_reading');
  const [serviceFee, setServiceFee] = useState<number>(initialData?.serviceFee || 20000);

  const [navawinType, setNavawinType] = useState<NavawinCountType>(initialData?.navawinType || 'none');
  const [navawinFee, setNavawinFee] = useState<number>(initialData?.navawinFee || 0);

  const [amulets, setAmulets] = useState<PurchasedAmulet[]>(initialData?.amulets || []);

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>(initialData?.paymentStatus || 'paid');
  const [paidAmount, setPaidAmount] = useState<number>(initialData?.paidAmount || 20000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>(initialData?.paymentMethod || 'kpay');

  const [status, setStatus] = useState<'scheduled' | 'yatra_ongoing' | 'completed' | 'cancelled'>(initialData?.status || 'completed');
  const [taskDone, setTaskDone] = useState<boolean>(initialData?.taskDone || true);

  const [predictions, setPredictions] = useState(initialData?.predictions || '');
  const [yatraInstructions, setYatraInstructions] = useState(initialData?.yatraInstructions || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

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

  // Change Navawin and update fee default
  const handleNavawinChange = (nav: NavawinCountType) => {
    setNavawinType(nav);
    const found = NAWAWIN_OPTIONS.find(n => n.key === nav);
    if (found) {
      setNavawinFee(found.defaultFee);
    }
  };

  // Calculate Amulets total
  const amuletsTotal = amulets.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = (Number(serviceFee) || 0) + (Number(navawinFee) || 0) + amuletsTotal;

  // Auto-adjust paid amount if full payment selected
  const handleSetPaidFull = () => {
    setPaymentStatus('paid');
    setPaidAmount(totalAmount);
  };

  // Add amulet from catalog
  const handleAddAmulet = (catalogItem: AmuletCatalogItem) => {
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

  // Update amulet quantity
  const handleUpdateAmuletQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setAmulets(amulets.filter((_, i) => i !== index));
    } else {
      const updated = [...amulets];
      updated[index].quantity = newQty;
      setAmulets(updated);
    }
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
      navawinType,
      navawinFee: Number(navawinFee) || 0,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-200">
                {isEditing ? 'ဗေဒင်မှတ်တမ်း & POS ပြင်ဆင်ရန်' : 'ဗေဒင်မေးသူ အသစ်စာရင်းသွင်းခြင်း & POS'}
              </h2>
              <p className="text-xs text-stone-400">
                မေးသူအချက်အလက်၊ နဝင်းယတြာ၊ အဆောင်ဝယ်ယူမှု၊ ဈေးနှုန်းနှင့် ဟောချက်များ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          
          {/* Section 1: Customer Profile & Horoscope Data */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <User className="w-4 h-4" />
              <span>၁။ ဗေဒင်မေးသူ ကိုယ်ရေးအချက်အလက်နှင့် မွေးဇာတာ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">ဗေဒင်မေးသူ ID</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 font-mono focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ဗေဒင်မေးသူ အမည် *</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - ဒေါ်သန်းသန်းဆွေ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 font-medium"
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
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">မွေးနေ့ရက်စွဲ</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">နေ့နံ (Day of Week)</label>
                <select
                  value={birthDayOfWeek}
                  onChange={(e) => setBirthDayOfWeek(e.target.value as DayOfWeekBurmese)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 font-medium focus:border-amber-500 cursor-pointer"
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
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မဟာဘုတ်ခွင်</label>
                <select
                  value={mahabote || 'အထွန်း'}
                  onChange={(e) => setMahabote(e.target.value as MahaboteHouse)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
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
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <Calendar className="w-4 h-4" />
              <span>၂။ ဘိုကင်ရက်စွဲနှင့် ဟောကြားမည့် အချိန်</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">ဘိုကင်တင်သည့်နေ့</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ဗေဒင်ဟောမည့် နေ့နှင့်အချိန် *</label>
                <input
                  type="datetime-local"
                  value={readingDateTime}
                  onChange={(e) => setReadingDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">လုပ်ငန်းစဉ် အခြေအနေ</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
                >
                  <option value="scheduled">ရက်ချိန်းစောင့် (Scheduled)</option>
                  <option value="yatra_ongoing">ယတြာလုပ်ဆဲ (Ongoing Yatra)</option>
                  <option value="completed">ပြီးစီး (Completed)</option>
                  <option value="cancelled">ပယ်ဖျက် (Cancelled)</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer bg-stone-900 p-2.5 rounded-lg border border-stone-700 w-full hover:border-amber-500 transition">
                  <input
                    type="checkbox"
                    checked={taskDone}
                    onChange={(e) => setTaskDone(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-medium text-stone-200">Task Done (ပြီးစီး)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Services & Navawin Yatra */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Calculator className="w-4 h-4" />
                <span>၃။ ဗေဒင်ဝန်ဆောင်မှုနှင့် နဝင်းယတြာ ရွေးချယ်မှု</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Service Type */}
              <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800 space-y-2">
                <label className="block text-stone-300 font-medium">ဗေဒင်ဝန်ဆောင်မှု အမျိုးအစား</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => handleServiceChange(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
                >
                  {SERVICE_CATEGORIES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} ({formatMMK(s.defaultFee)})
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-400">ဗေဒင်ဟောခ (ကျပ်):</span>
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Number(e.target.value))}
                    className="w-36 px-2.5 py-1 text-right rounded bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Navawin Yatra */}
              <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800 space-y-2">
                <label className="block text-stone-300 font-medium">နဝင်းယတြာ (တကြိမ်/နှစ်ကြိမ်/သုံးကြိမ်)</label>
                <select
                  value={navawinType}
                  onChange={(e) => handleNavawinChange(e.target.value as NavawinCountType)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
                >
                  {NAWAWIN_OPTIONS.map((n) => (
                    <option key={n.key} value={n.key}>
                      {n.label} {n.defaultFee > 0 ? `(${formatMMK(n.defaultFee)})` : ''}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-400">နဝင်းယတြာ ကုန်ကျငွေ (ကျပ်):</span>
                  <input
                    type="number"
                    value={navawinFee}
                    onChange={(e) => setNavawinFee(Number(e.target.value))}
                    className="w-36 px-2.5 py-1 text-right rounded bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Amulets & Ritual Items (POS) */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <ShoppingBag className="w-4 h-4" />
                <span>၄။ အဆောင်ပစ္စည်း / ယတြာပစ္စည်း ဝယ်ယူမှု (POS)</span>
              </div>
              <span className="text-xs text-stone-400">
                အဆောင် စုစုပေါင်း: <strong className="text-purple-300">{formatMMK(amuletsTotal)}</strong>
              </span>
            </div>

            {/* Quick Catalog Item Buttons */}
            <div>
              <p className="text-xs text-stone-400 mb-2">ကတ်တလောက်မှ အမြန်ထည့်ရန် နှိပ်ပါ:</p>
              <div className="flex flex-wrap gap-2">
                {amuletsCatalog.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddAmulet(item)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs transition cursor-pointer hover:border-purple-500"
                  >
                    <Plus className="w-3 h-3 text-purple-400" />
                    <span>{item.name}</span>
                    <span className="text-purple-300 font-mono">({formatMMK(item.price)})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Amulets List */}
            {amulets.length > 0 && (
              <div className="bg-stone-900 rounded-lg p-3 border border-stone-800 space-y-2">
                <p className="text-xs text-stone-300 font-medium">ရွေးချယ်ထားသော အဆောင်ပစ္စည်းများ:</p>
                <div className="divide-y divide-stone-800">
                  {amulets.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 gap-2">
                      <div className="flex-1">
                        <span className="font-medium text-stone-200">{item.name}</span>
                        <span className="text-xs text-stone-400 ml-2">({item.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-stone-700 rounded bg-stone-950">
                          <button
                            type="button"
                            onClick={() => handleUpdateAmuletQty(idx, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-stone-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-medium text-amber-300">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateAmuletQty(idx, item.quantity + 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-stone-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="w-24 text-right font-mono text-purple-300 font-medium">
                          {formatMMK(item.price * item.quantity)}
                        </span>
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

          {/* Section 5: Billing, Total & Payment */}
          <div className="bg-stone-850 p-4 rounded-xl border border-amber-500/30 space-y-4 bg-gradient-to-r from-stone-850 via-stone-850 to-amber-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>၅။ စုစုပေါင်း ကျသင့်ငွေနှင့် ငွေပေးချေမှု (Billing)</span>
              </div>
              <button
                type="button"
                onClick={handleSetPaidFull}
                className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition cursor-pointer"
              >
                အပြေအကြေ ရှင်းပြီးအမှတ်အသားပြု
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                <span className="text-xs text-stone-400">စုစုပေါင်း ကျသင့်ငွေ (Total)</span>
                <p className="text-xl font-bold text-amber-300 font-mono mt-0.5">
                  {formatMMK(totalAmount)}
                </p>
                <div className="text-[11px] text-stone-500 mt-1">
                  (ဗေဒင်ခ + နဝင်းယတြာ + အဆောင်)
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ရှင်းပြီးငွေ (Paid Amount)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-emerald-400 font-mono font-bold text-base focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ငွေရှင်း အခြေအနေ</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
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
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 cursor-pointer"
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

          {/* Section 6: Astrological Predictions & Yatra Instructions */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-2">
              <FileText className="w-4 h-4" />
              <span>၆။ ဟောချက်များနှင့် ယတြာညွှန်ကြားချက်များ</span>
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
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">
                ညွှန်ကြားလိုက်သော ယတြာနှင့် နဝင်းစီးနည်း (Yatra / Navawin Ritual Instructions)
              </label>
              <textarea
                rows={3}
                placeholder="ဥပမာ - တနင်္လာထောင့်တွင် နို့ထမင်း ၉ ပွဲ ကပ်လှူပါ။ နဝင်း ၃ ကြိမ်စာ ဆက်တိုက် ၉ ရက်စီးရမည်..."
                value={yatraInstructions}
                onChange={(e) => setYatraInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
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
                className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 placeholder-stone-600"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              မလုပ်တော့ပါ (Cancel)
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer"
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
