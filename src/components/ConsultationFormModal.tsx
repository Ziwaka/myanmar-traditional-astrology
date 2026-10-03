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
  Layers
} from 'lucide-react';
import { DatePickerInput } from './DatePickerInput';
import { TimePickerInput } from './TimePickerInput';
import { 
  AmuletCatalogItem, 
  YatraCatalogItem,
  ConsultationRecord, 
  NavawinCountType, 
  PurchasedAmulet 
} from '../types';
import { 
  formatMMK, 
  formatDateDDMMYYYY
} from '../utils/astrology';
import { 
  loadSavedCustomServices, 
  rememberCustomService, 
  loadSavedCustomYatras, 
  rememberCustomYatra,
  searchCustomerHistoryProfiles,
  CustomerHistoryProfile
} from '../utils/storage';
import { loadUserAccounts, getCurrentUser, UserAccount } from '../utils/auth';
import { subscribeToUsers } from '../utils/firebase';

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ConsultationRecord) => void;
  onDirectPrint?: (record: ConsultationRecord) => void;
  initialData?: ConsultationRecord | null;
  amuletsCatalog?: AmuletCatalogItem[];
  yatraCatalog?: YatraCatalogItem[];
  nextId: string;
  allRecords?: ConsultationRecord[];
}

export const ConsultationFormModal: React.FC<ConsultationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDirectPrint,
  initialData,
  amuletsCatalog = [],
  yatraCatalog = [],
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
  const [consultationMode, setConsultationMode] = useState<'in_person' | 'remote'>(
    initialData?.consultationMode || 'in_person'
  );
  
  // Social Account fields
  const [socialPlatform, setSocialPlatform] = useState<'viber' | 'facebook' | 'tiktok' | 'telegram' | 'phone' | 'other'>(
    initialData?.socialPlatform || 'viber'
  );
  const [socialAccountName, setSocialAccountName] = useState(initialData?.socialAccountName || '');

  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialData?.gender || 'female');

  // Current user & all user accounts for assignment (astrologers / readers)
  const [allUserAccounts, setAllUserAccounts] = useState<UserAccount[]>(loadUserAccounts());
  const activeUser = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    setAllUserAccounts(loadUserAccounts());
    const unsub = subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setAllUserAccounts(cloudUsers);
      }
    });
    return () => unsub();
  }, [isOpen]);

  // Booking & status
  const [bookingDate, setBookingDate] = useState(initialData?.bookingDate || todayStr);
  const [readingDateTime, setReadingDateTime] = useState(initialData?.readingDateTime || nowDateTimeStr);
  const [assignedUserId, setAssignedUserId] = useState<string>(
    initialData?.assignedUserId || activeUser.id
  );
  const [assignedUserName, setAssignedUserName] = useState<string>(
    initialData?.assignedUserName || activeUser.name
  );
  const [status, setStatus] = useState<'scheduled' | 'yatra_ongoing' | 'completed' | 'cancelled'>(initialData?.status || 'completed');
  const [taskDone, setTaskDone] = useState<boolean>(initialData?.taskDone || true);

  // Custom Services with Memory
  const [savedServices] = useState(loadSavedCustomServices());
  const [serviceName, setServiceName] = useState<string>(
    initialData?.serviceCategory || 'ဗေဒင်ဟောစာတမ်း'
  );
  const [serviceFee, setServiceFee] = useState<number>(
    initialData?.serviceFee !== undefined ? initialData.serviceFee : 30000
  );

  // Custom Yatra with Memory & Catalog link
  const [savedYatras] = useState(loadSavedCustomYatras());
  const [yatraEnabled, setYatraEnabled] = useState<boolean>(
    initialData?.yatraEnabled !== undefined 
      ? initialData.yatraEnabled 
      : !!(initialData?.yatraName || (initialData?.yatraFee && initialData.yatraFee > 0) || (initialData?.navawinType && initialData.navawinType !== 'none'))
  );
  const [customYatraName, setCustomYatraName] = useState<string>(initialData?.yatraName || '');
  const [yatraFee, setYatraFee] = useState<number>(
    initialData?.yatraFee !== undefined 
      ? (initialData.yatraQty && initialData.yatraQty > 0 ? Math.round(initialData.yatraFee / initialData.yatraQty) : initialData.yatraFee)
      : (initialData?.navawinFee || 30000)
  );
  const [yatraQty, setYatraQty] = useState<number>(initialData?.yatraQty || 1);

  // Pure Custom Amulets POS & Catalog link
  const [amulets, setAmulets] = useState<PurchasedAmulet[]>(initialData?.amulets || []);
  const [customAmuletName, setCustomAmuletName] = useState('');
  const [customAmuletPrice, setCustomAmuletPrice] = useState<number | ''>(15000);
  const [customAmuletQty, setCustomAmuletQty] = useState<number>(1);

  // Payment
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>(initialData?.paymentStatus || 'paid');
  const [paidAmount, setPaidAmount] = useState<number>(initialData?.paidAmount || 20000);
  const [paidDate, setPaidDate] = useState<string>(initialData?.paidDate || initialData?.bookingDate || todayStr);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>(initialData?.paymentMethod || 'kpay');

  // Notes
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const amuletsTotal = useMemo(() => {
    return amulets.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [amulets]);

  const totalAmount = useMemo(() => {
    const sFee = Number(serviceFee) || 0;
    const yFee = yatraEnabled ? (Number(yatraFee) || 0) * (Number(yatraQty) || 1) : 0;
    return sFee + yFee + amuletsTotal;
  }, [serviceFee, yatraEnabled, yatraFee, yatraQty, amuletsTotal]);

  useEffect(() => {
    if (!initialData && paymentStatus === 'paid') {
      setPaidAmount(totalAmount);
    }
  }, [totalAmount, paymentStatus, initialData]);

  const handleSelectExistingCustomer = (profile: CustomerHistoryProfile) => {
    setCustomerName(profile.customerName || '');
    setPhone(profile.phone || '');
    if (profile.gender) setGender(profile.gender);

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

  const handleAddCatalogAmulet = (item: AmuletCatalogItem) => {
    const existingIndex = amulets.findIndex(a => a.name.toLowerCase() === item.name.toLowerCase());
    if (existingIndex >= 0) {
      const updated = [...amulets];
      updated[existingIndex].quantity += 1;
      setAmulets(updated);
    } else {
      setAmulets([
        ...amulets,
        {
          id: `amulet-${Date.now()}-${item.id}`,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: 1,
        }
      ]);
    }
  };

  const handleRemoveAmulet = (index: number) => {
    setAmulets(amulets.filter((_, i) => i !== index));
  };

  const handleUpdateAmuletQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...amulets];
    updated[index].quantity = newQty;
    setAmulets(updated);
  };

  const buildCurrentRecord = (): ConsultationRecord => {
    const cleanServiceName = serviceName.trim() || 'ဗေဒင်ဝန်ဆောင်မှု';
    const finalYatraName = customYatraName.trim() || (yatraEnabled ? 'ယတြာ အစီအရင်' : '');
    const legacyNavawin: NavawinCountType = yatraEnabled ? '3_times' : 'none';

    const sFee = Number(serviceFee) || 0;
    const yFee = yatraEnabled ? (Number(yatraFee) || 0) * (Number(yatraQty) || 1) : 0;
    const aFee = amuletsTotal || 0;
    const finalTotal = totalAmount > 0 ? totalAmount : (sFee + yFee + aFee);
    const finalPaid = paymentStatus === 'paid' ? finalTotal : (paymentStatus === 'unpaid' ? 0 : (Number(paidAmount) || 0));

    return {
      id: id || nextId,
      customerName: customerName.trim() || 'မမေးသူ (အမည်မသိ)',
      phone: phone.trim() || '-',
      consultationMode,
      socialPlatform: consultationMode === 'remote' ? socialPlatform : undefined,
      socialAccountName: consultationMode === 'remote' ? socialAccountName.trim() : undefined,
      gender,
      birthDayOfWeek: initialData?.birthDayOfWeek,
      birthDate: initialData?.birthDate,
      myanmarBirthDate: initialData?.myanmarBirthDate,
      birthTime: initialData?.birthTime,
      age: initialData?.age,
      mahabote: initialData?.mahabote,
      bookingDate,
      readingDateTime,
      serviceCategory: cleanServiceName as any,
      serviceFee: sFee,
      
      yatraEnabled,
      yatraName: finalYatraName,
      yatraFee: yFee,
      yatraQty,
      navawinType: legacyNavawin,
      navawinFee: yFee,

      amulets,
      amuletsTotal: aFee,

      totalAmount: finalTotal,
      paidAmount: finalPaid,
      paidDate: paymentStatus === 'unpaid' ? undefined : (paidDate || bookingDate || todayStr),
      paymentStatus,
      paymentMethod,
      
      status,
      taskDone: status === 'completed',
      predictions: initialData?.predictions || '',
      yatraInstructions: initialData?.yatraInstructions || '',
      notes,
      
      assignedUserId,
      assignedUserName,
      recordedBy: initialData?.recordedBy || activeUser.name || 'ကောင်တာ ၁',
      updatedBy: activeUser.name || 'ကောင်တာ ၁',
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
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
      }}
    >
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-stone-850 p-3.5 sm:p-4 border-b border-stone-800 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-amber-200 truncate leading-tight">
                  {isEditing ? 'ဗေဒင်မေးသူ အချက်အလက် ပြင်ဆင်ခြင်း' : 'ဗေဒင်မေးသူ အသစ် စာရင်းသွင်းခြင်း'}
                </h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border shrink-0 ${
                  isOnline 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50' 
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                }`}>
                  {isOnline ? <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" /> : <WifiOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />}
                  <span>{isOnline ? 'Cloud Sync' : 'Offline'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintClick}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] sm:text-xs shadow transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">🖨️ Print / PDF</span>
              <span className="xs:hidden">PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              title="ပိတ်ရန်"
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
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-200">{cust.customerName || 'အမည်မသိ'}</span>
                            <span className="text-[10px] text-amber-400/80">({cust.birthDayOfWeek})</span>
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono mt-0.5 flex items-center gap-2">
                            <span className="text-amber-400/90 font-semibold">ID: {cust.allRecords[0]?.customerId || cust.allRecords[0]?.id}</span>
                            <span>•</span>
                            <span>ဖုန်း: {cust.phone || 'ဖုန်းမပါ'}</span>
                          </div>
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

            {/* 1. Name */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-200">
                  မေးသူ အမည် <span className="text-stone-500 font-normal text-xs">(မထည့်ဘဲ ကျော်နိုင်ပါသည်)</span>
                </label>
                <input
                  type="text"
                  placeholder="မမေသူ (သို့) မထည့်ပါ"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:border-amber-500 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-200">ကျား/မ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer shadow-inner"
                >
                  <option value="female">အမျိုးသမီး (Female)</option>
                  <option value="male">အမျိုးသား (Male)</option>
                  <option value="other">အခြား</option>
                </select>
              </div>
            </div>

            {/* Consultation Mode: In Person vs Remote (Default: In Person) */}
            <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>မေးမြန်းမည့် ပုံစံ (Consultation Mode):</span>
                <span className="text-[11px] text-amber-400 font-normal">
                  {consultationMode === 'in_person' ? '🏢 လူကိုယ်တိုင် လာရောက်မေးမြန်းမည်' : '🌐 အွန်လိုင်း / အဝေးမှ မေးမြန်းမည်'}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationMode('in_person')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                    consultationMode === 'in_person'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 border-amber-400 shadow-md ring-2 ring-amber-400/40 font-extrabold scale-[1.01]'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border-stone-800'
                  }`}
                >
                  <span>🏢 In Person</span>
                  <span className="hidden sm:inline text-xs font-semibold">(လူကိုယ်တိုင်)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationMode('remote')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer border ${
                    consultationMode === 'remote'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-extrabold scale-[1.01]'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border-stone-800'
                  }`}
                >
                  <span>🌐 Remote</span>
                  <span className="hidden sm:inline text-xs font-semibold">(အွန်လိုင်း)</span>
                </button>
              </div>
            </div>

            {/* Social Account Info - ONLY VISIBLE WHEN REMOTE IS SELECTED */}
            {consultationMode === 'remote' && (
              <div className="p-3.5 bg-blue-950/30 border border-blue-500/40 rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
                <div className="flex items-center justify-between">
                  <label className="text-blue-300 font-bold text-xs flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Online / Social Account အချက်အလက် (Remote)</span>
                  </label>
                  <span className="text-[10px] text-blue-400">Viber / Facebook / Telegram စသဖြင့်</span>
                </div>

                <div className="space-y-2">
                  <select
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value as any)}
                    style={{ fontSize: '16px' }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-blue-500/40 text-blue-200 font-semibold focus:border-blue-400 cursor-pointer"
                  >
                    <option value="viber">📱 Viber</option>
                    <option value="facebook">📘 Facebook</option>
                    <option value="telegram">✈️ Telegram</option>
                    <option value="tiktok">🎵 TikTok</option>
                    <option value="phone">📞 Phone Call</option>
                    <option value="other">🌐 အခြား</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Social Account Name / ID / Phone ရိုက်ထည့်ပါ (ဥပမာ- Phyo Phyo / @user123)..."
                    value={socialAccountName}
                    onChange={(e) => setSocialAccountName(e.target.value)}
                    style={{ fontSize: '16px' }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-blue-400 font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Booking, Schedule & Status */}
          <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-stone-800 pb-2">
              <Calendar className="w-4 h-4" />
              <span>၂။ ဘိုကင်ရက်စွဲ၊ ဟောကြားမည့် အချိန်နှင့် လုပ်ငန်းစဉ်အခြေအနေ</span>
            </div>

            <div className="space-y-3">
              {/* Booking Date with Calendar Picker */}
              <DatePickerInput
                label="ဘိုကင်တင်သည့်နေ့"
                required
                value={bookingDate}
                onChange={(newVal) => setBookingDate(newVal)}
              />

              {/* Reading Date & Time */}
              <DatePickerInput
                label="ဗေဒင်ဟောမည့် နေ့ရက်"
                required
                value={readingDateTime ? readingDateTime.slice(0, 10) : todayStr}
                onChange={(newVal) => setReadingDateTime(newVal)}
              />

              <TimePickerInput
                label="ဗေဒင်ဟောမည့် အချိန် (Time)"
                required
                value={readingDateTime ? readingDateTime.slice(11) : '10:00 AM'}
                onChange={(newTime) => {
                  const currDate = readingDateTime ? readingDateTime.slice(0, 10) : todayStr;
                  setReadingDateTime(`${currDate} ${newTime}`);
                }}
              />

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">
                  ဟောကြားမည့်သူ / ရက်ချိန်းတာဝန်ခံ (Assigned Astrologer):
                </label>
                <select
                  value={assignedUserId}
                  onChange={(e) => {
                    const uId = e.target.value;
                    setAssignedUserId(uId);
                    const found = allUserAccounts.find(u => u.id === uId);
                    setAssignedUserName(found ? found.name : activeUser.name);
                  }}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-300 font-semibold focus:border-amber-400 cursor-pointer shadow-inner"
                >
                  {allUserAccounts.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.avatarEmoji} {u.name} ({u.title || u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">လုပ်ငန်းစဉ် အခြေအနေ (Status)</label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setStatus(newStatus);
                    setTaskDone(newStatus === 'completed');
                  }}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-amber-500/50 text-stone-100 font-semibold focus:border-amber-400 cursor-pointer shadow-inner"
                >
                  <option value="completed">✅ ဟောကြားပြီးစီး (Completed)</option>
                  <option value="yatra_ongoing">⏳ ယတြာလုပ်ဆဲ (Ongoing Yatra)</option>
                  <option value="scheduled">📅 ရက်ချိန်းစောင့် (Scheduled)</option>
                  <option value="cancelled">❌ ပယ်ဖျက် (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Purely Custom Service Name & ဉာဏ်ပူဇော်ခ */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-stone-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Calculator className="w-4 h-4" />
                <span>၃။ ဗေဒင်ဝန်ဆောင်မှု အမည်နှင့် ဉာဏ်ပူဇော်ခ</span>
              </div>
            </div>

            {/* ဗေဒင်ဝန်ဆောင်မှု အမည် */}
            <div className="space-y-1.5">
              <label className="block text-stone-300 font-semibold text-xs">
                ဗေဒင်ဝန်ဆောင်မှု အမည်
              </label>
              <input
                type="text"
                placeholder="ဗေဒင်ဟောစာတမ်း"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                style={{ fontSize: '15px' }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-amber-500/40 text-stone-100 focus:border-amber-400 font-medium text-xs sm:text-sm"
                required
              />
            </div>

            {/* ဉာဏ်ပူဇော်ခ (၃၀၀၀၀ / ၅၀၀၀၀ Tick Boxes) */}
            <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-stone-200 font-bold block text-xs sm:text-sm">ဉာဏ်ပူဇော်ခ (ကျပ်)</span>
                  <span className="text-[10px] text-stone-500">Tick Box နှိပ်၍ အလွယ်ရွေးနိုင်ပါသည်</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Number(e.target.value))}
                    style={{ fontSize: '16px' }}
                    className="w-32 px-3 py-1.5 text-right rounded-xl bg-stone-950 border border-amber-500/50 text-amber-300 font-mono font-bold focus:border-amber-400 text-sm"
                  />
                  <span className="text-stone-400 text-xs font-semibold">ကျပ်</span>
                </div>
              </div>

              {/* Tick Boxes for 30,000 and 50,000 */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <label
                  onClick={() => setServiceFee(30000)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition cursor-pointer select-none ${
                    serviceFee === 30000
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/40 shadow-sm'
                      : 'bg-stone-950/60 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={serviceFee === 30000}
                    onChange={() => setServiceFee(30000)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs sm:text-sm font-semibold">
                    ၃၀,၀၀၀ ကျပ်
                  </span>
                </label>

                <label
                  onClick={() => setServiceFee(50000)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition cursor-pointer select-none ${
                    serviceFee === 50000
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/40 shadow-sm'
                      : 'bg-stone-950/60 border-stone-700 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={serviceFee === 50000}
                    onChange={() => setServiceFee(50000)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs sm:text-sm font-semibold">
                    ၅၀,၀၀၀ ကျပ်
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 4: Purely Custom Yatra with Yatra Catalog Integration */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-amber-500/30 space-y-3 bg-gradient-to-br from-stone-850 to-amber-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>၄။ ယတြာ ပြုလုပ်ဆောင်ရွက်မှု (စိတ်ကြိုက် / Catalog မှ ရွေးချယ်နိုင်သည်)</span>
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

            {/* 1-Click Yatra Catalog Quick Select Chips */}
            {yatraCatalog && yatraCatalog.length > 0 && (
              <div className="p-2.5 bg-stone-900/90 rounded-xl border border-amber-500/30 space-y-1.5 mt-1">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>ယတြာ ကတ်တလောက်မှ ရွေးချယ်ရန် (နှိပ်ပါက ယတြာအလိုအလျောက် ပွင့်သွားမည်):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {yatraCatalog.map((y) => (
                    <button
                      key={y.id}
                      type="button"
                      onClick={() => {
                        setYatraEnabled(true);
                        setCustomYatraName(y.name);
                        setYatraFee(y.defaultFee);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs border transition cursor-pointer active:scale-95 ${
                        yatraEnabled && customYatraName === y.name
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow'
                          : 'bg-stone-950 hover:bg-stone-800 text-stone-200 border-amber-500/40'
                      }`}
                    >
                      + {y.name} ({formatMMK(y.defaultFee)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {yatraEnabled ? (
              <div className="space-y-2.5 pt-0.5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 space-y-1">
                    <label className="block text-stone-300 font-medium text-xs">
                      ယတြာ အမည် (ရိုက်ထည့်ပါ သို့မဟုတ် အပေါ်မှ ရွေးပါ)
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
                      <span className="text-stone-300 font-medium block text-xs">ယတြာ ၁ ကြိမ်စာ စရိတ် / အလှူငွေ (ကျပ်)</span>
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

                {/* Yatra Quantity Multiplier selector */}
                <div className="bg-stone-900/90 p-3 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-stone-300 font-semibold text-xs block">
                      ယတြာ ပြုလုပ်မည့် အကြိမ် အရေအတွက် (Frequency)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[1, 2, 3, 5, 9].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setYatraQty(q)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition border cursor-pointer ${
                            yatraQty === q
                              ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                          }`}
                        >
                          {q} ကြိမ်
                        </button>
                      ))}
                      <div className="flex items-center gap-1 ml-1">
                        <span className="text-xs text-stone-500 font-medium">စိတ်ကြိုက်:</span>
                        <input
                          type="number"
                          min="1"
                          value={yatraQty}
                          onChange={(e) => setYatraQty(Math.max(1, Number(e.target.value) || 1))}
                          className="w-14 px-2 py-1 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-center text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/80 flex items-center justify-between sm:block gap-4">
                    <span className="text-stone-400 text-xs font-medium block">စုစုပေါင်း ယတြာစရိတ်:</span>
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-mono mt-0.5">
                      {formatMMK(yatraFee * yatraQty)}
                    </div>
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

          {/* Section 5: PURE CUSTOM AMULETS POS with Amulet Catalog Integration */}
          <div className="bg-stone-850 p-3.5 rounded-2xl border border-purple-500/30 space-y-3 bg-gradient-to-br from-stone-850 to-purple-950/20">
            <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>၅။ အဆောင်ပစ္စည်း ဝယ်ယူမှု (စိတ်ကြိုက် / Catalog မှ ရွေးချယ်နိုင်သည်)</span>
              </div>
            </div>

            {/* 1-Click Amulet Catalog Quick Select Chips */}
            {amuletsCatalog && amuletsCatalog.length > 0 && (
              <div className="p-2.5 bg-stone-900/90 rounded-xl border border-purple-500/30 space-y-1.5">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                  <span>အဆောင် Catalog မှ ထည့်သွင်းရန် (နှိပ်လိုက်သည်နှင့် အရေအတွက် တိုးသွားပါမည်):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {amuletsCatalog.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddCatalogAmulet(item)}
                      className="px-2.5 py-1 rounded-xl text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/40 font-medium transition cursor-pointer active:scale-95 shadow"
                    >
                      + {item.name} ({formatMMK(item.price)})
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs"
                    >
                      <div className="flex-1 mr-2 min-w-0">
                        <div className="font-bold text-stone-200 truncate">{a.name}</div>
                        <span className="text-stone-400 text-[10px] font-mono">
                          {formatMMK(a.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Quantity Incrementor/Decrementor */}
                        <div className="flex items-center bg-stone-950 rounded-lg p-0.5 border border-stone-800 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateAmuletQty(idx, a.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200 text-xs font-bold transition cursor-pointer"
                            title="၁ ခု လျှော့ရန်"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold font-mono text-xs text-stone-300">
                            {a.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateAmuletQty(idx, a.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-stone-200 text-xs font-bold transition cursor-pointer"
                            title="၁ ခု တိုးရန်"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-amber-300 font-mono w-20 text-right">
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

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">ငွေပေးချေမှု အခြေအနေ</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => {
                    const ps = e.target.value as any;
                    setPaymentStatus(ps);
                    if (ps === 'paid') setPaidAmount(totalAmount);
                    else if (ps === 'unpaid') setPaidAmount(0);
                  }}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer font-semibold shadow-inner"
                >
                  <option value="paid">✅ အပြည့်ရှင်းပြီး (Paid Full)</option>
                  <option value="partial">⏳ စရန်ငွေပေးချေထား (Partial)</option>
                  <option value="unpaid">❌ မရှင်းရသေးပါ (Unpaid)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">ပေးချေပြီး ငွေပမာဏ (ကျပ်)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold focus:border-amber-500 shadow-inner"
                />
              </div>

              {/* Payment Date (ငွေရှင်းသည့်ရက်) */}
              {paymentStatus !== 'unpaid' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-stone-900/90 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>ငွေရှင်းသည့်နေ့ရက် (Payment Date)</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaidDate(todayStr)}
                        className="px-2 py-0.5 rounded text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
                      >
                        ယနေ့
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaidDate(bookingDate)}
                        className="px-2 py-0.5 rounded text-[11px] bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 cursor-pointer"
                      >
                        ဘိုကင်ရက်
                      </button>
                    </div>
                  </div>
                  <DatePickerInput
                    label=""
                    value={paidDate}
                    onChange={(d) => setPaidDate(d)}
                  />
                  <p className="text-[10px] text-stone-400">
                    * ဤရက်စွဲသည် Daily Balance နှင့် လစဉ်ငွေဝင်စာရင်းတွင် ငွေဝင်အဖြစ် တိုက်ရိုက်သက်ရောက်ပါမည်။
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">ငွေပေးချေသည့် နည်းလမ်း</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 cursor-pointer shadow-inner"
                >
                  <option value="kpay">KPay (KBZPay)</option>
                  <option value="wave">WavePay</option>
                  <option value="cash">လက်ငင်းငွေသား (Cash)</option>
                  <option value="ayapay">AYAPay</option>
                  <option value="cbbank">CB Pay</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-400">အထွေထွေ မှတ်ချက် (Notes)</label>
                <input
                  type="text"
                  placeholder="အခြား မှတ်ချက်များ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-amber-500 shadow-inner"
                />
              </div>
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
