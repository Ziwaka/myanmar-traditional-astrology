import React, { useState, useMemo } from 'react';
import { 
  History, 
  X, 
  User, 
  Phone, 
  Sparkles, 
  Calendar, 
  Clock, 
  Crown, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  ShoppingBag, 
  Flame, 
  CreditCard,
  FileText,
  UserCheck
} from 'lucide-react';
import { ConsultationRecord } from '../types';
import { formatMMK, formatDateDDMMYYYY, SERVICE_CATEGORIES } from '../utils/astrology';

interface CustomerHistoryQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRecord?: ConsultationRecord | null;
  allRecords: ConsultationRecord[];
  onOpenConsultation: (consultationId: string) => void;
  onBookNewForCustomer?: (customerName: string, phone: string) => void;
}

export const CustomerHistoryQuickViewModal: React.FC<CustomerHistoryQuickViewModalProps> = ({
  isOpen,
  onClose,
  targetRecord,
  allRecords,
  onOpenConsultation,
  onBookNewForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRecordIds, setExpandedRecordIds] = useState<Record<string, boolean>>({});

  if (!isOpen || !targetRecord) return null;

  const targetPhone = targetRecord.phone ? targetRecord.phone.replace(/[^0-9]/g, '') : '';
  const targetCustId = targetRecord.customerId ? targetRecord.customerId.trim().toLowerCase() : '';
  const targetName = targetRecord.customerName ? targetRecord.customerName.trim().toLowerCase() : '';

  // Find all consultation records belonging to this specific customer
  const customerHistoryRecords = useMemo(() => {
    return allRecords.filter((r) => {
      const rPhone = r.phone ? r.phone.replace(/[^0-9]/g, '') : '';
      const rCustId = r.customerId ? r.customerId.trim().toLowerCase() : '';
      const rName = r.customerName ? r.customerName.trim().toLowerCase() : '';

      // Match by phone if valid
      if (targetPhone && targetPhone.length >= 6 && rPhone === targetPhone) {
        return true;
      }
      // Match by customerId if exists
      if (targetCustId && rCustId === targetCustId) {
        return true;
      }
      // Match by exact name if not generic
      if (targetName && targetName.length >= 2 && targetName !== 'မမေးသူ (အမည်မသိ)' && rName === targetName) {
        return true;
      }
      return r.id === targetRecord.id;
    }).sort((a, b) => {
      const dateA = new Date(a.readingDateTime || a.bookingDate || a.createdAt || '').getTime();
      const dateB = new Date(b.readingDateTime || b.bookingDate || b.createdAt || '').getTime();
      return dateB - dateA; // Most recent first
    });
  }, [allRecords, targetRecord, targetPhone, targetCustId, targetName]);

  // Aggregate customer summary stats
  const stats = useMemo(() => {
    const totalVisits = customerHistoryRecords.length;
    let totalSpent = 0;
    let totalYatras = 0;
    let totalAmuletsCount = 0;

    customerHistoryRecords.forEach((r) => {
      const sFee = Number(r.serviceFee) || 0;
      const yFee = (r.yatraEnabled || r.yatraName) ? (Number(r.yatraFee || r.navawinFee) || 0) : 0;
      const aFee = Number(r.amuletsTotal) || (r.amulets ? r.amulets.reduce((sum, a) => sum + (a.price * a.quantity), 0) : 0);
      const totalAmount = (typeof r.totalAmount === 'number' && r.totalAmount > 0) ? r.totalAmount : (sFee + yFee + aFee);
      totalSpent += totalAmount;

      if (r.yatraEnabled || r.yatraName || (r.navawinType && r.navawinType !== 'none')) {
        totalYatras += 1;
      }
      if (r.amulets && r.amulets.length > 0) {
        totalAmuletsCount += r.amulets.reduce((sum, a) => sum + a.quantity, 0);
      }
    });

    const isVip = totalVisits >= 3;
    const firstVisit = customerHistoryRecords[customerHistoryRecords.length - 1];
    const lastVisit = customerHistoryRecords[0];

    return {
      totalVisits,
      totalSpent,
      avgSpent: totalVisits > 0 ? Math.round(totalSpent / totalVisits) : 0,
      totalYatras,
      totalAmuletsCount,
      isVip,
      firstVisitDate: firstVisit ? (firstVisit.readingDateTime || firstVisit.bookingDate) : '',
      lastVisitDate: lastVisit ? (lastVisit.readingDateTime || lastVisit.bookingDate) : '',
    };
  }, [customerHistoryRecords]);

  // Filter records based on in-modal search query
  const filteredTimeline = useMemo(() => {
    if (!searchQuery.trim()) return customerHistoryRecords;
    const q = searchQuery.toLowerCase();
    return customerHistoryRecords.filter((r) => {
      return (
        r.id.toLowerCase().includes(q) ||
        (r.serviceCategory && r.serviceCategory.toLowerCase().includes(q)) ||
        (r.predictions && r.predictions.toLowerCase().includes(q)) ||
        (r.yatraName && r.yatraName.toLowerCase().includes(q)) ||
        (r.yatraInstructions && r.yatraInstructions.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        (r.assignedUserName && r.assignedUserName.toLowerCase().includes(q))
      );
    });
  }, [customerHistoryRecords, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedRecordIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
      }}
    >
      <div className="w-full max-w-3xl bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] overflow-hidden my-auto">
        
        {/* Modal Header with Customer Overview */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-stone-100 truncate">
                  {targetRecord.customerName || 'အမည်မဖော်ပြထားသူ'}
                </h2>
                {stats.isVip ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 flex items-center gap-1 shadow">
                    <Crown className="w-3 h-3" /> Royal VIP ({stats.totalVisits} ကြိမ်)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> မေးဖူးသူ ({stats.totalVisits} ကြိမ်)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                {targetRecord.phone && targetRecord.phone !== '-' && (
                  <span className="flex items-center gap-1 font-mono text-amber-300/90">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {targetRecord.phone}
                  </span>
                )}
                {targetRecord.birthDayOfWeek && (
                  <span>နေ့နံ: <strong className="text-stone-300">{targetRecord.birthDayOfWeek}</strong></span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onBookNewForCustomer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNewForCustomer(targetRecord.customerName, targetRecord.phone);
                }}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ရက်ချိန်းသစ်ယူမည်</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-stone-850 border-b border-stone-800/80 shrink-0 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">မေးမြန်းမှု စုစုပေါင်း</span>
            <span className="text-base font-extrabold text-amber-300 font-mono">{stats.totalVisits} ကြိမ်</span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">စုစုပေါင်း ပူဇော်ငွေ</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">{formatMMK(stats.totalSpent)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">ယတြာ ယူခဲ့မှု</span>
            <span className="text-base font-extrabold text-amber-400 font-mono">{stats.totalYatras} ကြိမ်</span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
            <span className="text-[11px] text-stone-400 block">နောက်ဆုံး လာရောက်သည့်ရက်</span>
            <span className="text-xs font-bold text-stone-200 font-mono truncate block mt-0.5">
              {stats.lastVisitDate ? formatDateDDMMYYYY(stats.lastVisitDate) : '-'}
            </span>
          </div>
        </div>

        {/* Search / Filter past readings */}
        <div className="px-4 py-2.5 bg-stone-950/60 border-b border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ဟောချက်များ၊ ယတြာများ၊ ဝန်ဆောင်မှု သို့မဟုတ် မှတ်ချက်များထဲမှ ရှာရန်..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <span className="text-xs text-stone-400 font-medium shrink-0">
            တွေ့ရှိမှတ်တမ်း: <strong className="text-amber-300">{filteredTimeline.length}</strong> ခု
          </span>
        </div>

        {/* Timeline of Past Consultations */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredTimeline.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <History className="w-12 h-12 mx-auto text-stone-600 mb-2" />
              <p className="font-semibold text-sm">ယခင်မှတ်တမ်း ရှာမတွေ့ပါ</p>
            </div>
          ) : (
            filteredTimeline.map((rec, idx) => {
              const isCurrent = rec.id === targetRecord.id;
              const isExpanded = expandedRecordIds[rec.id] !== false; // Default expanded
              const serviceInfo = SERVICE_CATEGORIES.find((s) => s.key === rec.serviceCategory);
              const serviceTitle = serviceInfo?.label || rec.serviceCategory || 'ဗေဒင်ဝန်ဆောင်မှု';

              return (
                <div
                  key={rec.id}
                  className={`rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500/10 via-stone-900 to-amber-500/5 border-amber-500/60 shadow-lg'
                      : 'bg-stone-850 hover:bg-stone-800/90 border-stone-700/70'
                  }`}
                >
                  {/* Record Header Strip */}
                  <div 
                    onClick={() => toggleExpand(rec.id)}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-stone-950 text-amber-300 font-mono font-bold text-xs flex items-center justify-center border border-stone-800 shrink-0">
                        #{customerHistoryRecords.length - idx}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-stone-950 px-2 py-0.5 rounded-md border border-stone-800">
                            {rec.id}
                          </span>
                          <span className="font-bold text-sm text-stone-100 truncate">
                            {serviceTitle}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-stone-950">
                              လက်ရှိ စာရင်း
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 font-mono">
                          <span className="flex items-center gap-1 text-stone-300">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {formatDateDDMMYYYY(rec.readingDateTime || rec.bookingDate)}
                          </span>
                          {rec.assignedUserName && (
                            <span>• ဟောသူ: <strong className="text-amber-300">{rec.assignedUserName}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-xs sm:text-sm text-emerald-400">
                        {formatMMK(rec.totalAmount || rec.serviceFee)}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-stone-400 hover:text-stone-200"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body with Full Predictions, Yatra & Notes */}
                  {isExpanded && (
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4 pt-1 border-t border-stone-800/80 space-y-3 text-xs">
                      
                      {/* 1. Predictions & Reading Dossier */}
                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-bold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>ပေးလိုက်သော ဟောချက်များနှင့် အကြံပြုချက်များ (Predictions):</span>
                          </span>
                          {rec.predictions && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(rec.predictions, `pred-${rec.id}`);
                              }}
                              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-amber-300 transition"
                            >
                              {copiedId === `pred-${rec.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === `pred-${rec.id}` ? 'ကူးယူပြီး' : 'Copy'}</span>
                            </button>
                          )}
                        </div>
                        <p className="text-stone-200 whitespace-pre-wrap leading-relaxed font-sans bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">
                          {rec.predictions || 'ဟောချက် မှတ်တမ်း မထည့်သွင်းထားပါ'}
                        </p>
                      </div>

                      {/* 2. Yatra & Rituals */}
                      {(rec.yatraEnabled || rec.yatraName || rec.yatraInstructions || (rec.yatraFee && rec.yatraFee > 0)) && (
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 font-bold flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-amber-400" />
                              <span>ယတြာ အစီအရင်: {rec.yatraName || 'နဝင်းယတြာ'}</span>
                            </span>
                            <span className="font-mono text-amber-300 font-semibold">
                              {formatMMK(rec.yatraFee || rec.navawinFee || 0)}
                            </span>
                          </div>
                          {rec.yatraInstructions && (
                            <p className="text-stone-300 whitespace-pre-wrap text-[11px] bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                              <strong>ညွှန်ကြားချက်: </strong> {rec.yatraInstructions}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 3. Purchased Amulets */}
                      {rec.amulets && rec.amulets.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                          <span className="text-purple-300 font-bold flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                            <span>ဝယ်ယူခဲ့သော အဆောင်ပစ္စည်းများ ({rec.amulets.length} မျိုး):</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {rec.amulets.map((am, aIdx) => (
                              <span key={aIdx} className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
                                {am.name} ({am.quantity} ခု) - <strong className="text-purple-300 font-mono">{formatMMK(am.price * am.quantity)}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Astrologer Private Notes */}
                      {rec.notes && (
                        <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-300">
                          <strong className="text-stone-400 block mb-0.5">ဆရာ့မှတ်ချက်:</strong>
                          <span>{rec.notes}</span>
                        </div>
                      )}

                      {/* Bottom Footer Actions inside item */}
                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/80 text-[11px]">
                        <span className="text-stone-400">
                          ငွေရှင်းမှု: <strong className={rec.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}>{rec.paymentStatus === 'paid' ? 'ရှင်းပြီး' : 'မရှင်းရသေး'}</strong> ({rec.paymentMethod?.toUpperCase()})
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenConsultation(rec.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold border border-stone-700 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>အပြည့်အစုံ ဖွင့်မည်</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-400">
            ✨ စာရင်းသွင်းထားသော မေးမှတ်တမ်းနှင့် ဟောချက်များအားလုံးကို ဤနေရာတွင် အလွယ်တကူ ပြန်လည်ကြည့်ရှုနိုင်ပါသည်
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold cursor-pointer"
          >
            ပိတ်မည်
          </button>
        </div>

      </div>
    </div>
  );
};
