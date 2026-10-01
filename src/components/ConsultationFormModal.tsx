import React, { useState, useEffect, useMemo } from 'react';
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
  CreditCard,
  Wifi,
  WifiOff,
  Flame,
  Tag,
  Edit3,
  Search,
  History,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Printer,
  Globe,
  Share2
} from 'lucide-react';
import { 
  AmuletCatalogItem, 
  ConsultationRecord, 
  DayOfWeekBurmese, 
  MahaboteHouse, 
  NavawinCountType, 
  PurchasedAmulet 
} from '../types';
import { 
  BURMESE_DAYS, 
  calculateMahabote, 
  formatMMK, 
  formatDateDDMMYYYY,
  getBurmeseDayFromDate, 
  MAHABOTE_HOUSES
} from '../utils/astrology';
import { 
  loadSavedCustomServices, 
  rememberCustomService, 
  loadSavedCustomYatras, 
  rememberCustomYatra,
  searchCustomerHistoryProfiles,
  CustomerHistoryProfile
} from '../utils/storage';

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ConsultationRecord) => void;
  onDirectPrint?: (record: ConsultationRecord) => void;
  initialData?: ConsultationRecord | null;
  amuletsCatalog?: AmuletCatalogItem[];
  nextId: string;
  allRecords?: ConsultationRecord[];
}

export const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDirectPrint,
  initialData,
  nextId,
  allRecords = [],
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

  // Customer History Lookup state
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedHistoryProfile, setSelectedHistoryProfile] = useState<CustomerHistoryProfile | null>(null);
  const [showHistoryDossier, setShowHistoryDossier] = useState(false);

  const matchedCustomers = useMemo(() => {
    if (!customerSearchQuery.trim() || isEditing) return [];
    return searchCustomerHistoryProfiles(customerSearchQuery, allRecords);
  }, [customerSearchQuery, allRecords, isEditing]);

  // Form states - ID
  const [id, setId] = useState(initialData?.id || nextId);
  const [isCustomizingId, setIsCustomizingId] = useState(false);

  // Customer info - Name is SKIPABLE (optional!)
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  
  // Social Account fields
  const [socialPlatform, setSocialPlatform] = useState<'viber' | 'facebook' | 'tiktok' | 'telegram' | 'phone' | 'other'>(
    initialData?.socialPlatform || 'viber'
  );
  const [socialAccountName, setSocialAccountName] = useState(initialData?.socialAccountName || '');

  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'female');
  
  // မွေးနံ (Shorthand: ၁ နွေ, ၂ လာ, ၃ ဂါ, ၄ ဟူး, ၅ တေး, ၆ ကြာ, ၇ နေ, ၈ ရာ)
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

  // Custom Services with Memory
  const [savedServices] = useState(loadSavedCustomServices());
  const [serviceName, setServiceName] = useState<string>(
    initialData?.serviceCategory || 'ဗေဒင်ဟောစာတမ်း'
  );
  const [serviceFee, setServiceFee] = useState<number>(
    initialData?.serviceFee !== undefined ? initialData.serviceFee : 20000
  );

  // Custom Yatra with Memory
  const [savedYatras] = useState(loadSavedCustomYatras());
  const [yatraEnabled, setYatraEnabled] = useState<boolean>(
    initialData?.yatraEnabled !== undefined 
      ? initialData.yatraEnabled 
      : !!(initialData?.yatraName || (initialData?.yatraFee && initialData.yatraFee > 0) || (initialData?.navawinType && initialData.navawinType !== 'none'))
  );
  const [customYatraName, setCustomYatraName] = useState<string>(initialData?.yatraName || '');
  const [yatraFee, setYatraFee] = useState<number>(
    initialData?.yatraFee !== undefined 
      ? initialData.yatraFee 
      : (initialData?.navawinFee || 30000)
  );

  // Pure Custom Amulets POS
  const [amulets, setAmulets] = useState<PurchasedAmulet[]>(initialData?.amulets || []);
  const [customAmuletName, setCustomAmuletName] = useState('');
  const [customAmuletPrice, setCustomAmuletPrice] = useState<number | ''>(15000);
  const [customAmuletQty, setCustomAmuletQty] = useState<number>(1);

  // Payment
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>(initialData?.paymentStatus || 'paid');
  const [paidAmount, setPaidAmount] = useState<number>(initialData?.paidAmount || 20000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>(initialData?.paymentMethod || 'kpay');

  // Notes
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const amuletsTotal = useMemo(() => {
    return amulets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [amulets]);

  const totalAmount = useMemo(() => {
    const sFee = Number(serviceFee) || 0;
    const yFee = yatraEnabled ? (Number(yatraFee) || 0) : 0;
    return sFee + yFee + amuletsTotal;
  }, [serviceFee, yatraEnabled, yatraFee, amuletsTotal]);

  useEffect(() => {
    if (!initialData && paymentStatus === 'paid') {
      setPaidAmount(totalAmount);
    }
  }, [totalAmount, paymentStatus, initialData]);

  const handleBirthDateChange = (dateStr: string) => {
    setBirthDate(dateStr);
    if (dateStr) {
      const day = getBurmeseDayFromDate(dateStr);
      setBirthDayOfWeek(day);

      const year = new Date(dateStr).getFullYear();
      if (year) {
        const myanmarYear = year - 638;
        const house = calculateMahabote(myanmarYear, day);
        setMahabote(house);

        const currentYear = new Date().getFullYear();
        setAge(currentYear - year);
      }
    }
  };

  const handleSelectExistingCustomer = (profile: CustomerHistoryProfile) => {
    setCustomerName(profile.customerName || '');
    setPhone(profile.phone || '');
    if (profile.gender) setGender(profile.gender);
    if (profile.birthDayOfWeek) setBirthDayOfWeek(profile.birthDayOfWeek as DayOfWeekBurmese);
    if (profile.birthDate) setBirthDate(profile.birthDate);
    if (profile.birthTime) setBirthTime(profile.birthTime);
    if (profile.age) setAge(profile.age);
    if (profile.mahabote) setMahabote(profile.mahabote as MahaboteHouse);

    setSelectedHistoryProfile(profile);
    setShowHistoryDossier(true);
    setCustomerSearchQuery('');
  };

  const handleSelectSavedService = (sName: string, sFee: number) => {
    setServiceName(sName);
    setServiceFee(sFee);
  };

  const handleSelectSavedYatra = (yName: string, yFee: number) => {
    setCustomYatraName(yName);
    setYatraFee(yFee);
    setYatraEnabled(true);
  };

  const handleAddCustomAmulet = () => {
    if (!customAmuletName.trim()) {
      alert('အဆောင်ပစ္စည်း အမည် ရိုက်ထည့်ပေးပါ');
      return;
    }
    const priceNum = Number(customAmuletPrice) || 0;
    const qtyNum = Math.max(1, Number(customAmuletQty) || 1);

    const newItem: PurchasedAmulet = {
      id: `amulet-${Date.now()}`,
      name: customAmuletName.trim(),
      category: 'စိတ်ကြိုက်အဆောင်',
      price: priceNum,
      quantity: qtyNum,
    };

    setAmulets([...amulets, newItem]);
    setCustomAmuletName('');
    setCustomAmuletPrice(15000);
    setCustomAmuletQty(1);
  };

  const handleRemoveAmulet = (index: number) => {
    setAmulets(amulets.filter((_, i) => i !== index));
  };

  const buildCurrentRecord = (): ConsultationRecord => {
    const cleanServiceName = serviceName.trim() || 'ဗေဒင်ဝန်ဆောင်မှု';
    const finalYatraName = customYatraName.trim() || (yatraEnabled ? 'ယတြာ အစီအရင်' : '');
    const legacyNavawin: NavawinCountType = yatraEnabled ? '3_times' : 'none';

    return {
      id: id || nextId,
      customerName: customerName.trim() || 'မမေးသူ (အမည်မသိ)',
      phone: phone.trim() || '09-',
      socialPlatform,
      socialAccountName: socialAccountName.trim(),
      gender,
      birthDayOfWeek,
      birthDate,
      birthTime,
      age: age ? Number(age) : undefined,
      mahabote,
      bookingDate,
      readingDateTime,
      serviceCategory: cleanServiceName as any,
      serviceFee: Number(serviceFee) || 0,
      
      yatraEnabled,
      yatraName: finalYatraName,
      yatraFee: yatraEnabled ? (Number(yatraFee) || 0) : 0,
      navawinType: legacyNavawin,
      navawinFee: yatraEnabled ? (Number(yatraFee) || 0) : 0,

      amulets,
      amuletsTotal,

      totalAmount,
      paidAmount: Number(paidAmount) || 0,
      paymentStatus,
      paymentMethod,
      
      status,
      taskDone: status === 'completed',
      predictions: initialData?.predictions || '',
      yatraInstructions: initialData?.yatraInstructions || '',
      notes,
      
      recordedBy: initialData?.recordedBy || 'ကောင်တာ ၁',
      updatedBy: 'ကောင်တာ ၁',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handlePrintClick = () => {
    const rec = buildCurrentRecord();
    if (onDirectPrint) {
      onDirectPrint(rec);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanServiceName = serviceName.trim() || 'ဗေဒင်ဝန်ဆောင်မှု';
    const finalYatraName = customYatraName.trim() || (yatraEnabled ? 'ယတြာ အစီအရင်' : '');

    rememberCustomService(cleanServiceName, Number(serviceFee) || 0);
    if (yatraEnabled && finalYatraName) {
      rememberCustomYatra(finalYatraName, Number(yatraFee) || 0);
    }

    const record = buildCurrentRecord();
    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-stone-850 p-4 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-200">
                  {isEditing ? 'ဗေဒင်မေးသူ အချက်အလက် ပြင်ဆင်ခြင်း' : 'ဗေဒင်မေးသူ အသစ်စာရင်းသွင်းခြင်း'}
                </h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isOnline 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                }`}>
                  {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
                  <span>{isOnline ? 'Cloud Sync' : 'Offline'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          
          {/* Returning Customer Quick Search Box */}
          {!isEditing && (
            <div className="bg-stone-850 p-3 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>🔍 Customer အဟောင်း ရှာဖွေရန် (ID၊ ဖုန်း သို့မဟုတ် အမည်):</span>
                </label>
                {selectedHistoryProfile && (
                  <button
                    type="button"
                    onClick={() => setShowHistoryDossier(!showHistoryDossier)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>ယခင်မေးမှတ်တမ်း ({selectedHistoryProfile.totalVisits} ကြိမ်)</span>
                    {showHistoryDossier ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="ဖုန်းနံပါတ် သို့မဟုတ် အမည် သို့မဟုတ် ID ဖြင့် ရှာရန်..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 text-xs"
                />

                {matchedCustomers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-stone-900 border border-amber-500/50 rounded-2xl shadow-2xl p-2 space-y-1.5 max-h-48 overflow-y-auto">
                    {matchedCustomers.map((cust, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectExistingCustomer(cust)}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-850 hover:bg-amber-950/50 hover:border-amber-500/40 border border-stone-800 cursor-pointer transition text-xs"
                      >
                        <div>
                          <span className="font-bold text-amber-200">{cust.customerName || 'အမည်မသိ'}</span>
                          <span className="text-stone-400 ml-2 font-mono">{cust.phone}</span>
                          <span className="text-[10px] text-amber-400/80 ml-2">({cust.birthDayOfWeek})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                            မေးဖူးသူ ({cust.totalVisits} ကြိမ်)
                          </span>
                          <span className="text-amber-400 font-bold text-xs">ရွေးချယ်မည် →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedHistoryProfile && showHistoryDossier && (
                <div className="mt-2 p-3 rounded-2xl bg-stone-900 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>{selectedHistoryProfile.customerName || 'အမည်မသိ'} ၏ လွန်ခဲ့သော ဗေဒင်မှတ်တမ်း</span>
                    </div>
                    <span className="text-[11px] text-stone-400">
                      မေးပြီးငွေ: <strong className="text-emerald-400 font-mono">{formatMMK(selectedHistoryProfile.totalSpent)}</strong>
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedHistoryProfile.allRecords.map((hist, hIdx) => (
                      <div key={hIdx} className="p-2 rounded-xl bg-stone-850 border border-stone-800 text-[11px] space-y-0.5">
                        <div className="flex justify-between items-center text-stone-300">
                          <span className="font-mono text-amber-300 font-semibold">{hist.id}</span>
                          <span className="text-stone-400">{formatDateDDMMYYYY(hist.readingDateTime || hist.bookingDate)}</span>
                          <span className="font-bold text-emerald-400">{formatMMK(hist.totalAmount)}</span>
                        </div>
                        <div className="text-stone-300">
                          <span className="text-stone-400">ဝန်ဆောင်မှု: </span>
                          <span>{hist.serviceCategory}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Customer Profile (Name Skipable, Social Account Dropdown) */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-stone-800 space-y-3">
            
            {/* Auto ID Display & Customizer */}
            <div className="bg-stone-900/90 border border-amber-500/30 p-2.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-amber-300">
                  ဗေဒင်မေးသူ ID:
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
                      className="px-2 py-0.5 bg-stone-950 border border-amber-500/50 rounded-lg text-amber-300 font-mono text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomizingId(false)}
                      className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]"
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
                    <span>ID စိတ်ကြိုက်ပြင်ရန်</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. Name (SKIPABLE / Optional!) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  အမည် <span className="text-stone-500 font-normal text-[11px]">(မထည့်ဘဲ ကျော်နိုင်ပါသည် - Skipable)</span>
                </label>
                <input
                  type="text"
                  placeholder="မမေသူ (သို့) မထည့်ပါ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ဖုန်းနံပါတ်</label>
                <input
                  type="text"
                  placeholder="09-xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">ကျား/မ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
                >
                  <option value="female">အမျိုးသမီး (Female)</option>
                  <option value="male">အမျိုးသား (Male)</option>
                  <option value="other">အခြား</option>
                </select>
              </div>
            </div>

            {/* 2. Social Account Dropdown & Account Name Input */}
            <div className="p-2.5 bg-stone-900/70 border border-stone-800 rounded-xl space-y-1.5">
              <label className="block text-stone-300 font-medium text-xs flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Social Account အချက်အလက်</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-medium focus:border-amber-400 cursor-pointer text-xs"
                  >
                    <option value="viber">📱 Viber</option>
                    <option value="facebook">📘 Facebook</option>
                    <option value="tiktok">🎵 TikTok</option>
                    <option value="telegram">✈️ Telegram</option>
                    <option value="phone">📞 Phone Call</option>
                    <option value="other">🌐 အခြား</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Social Account Name / ID ရိုက်ထည့်ပါ (ဥပမာ- Phyo Phyo / @user123)..."
                    value={socialAccountName}
                    onChange={(e) => setSocialAccountName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* 3. မွေးနံ (Shorthand: ၁ နွေ, ၂ လာ, ၃ ဂါ, ၄ ဟူး, ၅ တေး, ၆ ကြာ, ၇ နေ, ၈ ရာ) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="block text-amber-300 font-bold mb-1">မွေးနံ *</label>
                <select
                  value={birthDayOfWeek}
                  onChange={(e) => setBirthDayOfWeek(e.target.value as DayOfWeekBurmese)}
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-300 font-bold focus:border-amber-400 cursor-pointer text-xs sm:text-sm"
                >
                  {BURMESE_DAYS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.shorthand} ({d.planet})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မွေးသက္ကရာဇ် (ရက်စွဲ)</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မွေးဖွားချိန် (Time)</label>
                <input
                  type="text"
                  placeholder="မနက် ၈:၁၅"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">မဟာဘုတ်ခွင်</label>
                <select
                  value={mahabote || 'အထွန်း'}
                  onChange={(e) => setMahabote(e.target.value as MahaboteHouse)}
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer text-xs"
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
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold border-b border-stone-800 pb-1.5">
              <Calendar className="w-4 h-4" />
              <span>၂။ ဘိုကင်ရက်စွဲ၊ ဟောကြားမည့် အချိန်နှင့် လုပ်ငန်းစဉ်အခြေအနေ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">
                  ဘိုကင်တင်သည့်နေ့ <span className="text-amber-300 font-mono text-[11px]">({formatDateDDMMYYYY(bookingDate)})</span>
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">
                  ဗေဒင်ဟောမည့် နေ့နှင့်အချိန် <span className="text-amber-300 font-mono text-[11px]">({formatDateDDMMYYYY(readingDateTime)})</span>
                </label>
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

          {/* Section 3: Purely Custom Service Name & Fee */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Calculator className="w-4 h-4" />
                <span>၃။ ဗေဒင်ဝန်ဆောင်မှု အမည်နှင့် ဟောခ (စိတ်ကြိုက်)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 space-y-1">
                <label className="block text-stone-300 font-medium text-xs">
                  ဗေဒင်ဝန်ဆောင်မှု အမည် (ရိုက်ထည့်ပါ)
                </label>
                <input
                  type="text"
                  placeholder="ဥပမာ - ဗေဒင်ဟောစာတမ်း၊ မဟာဘုတ်ဟောချက်၊ ဇာတာစစ်"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-amber-500/40 text-stone-100 focus:border-amber-400 font-medium"
                  required
                />
              </div>

              <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-300 font-medium block text-xs">ဗေဒင်ဟောခ (ကျပ်)</span>
                  <span className="text-[10px] text-stone-500">စိတ်ကြိုက် သတ်မှတ်ပါ</span>
                </div>
                <input
                  type="number"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-36 px-3 py-1.5 text-right rounded-xl bg-stone-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-base focus:border-amber-400"
                />
              </div>
            </div>

            {savedServices.length > 0 && (
              <div className="space-y-1 pt-0.5">
                <span className="text-[11px] text-stone-400 font-medium block">
                  ယခင်ထည့်ထားသော ဝန်ဆောင်မှုများ (၁ ချက်နှိပ်ရွေးရန်):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {savedServices.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleSelectSavedService(srv.name, srv.defaultFee)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
                        serviceName === srv.name
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500 font-bold'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {srv.name} ({formatMMK(srv.defaultFee)})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Purely Custom Yatra with Memory */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-amber-500/30 space-y-3 bg-gradient-to-br from-stone-850 to-amber-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>၄။ ယတြာ ပြုလုပ်ဆောင်ရွက်မှု (စိတ်ကြိုက်)</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-stone-900 px-3 py-1 rounded-xl border border-amber-500/40 hover:bg-stone-800 transition">
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
              <div className="space-y-2.5 pt-0.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 space-y-1">
                    <label className="block text-stone-300 font-medium text-xs">
                      ယတြာ အမည် (ရိုက်ထည့်ပါ)
                    </label>
                    <input
                      type="text"
                      placeholder="ဥပမာ - နဝင်းယတြာ၊ စီးပွားလာဘ်ရွှင်ယတြာ"
                      value={customYatraName}
                      onChange={(e) => setCustomYatraName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-amber-500/40 text-stone-100 focus:border-amber-400 text-xs font-medium"
                      required={yatraEnabled}
                    />
                  </div>

                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-stone-300 font-medium block text-xs">ယတြာ ကုန်ကျငွေ / အလှူငွေ (ကျပ်)</span>
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

                {savedYatras.length > 0 && (
                  <div className="space-y-1 pt-0.5">
                    <span className="text-[11px] text-stone-400 font-medium block">
                      ယခင်ထည့်ထားသော ယတြာများ (၁ ချက်နှိပ်ရွေးရန်):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {savedYatras.map((yat) => (
                        <button
                          key={yat.id}
                          type="button"
                          onClick={() => handleSelectSavedYatra(yat.name, yat.defaultFee)}
                          className={`px-2.5 py-1 rounded-lg text-xs border transition cursor-pointer ${
                            customYatraName === yat.name
                              ? 'bg-amber-500/30 text-amber-300 border-amber-500 font-bold'
                              : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
                          }`}
                        >
                          {yat.name} ({formatMMK(yat.defaultFee)})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic bg-stone-900/50 p-2.5 rounded-xl border border-stone-800">
                ယတြာ ထည့်သွင်းလိုပါက အပေါ်ရှိ <strong>"✅ ယတြာ ပြုလုပ်မည်"</strong> ကို အမှန်ခြစ်ပါ ရိုက်ထည့်နိုင်ပါသည်။
              </p>
            )}
          </div>

          {/* Section 5: PURE CUSTOM AMULETS POS */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-purple-500/30 space-y-3 bg-gradient-to-br from-stone-850 to-purple-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>၅။ အဆောင်ပစ္စည်း ဝယ်ယူမှု (စိတ်ကြိုက်)</span>
              </div>
            </div>

            <div className="p-3 bg-stone-900/90 border border-purple-500/40 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-stone-300 block">
                + အဆောင်ပစ္စည်း အမည်၊ ဈေးနှုန်းနှင့် အရေအတွက် တိုက်ရိုက်ထည့်ပါ:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="အဆောင်ပစ္စည်း အမည်..."
                    value={customAmuletName}
                    onChange={(e) => setCustomAmuletName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 focus:border-purple-400 rounded-xl text-stone-100 text-xs font-medium"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="ဈေးနှုန်း (ကျပ်)..."
                    value={customAmuletPrice}
                    onChange={(e) => setCustomAmuletPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-stone-950 border border-stone-700 focus:border-purple-400 rounded-xl text-amber-300 text-xs text-right font-mono font-bold"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="အရေအတွက်"
                    value={customAmuletQty}
                    onChange={(e) => setCustomAmuletQty(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 px-2 py-1.5 bg-stone-950 border border-stone-700 focus:border-purple-400 rounded-xl text-stone-100 text-xs text-center font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmulet}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ထည့်မည်</span>
                  </button>
                </div>
              </div>
            </div>

            {amulets.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-purple-300 block">
                  ဝယ်ယူထားသော အဆောင်ပစ္စည်းများ ({amulets.length} မျိုး):
                </span>
                <div className="space-y-1">
                  {amulets.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs"
                    >
                      <div className="flex-1 mr-2">
                        <span className="font-bold text-stone-200">{a.name}</span>
                        <span className="text-stone-400 text-[11px] ml-2 font-mono">
                          ({formatMMK(a.price)} × {a.quantity})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-300 font-mono">
                          {formatMMK(a.price * a.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmulet(idx)}
                          className="p-1 text-stone-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic p-0.5">
                အဆောင်ပစ္စည်း ဝယ်ယူမှု မရှိသေးပါ။
              </p>
            )}
          </div>

          {/* Section 6: Payment Details */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>၆။ ကျသင့်ငွေနှင့် ငွေပေးချေမှု</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 block">စုစုပေါင်း ကျသင့်ငွေ</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                  {formatMMK(totalAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 mb-1">ငွေပေးချေမှု အခြေအနေ</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => {
                    const ps = e.target.value as any;
                    setPaymentStatus(ps);
                    if (ps === 'paid') setPaidAmount(totalAmount);
                    else if (ps === 'unpaid') setPaidAmount(0);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer font-medium"
                >
                  <option value="paid">✅ အပြည့်ရှင်းပြီး (Paid Full)</option>
                  <option value="partial">⏳ စရန်ငွေပေးချေထား (Partial)</option>
                  <option value="unpaid">❌ မရှင်းရသေးပါ (Unpaid)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ပေးချေပြီး ငွေပမာဏ (ကျပ်)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">ငွေပေးချေသည့် နည်းလမ်း</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer"
                >
                  <option value="kpay">KPay (KBZPay)</option>
                  <option value="wave">WavePay</option>
                  <option value="cash">လက်ငင်းငွေသား (Cash)</option>
                  <option value="ayapay">AYAPay</option>
                  <option value="cbbank">CB Pay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">အထွေထွေ မှတ်ချက် (Notes)</label>
              <input
                type="text"
                placeholder="အခြား မှတ်ချက်များ..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              မလုပ်တော့ပါ (Cancel)
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'ပြင်ဆင်မှု သိမ်းဆည်းမည်' : 'စာရင်း အတည်ပြု သိမ်းဆည်းမည်'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
