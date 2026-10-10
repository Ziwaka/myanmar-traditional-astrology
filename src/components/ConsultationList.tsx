import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  Printer, 
  Trash2, 
  Sparkles, 
  ShoppingBag, 
  UserCheck, 
  Plus,
  Globe,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  History,
  Crown
} from 'lucide-react';
import { ConsultationRecord, ConsultationStatus } from '../types';
import { formatMMK, formatDateDDMMYYYY, getRecordPaymentDate } from '../utils/astrology';
import { detectDuplicateConflicts } from '../utils/notifications';
import { CustomerHistoryQuickViewModal } from './CustomerHistoryQuickViewModal';

interface ConsultationListProps {
  records: ConsultationRecord[];
  onSelectRecord: (record: ConsultationRecord) => void;
  onEditRecord: (record: ConsultationRecord) => void;
  onPrintRecord: (record: ConsultationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onToggleTaskDone: (id: string) => void;
  onOpenNewConsultation: () => void;
}

export const getRecordTotalAmount = (r: ConsultationRecord): number => {
  if (typeof r.totalAmount === 'number' && r.totalAmount > 0) {
    return r.totalAmount;
  }
  const sFee = Number(r.serviceFee) || 0;
  const yFee = (r.yatraEnabled || r.yatraName) ? (Number(r.yatraFee || r.navawinFee) || 0) : 0;
  const aFee = Number(r.amuletsTotal) || (r.amulets ? r.amulets.reduce((s, a) => s + (a.price * a.quantity), 0) : 0);
  return sFee + yFee + aFee;
};

export const getRecordPaidAmount = (r: ConsultationRecord): number => {
  const total = getRecordTotalAmount(r);
  if (r.paymentStatus === 'paid' || !r.paymentStatus) {
    return total;
  }
  if (r.paymentStatus === 'partial') {
    return typeof r.paidAmount === 'number' ? r.paidAmount : total;
  }
  if (typeof r.paidAmount === 'number' && r.paidAmount > 0) {
    return r.paidAmount;
  }
  if (r.taskDone || r.status === 'completed') {
    return total;
  }
  return 0;
};

export const ConsultationList: React.FC<ConsultationListProps> = ({
  records,
  onSelectRecord,
  onEditRecord,
  onPrintRecord,
  onDeleteRecord,
  onToggleTaskDone,
  onOpenNewConsultation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ConsultationStatus | 'today' | 'duplicate'>('all');
  const [yatraFilter, setYatraFilter] = useState<'all' | 'with_yatra' | 'no_yatra'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'in_person' | 'remote'>('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [expandedTimes, setExpandedTimes] = useState<Record<string, boolean>>({});
  const [quickHistoryTarget, setQuickHistoryTarget] = useState<ConsultationRecord | null>(null);

  const toggleDate = (dateKey: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateKey]: prev[dateKey] !== false ? false : true
    }));
  };

  const toggleTime = (timeCompKey: string) => {
    setExpandedTimes(prev => ({
      ...prev,
      [timeCompKey]: prev[timeCompKey] !== false ? false : true
    }));
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // Duplicate Conflicts Detection
  const duplicateConflicts = useMemo(() => {
    return detectDuplicateConflicts(records);
  }, [records]);

  const duplicateRecordIds = useMemo(() => {
    const idSet = new Set<string>();
    duplicateConflicts.forEach(c => {
      idSet.add(c.primaryRecord.id);
      c.conflictingRecords.forEach(cr => idSet.add(cr.id));
    });
    return idSet;
  }, [duplicateConflicts]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search term filter
      const matchesSearch =
        rec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.socialAccountName && rec.socialAccountName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.predictions && rec.predictions.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.yatraName && rec.yatraName.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'duplicate') {
        if (!duplicateRecordIds.has(rec.id)) return false;
      } else if (statusFilter === 'today') {
        const recDate = rec.readingDateTime.slice(0, 10);
        if (recDate !== todayStr) return false;
      } else if (statusFilter !== 'all') {
        if (rec.status !== statusFilter) return false;
      }

      // Yatra filter
      const hasYatra = !!(rec.yatraEnabled || rec.yatraName || (rec.yatraFee && rec.yatraFee > 0) || (rec.navawinType && rec.navawinType !== 'none'));
      if (yatraFilter === 'with_yatra' && !hasYatra) return false;
      if (yatraFilter === 'no_yatra' && hasYatra) return false;

      // Mode filter (In Person vs Remote)
      if (modeFilter !== 'all') {
        const actualMode = rec.consultationMode || 'in_person';
        if (actualMode !== modeFilter) return false;
      }

      return true;
    });
  }, [records, searchTerm, statusFilter, yatraFilter, modeFilter, todayStr, duplicateRecordIds]);

  // Quick metrics
  const stats = useMemo(() => {
    const total = records.length;
    const completed = records.filter(r => r.taskDone || r.status === 'completed').length;
    const ongoingYatra = records.filter(r => r.status === 'yatra_ongoing').length;
    const yatraCount = records.filter(r => r.yatraEnabled || r.yatraName || (r.yatraFee && r.yatraFee > 0) || r.navawinType !== 'none').length;
    
    let totalCollectedRevenue = 0;
    let totalBilledRevenue = 0;
    let paidCount = 0;

    records.forEach(r => {
      const recTotal = getRecordTotalAmount(r);
      const recPaid = getRecordPaidAmount(r);
      totalBilledRevenue += recTotal;
      totalCollectedRevenue += recPaid;
      if (recPaid >= recTotal && recTotal > 0) {
        paidCount++;
      }
    });

    const totalPendingRevenue = Math.max(0, totalBilledRevenue - totalCollectedRevenue);

    return { 
      total, 
      completed, 
      ongoingYatra, 
      yatraCount, 
      totalCollectedRevenue,
      totalBilledRevenue,
      totalPendingRevenue,
      paidCount
    };
  }, [records]);

  // Fast lookup map for customer visit counts (by customerId or name)
  const customerVisitCounts = useMemo(() => {
    const counts = new Map<string, number>();

    records.forEach((r) => {
      const cleanCustId = r.customerId ? r.customerId.trim().toLowerCase() : '';
      const cleanName = r.customerName ? r.customerName.trim().toLowerCase() : '';

      if (cleanCustId) {
        counts.set(`cust:${cleanCustId}`, (counts.get(`cust:${cleanCustId}`) || 0) + 1);
      } else if (cleanName) {
        counts.set(`name:${cleanName}`, (counts.get(`name:${cleanName}`) || 0) + 1);
      }
    });

    return counts;
  }, [records]);

  const getCustomerVisitCount = (r: ConsultationRecord): number => {
    const cleanCustId = r.customerId ? r.customerId.trim().toLowerCase() : '';
    const cleanName = r.customerName ? r.customerName.trim().toLowerCase() : '';

    if (cleanCustId) {
      return customerVisitCounts.get(`cust:${cleanCustId}`) || 1;
    }
    if (cleanName) {
      return customerVisitCounts.get(`name:${cleanName}`) || 1;
    }
    return 1;
  };

  const getStatusBadge = (status: ConsultationStatus, taskDone: boolean) => {
    if (taskDone || status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>ပြီးစီး</span>
        </span>
      );
    }
    if (status === 'yatra_ongoing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold animate-pulse">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>ယတြာလုပ်ဆဲ</span>
        </span>
      );
    }
    if (status === 'scheduled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
          <Calendar className="w-3 h-3 text-blue-400" />
          <span>ရက်ချိန်းစောင့်</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-stone-700 text-stone-400">
        ပယ်ဖျက်
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full min-w-0">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400">ဗေဒင်မေးသူ စုစုပေါင်း</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-amber-200">{stats.total} ဦး</span>
            <span className="text-[10px] sm:text-xs text-emerald-400">ပြီးစီး {stats.completed}</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400">ယတြာ ယူသူ (စုစုပေါင်း)</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-amber-400">{stats.yatraCount} ဦး</span>
            <span className="text-[10px] sm:text-xs text-amber-300/80">ယတြာ {stats.ongoingYatra}</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400">ယတြာပြုလုပ်ဆဲ</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-blue-400">{stats.ongoingYatra} ဦး</span>
            <span className="text-[10px] sm:text-xs text-stone-400">စောင့်ကြည့်ဆဲ</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[11px] sm:text-xs text-emerald-400 font-semibold">ငွေဝင် စုစုပေါင်း (ရရှိပြီး)</p>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono shrink-0">
              {records.filter(r => r.paymentStatus === 'paid' || (r.paidAmount && r.paidAmount > 0)).length} ခု
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
              {stats.totalCollectedRevenue.toLocaleString()} ကျပ်
            </span>
          </div>
          <div className="text-[10px] text-stone-400 mt-1 flex flex-wrap items-center justify-between gap-1">
            <span>(မပြီးသေးသော်လည်း ရှင်းပြီးငွေ အပါ)</span>
            {stats.totalPendingRevenue > 0 && (
              <span className="text-rose-400/90 font-mono font-semibold">ကျန် {stats.totalPendingRevenue.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & New Record */}
      <div className="bg-stone-850 p-3 sm:p-4 rounded-2xl border border-stone-800 space-y-2.5 shadow w-full min-w-0">
        
        {/* Top Row: Search Input & New Record Button */}
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="အမည်၊ ID ဖြင့် ရှာရန်..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={onOpenNewConsultation}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-md transition active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-stone-950" />
            <span>+ အသစ်ထည့်</span>
          </button>
        </div>

        {/* Filter Dropdowns Row: 3 columns grid on mobile so labels never get cut off */}
        <div className="grid grid-cols-3 gap-2 w-full text-xs">
          <select
            value={statusFilter}
            onChange={(e) => {
              const val = e.target.value as any;
              setStatusFilter(val);
              if (val === 'completed') {
                setActiveTab('completed');
              } else if (val === 'scheduled' || val === 'today') {
                setActiveTab('pending');
              }
            }}
            className="w-full bg-stone-900 text-stone-200 border border-stone-700 rounded-xl px-2 py-2 focus:outline-none focus:border-amber-500 cursor-pointer text-xs font-semibold"
            title="အခြေအနေအလိုက် စစ်ထုတ်ရန်"
          >
            <option value="all">အခြေအနေ (အားလုံး)</option>
            <option value="today">ယနေ့ ရက်ချိန်းများ</option>
            <option value="scheduled">ရက်ချိန်းစောင့်</option>
            <option value="yatra_ongoing">ယတြာလုပ်ဆဲ</option>
            <option value="completed">ပြီးစီး</option>
            {duplicateConflicts.length > 0 && (
              <option value="duplicate">⚠️ ထပ်နေမှုများ ({duplicateConflicts.length})</option>
            )}
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as any)}
            className="w-full bg-stone-900 text-stone-200 border border-stone-700 rounded-xl px-2 py-2 focus:outline-none focus:border-amber-500 cursor-pointer text-xs font-semibold"
            title="မေးမြန်းမှု ပုံစံ"
          >
            <option value="all">မေးမြန်းမှု (အားလုံး)</option>
            <option value="in_person">🏢 လူကိုယ်တိုင်</option>
            <option value="remote">🌐 အွန်လိုင်း</option>
          </select>

          <select
            value={yatraFilter}
            onChange={(e) => setYatraFilter(e.target.value as any)}
            className="w-full bg-stone-900 text-stone-200 border border-stone-700 rounded-xl px-2 py-2 focus:outline-none focus:border-amber-500 cursor-pointer text-xs font-semibold"
            title="ယတြာ အခြေအနေ"
          >
            <option value="all">ယတြာ (အားလုံး)</option>
            <option value="with_yatra">ယတြာ ပါသူများ</option>
            <option value="no_yatra">ယတြာ မပါသူများ</option>
          </select>
        </div>
      </div>

      {/* Split filteredRecords into pending and completed groups */}
      {(() => {
        const pendingRecords = filteredRecords.filter(rec => !rec.taskDone && rec.status !== 'completed');
        const completedRecords = filteredRecords.filter(rec => rec.taskDone || rec.status === 'completed');

        const renderRecordCard = (rec: ConsultationRecord) => {
          const isToday = rec.readingDateTime.slice(0, 10) === todayStr;
          const visitCount = getCustomerVisitCount(rec);
          const serviceName = rec.serviceCategory || 'ဗေဒင်ဝန်ဆောင်မှု';
          const hasYatra = !!(rec.yatraEnabled || rec.yatraName || (rec.yatraFee && rec.yatraFee > 0) || (rec.navawinType && rec.navawinType !== 'none'));
          const hasAmulets = !!(rec.amulets && rec.amulets.length > 0);
          const recTotal = getRecordTotalAmount(rec);
          const recPaid = getRecordPaidAmount(rec);
          const isFullyPaid = recPaid >= recTotal && recTotal > 0;
          const isPartial = recPaid > 0 && recPaid < recTotal;

          return (
            <div
              key={rec.id}
              className={`bg-stone-850 rounded-2xl border transition-all duration-150 p-4 sm:p-4.5 flex flex-col justify-between gap-3 shadow-md hover:shadow-xl hover:border-amber-500/50 relative overflow-hidden ${
                rec.taskDone ? 'border-stone-800/80 bg-stone-900/60' : 'border-stone-800'
              } ${isToday ? 'border-l-4 border-l-amber-500 ring-1 ring-amber-500/20' : ''}`}
            >
              {/* Top Row: Task checkbox + Customer Name + Status Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Task Done Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleTaskDone(rec.id)}
                      title={rec.taskDone ? 'ပြီးစီးပြီး (အမှတ်အသားဖြုတ်ရန် နှိပ်ပါ)' : 'ပြီးစီးကြောင်း အမှတ်အသားပြုရန်'}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition shrink-0 cursor-pointer ${
                        rec.taskDone
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-stone-600 hover:border-amber-400 bg-stone-900 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Customer Name */}
                    <div className="min-w-0 flex-1">
                      <h3 
                        onClick={() => onSelectRecord(rec)}
                        className="font-bold text-base sm:text-lg text-stone-100 hover:text-amber-300 transition truncate cursor-pointer"
                        title={rec.customerName || 'မမေးသူ (အမည်မသိ)'}
                      >
                        {rec.customerName || 'မမေးသူ (အမည်မသိ)'}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {getStatusBadge(rec.status, rec.taskDone)}
                  </div>
                </div>

                {/* Badges Row: ID, Mode, Frequent Client */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {/* ID */}
                  <span className="font-mono text-amber-400 font-bold bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                    {rec.id}
                  </span>

                  {/* Consultation Mode Badge */}
                  {rec.consultationMode === 'remote' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/90 text-blue-300 border border-blue-800/80 font-semibold text-[11px]">
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Remote (အွန်လိုင်း)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900 text-amber-300/90 border border-stone-700/80 font-medium text-[11px]">
                      <span>🏢 In Person</span>
                    </span>
                  )}

                  {/* Visit Count Badge - Clickable to open Quick History */}
                  {visitCount > 3 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickHistoryTarget(rec);
                      }}
                      title="ယခင် မေးမြန်းခဲ့သော ဟောချက်များနှင့် မှတ်တမ်းများ အမြန်ကြည့်ရန်"
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold cursor-pointer transition"
                    >
                      <Crown className="w-2.5 h-2.5 text-purple-400" />
                      <span>VIP ({visitCount} ကြိမ်) • မှတ်တမ်း</span>
                    </button>
                  ) : visitCount > 1 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickHistoryTarget(rec);
                      }}
                      title="ယခင် မေးမြန်းခဲ့သော ဟောချက်များနှင့် မှတ်တမ်းများ အမြန်ကြည့်ရန်"
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[11px] font-medium cursor-pointer transition"
                    >
                      <History className="w-3.5 h-3.5 text-blue-400" />
                      <span>{visitCount} ကြိမ်မေး • မှတ်တမ်း</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickHistoryTarget(rec);
                      }}
                      title="ဤဧည့်သည်၏ မေးမှတ်တမ်းနှင့် ဟောချက်များ အမြန်ကြည့်ရန်"
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 text-[11px] transition cursor-pointer"
                    >
                      <History className="w-3 h-3 text-amber-400/70" />
                      <span>မေးမှတ်တမ်း</span>
                    </button>
                  )}

                  {/* Duplicate Conflict Badge */}
                  {duplicateRecordIds.has(rec.id) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[11px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>ရက်ချိန်းထပ်နေသည်</span>
                    </span>
                  )}

                  {isToday && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px]">
                      ယနေ့
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Info Section */}
              <div className="bg-stone-900/70 rounded-xl p-3 border border-stone-800/80 space-y-2 text-xs">
                {/* Social Account */}
                {rec.socialAccountName ? (
                  <div className="flex flex-wrap items-center justify-end gap-1 text-stone-300">
                    <div className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[11px]">
                      {rec.socialPlatform || 'Social'}: {rec.socialAccountName}
                    </div>
                  </div>
                ) : null}

                {/* Reading Date & Time, Booking Date & Payment Date */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-stone-300 pt-1 border-t border-stone-800/60">
                  <div className="flex items-center gap-1.5 font-medium text-stone-200">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>ဟောမည့်ရက်: <strong className="text-amber-300">{formatDateDDMMYYYY(rec.readingDateTime)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400 flex-wrap">
                    <span>ဘိုကင်: {formatDateDDMMYYYY(rec.bookingDate)}</span>
                    {recPaid > 0 && (
                      <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        ငွေရှင်း: {formatDateDDMMYYYY(getRecordPaymentDate(rec))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service, Yatra & Amulets Row */}
                <div className="space-y-1.5 pt-1 border-t border-stone-800/60">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="font-semibold text-stone-200">{serviceName}</span>
                    <span className="font-mono text-stone-400">{formatMMK(rec.serviceFee)}</span>
                  </div>

                  {hasYatra && (
                    <div className="flex items-center justify-between text-amber-300 bg-amber-950/30 px-2 py-1 rounded-lg border border-amber-500/20">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{rec.yatraName || 'ယတြာ အစီအရင်'}</span>
                      </span>
                      {(rec.yatraFee && rec.yatraFee > 0) || (rec.navawinFee && rec.navawinFee > 0) ? (
                        <span className="font-mono text-amber-400 shrink-0 ml-2">
                          +{formatMMK(rec.yatraFee || rec.navawinFee)}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {hasAmulets && (
                    <div className="flex items-center justify-between text-purple-300 bg-purple-950/20 px-2 py-1 rounded-lg border border-purple-500/20">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <ShoppingBag className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">{rec.amulets!.map(a => a.name).join(', ')}</span>
                      </span>
                      <span className="font-mono text-purple-300 shrink-0 ml-2">
                        +{formatMMK(rec.amuletsTotal || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row: Total & Payment + Touch-friendly Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-stone-800/80">
                {/* Total & Payment Badge */}
                <div className="flex items-center gap-2">
                  <div className="font-bold text-emerald-400 font-mono text-base">
                    {formatMMK(recTotal)}
                  </div>
                  {isFullyPaid ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                      ရှင်းပြီး
                    </span>
                  ) : isPartial ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-semibold">
                      စရန် {formatMMK(recPaid)} (ကျန် {formatMMK(recTotal - recPaid)})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-semibold">
                      မရှင်းရသေး
                    </span>
                  )}
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Quick History Button */}
                  <button
                    onClick={() => setQuickHistoryTarget(rec)}
                    title="ဧည့်သည်၏ ယခင်မေးမှတ်တမ်း & ဟောချက်များ အမြန်ကြည့်ရန် (Customer History Quick View)"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs border border-amber-500/30 transition cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>မှတ်တမ်း</span>
                  </button>

                  {/* Print / PDF Button */}
                  <button
                    onClick={() => onPrintRecord(rec)}
                    title="ပြေစာ/ဟောစာတမ်း ပရင့်ထုတ်ရန် / PDF / PNG ဒေါင်းလုဒ်ဆွဲရန်"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / ပြေစာ</span>
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => onSelectRecord(rec)}
                    title="ဟောချက်နှင့် အချက်အလက် အပြည့်အစုံ ကြည့်ရန်"
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition cursor-pointer border border-stone-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEditRecord(rec)}
                    title="ပြင်ဆင်ရန်"
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-blue-300 transition cursor-pointer border border-stone-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (window.confirm(`"${rec.customerName}" ၏ ဗေဒင်မှတ်တမ်းကို ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                        onDeleteRecord(rec.id);
                      }
                    }}
                    title="ဖျက်ရန်"
                    className="p-2 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition cursor-pointer border border-stone-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        };

        const groupSortAndSubgroupRecords = (recordsToGroup: ConsultationRecord[], isCompleted: boolean) => {
          const dateGroupsMap: Record<string, Record<string, ConsultationRecord[]>> = {};

          recordsToGroup.forEach(rec => {
            let dateStr = 'no-date';
            let timeStr = 'no-time';

            if (rec.readingDateTime) {
              const clean = rec.readingDateTime.trim();
              const parts = clean.split(/T|\s+/);
              if (parts[0]) {
                dateStr = parts[0];
              }
              if (parts[1]) {
                timeStr = parts[1].slice(0, 5); // "HH:MM"
                if (parts[2]) {
                  timeStr += ' ' + parts[2]; // e.g. "AM" or "PM"
                }
              }
            } else if (rec.bookingDate) {
              const clean = rec.bookingDate.trim();
              const parts = clean.split(/T|\s+/);
              if (parts[0]) {
                dateStr = parts[0];
              }
            }

            if (!dateGroupsMap[dateStr]) {
              dateGroupsMap[dateStr] = {};
            }
            if (!dateGroupsMap[dateStr][timeStr]) {
              dateGroupsMap[dateStr][timeStr] = [];
            }
            dateGroupsMap[dateStr][timeStr].push(rec);
          });

          // Sort Date Keys
          const sortedDateKeys = Object.keys(dateGroupsMap).sort((a, b) => {
            if (a === 'no-date') return 1;
            if (b === 'no-date') return -1;
            if (isCompleted) {
              return b.localeCompare(a); // latest date first
            } else {
              return a.localeCompare(b); // earliest date first
            }
          });

          return sortedDateKeys.map(dateKey => {
            const timeMap = dateGroupsMap[dateKey];
            
            // Sort Time Keys
            const sortedTimeKeys = Object.keys(timeMap).sort((a, b) => {
              if (a === 'no-time') return 1;
              if (b === 'no-time') return -1;
              return a.localeCompare(b); // earliest time first
            });

            let totalDateRecordsCount = 0;
            const timeGroups = sortedTimeKeys.map(timeKey => {
              const timeRecords = timeMap[timeKey];
              totalDateRecordsCount += timeRecords.length;

              // Sort records inside the time slot by ID
              timeRecords.sort((a, b) => a.id.localeCompare(b.id));

              let displayTime = 'အချိန် မသတ်မှတ်ရသေး';
              if (timeKey !== 'no-time') {
                displayTime = `${timeKey} နာရီ`;
              }

              return {
                timeKey,
                displayTime,
                records: timeRecords
              };
            });

            let displayDate = 'ရက်စွဲ မသတ်မှတ်ရသေး';
            if (dateKey !== 'no-date') {
              const [y, m, d] = dateKey.split('-');
              displayDate = `${d} / ${m} / ${y}`;
            }

            return {
              dateKey,
              displayDate,
              recordsCount: totalDateRecordsCount,
              timeGroups
            };
          });
        };

        if (filteredRecords.length === 0) {
          return (
            <div className="bg-stone-850 rounded-2xl border border-stone-800 p-8 sm:p-12 text-center text-stone-500 space-y-3">
              <p className="text-base sm:text-lg text-stone-400 font-medium">ရှာဖွေမှုနှင့် ကိုက်ညီသော ဗေဒင်မှတ်တမ်း မရှိသေးပါ။</p>
              <button
                onClick={onOpenNewConsultation}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-semibold hover:bg-amber-500/30 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> ပထမဆုံး စာရင်းသွင်းမည်
              </button>
            </div>
          );
        }

        const pendingGroups = groupSortAndSubgroupRecords(pendingRecords, false);
        const completedGroups = groupSortAndSubgroupRecords(completedRecords, true);

        return (
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Side-by-Side 2 Tabs: Scheduled vs Done */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1.5 bg-stone-900/90 rounded-2xl border border-stone-800 shadow-md">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-2 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none border ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 border-amber-400 shadow-lg ring-2 ring-amber-400/30 scale-[1.01]'
                    : 'bg-stone-850/70 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border-stone-800'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${activeTab === 'pending' ? 'bg-stone-950 animate-pulse' : 'bg-amber-500'}`} />
                <span className="truncate">Scheduled</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono font-black text-xs ${
                    activeTab === 'pending'
                      ? 'bg-stone-950 text-amber-300 border border-stone-900 shadow-sm'
                      : 'bg-stone-900 text-amber-400 border border-stone-700/80'
                  }`}
                >
                  {pendingRecords.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2.5 py-3 px-2 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none border ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-400 shadow-lg ring-2 ring-emerald-400/30 scale-[1.01]'
                    : 'bg-stone-850/70 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border-stone-800'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${activeTab === 'completed' ? 'text-white' : 'text-emerald-400'}`} />
                <span className="truncate">Done</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono font-black text-xs ${
                    activeTab === 'completed'
                      ? 'bg-stone-950 text-emerald-300 border border-stone-900 shadow-sm'
                      : 'bg-stone-900 text-emerald-400 border border-stone-700/80'
                  }`}
                >
                  {completedRecords.length}
                </span>
              </button>
            </div>

            {/* Tab 1: Scheduled (Default, in Expand Mode) */}
            {activeTab === 'pending' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-xs font-bold text-amber-300">
                      Scheduled စာရင်း ({pendingRecords.length} ဦး)
                    </span>
                  </div>
                  {pendingGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allExp = pendingGroups.every(g => expandedDates[g.dateKey] !== false);
                        const next: Record<string, boolean> = { ...expandedDates };
                        pendingGroups.forEach(g => { next[g.dateKey] = !allExp; });
                        setExpandedDates(next);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-700/80 cursor-pointer font-medium transition"
                    >
                      {pendingGroups.every(g => expandedDates[g.dateKey] !== false)
                        ? 'ရက်စွဲအားလုံး သိမ်းမည်'
                        : 'ရက်စွဲအားလုံး ဖြန့်မည်'}
                    </button>
                  )}
                </div>

                {pendingRecords.length === 0 ? (
                  <div className="bg-stone-850 rounded-2xl border border-stone-800 p-8 text-center text-stone-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <p className="text-sm font-semibold text-stone-300">Scheduled မရှိပါ (အားလုံး ပြီးစီးပါပြီ)</p>
                    <p className="text-xs text-stone-500">Done စာရင်းကို ကြည့်ရှုလိုပါက အပေါ်ရှိ "Done" Tab ကို နှိပ်ပါ</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingGroups.map(group => {
                      const isDateExpanded = expandedDates[group.dateKey] !== false; // Default Expanded!
                      return (
                        <div key={group.dateKey} className="space-y-3 bg-stone-900/30 p-3 sm:p-4 rounded-2xl border border-stone-800/60">
                          {/* Date Sub-header Button */}
                          <button
                            type="button"
                            onClick={() => toggleDate(group.dateKey)}
                            className="flex items-center justify-between w-full px-3 py-2.5 bg-stone-900 hover:bg-stone-850 border border-stone-800/80 rounded-xl cursor-pointer transition select-none text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-xs font-bold text-amber-200/90">{group.displayDate}</span>
                              <span className="px-1.5 py-0.2 rounded bg-stone-950 text-[10px] text-stone-400 font-bold font-mono">
                                {group.recordsCount} ဦး
                              </span>
                            </div>
                            <div className="text-stone-500">
                              {isDateExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>
                          
                          {isDateExpanded && (
                            <div className="space-y-4 pl-3 border-l border-amber-500/10 ml-2">
                              {group.timeGroups.map(timeGroup => {
                                const timeCompKey = `${group.dateKey}_${timeGroup.timeKey}`;
                                const isTimeExpanded = expandedTimes[timeCompKey] !== false;
                                return (
                                  <div key={timeGroup.timeKey} className="space-y-2.5">
                                    {/* Time Slot Collapsible Header */}
                                    <button
                                      type="button"
                                      onClick={() => toggleTime(timeCompKey)}
                                      className="flex items-center justify-between w-full sm:w-auto gap-2 px-2.5 py-1.5 bg-stone-900/60 hover:bg-stone-900 border border-stone-800/80 rounded-lg text-left cursor-pointer transition select-none"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-xs font-bold text-stone-300">{timeGroup.displayTime}</span>
                                        <span className="px-1.5 py-0.2 rounded bg-stone-950 text-[10px] text-amber-400 font-bold font-mono">
                                          {timeGroup.records.length} ဦး
                                        </span>
                                      </div>
                                      <div className="text-stone-500 ml-1">
                                        {isTimeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </div>
                                    </button>

                                    {isTimeExpanded && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0 pt-1">
                                        {timeGroup.records.map(renderRecordCard)}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Done (Opened on demand) */}
            {activeTab === 'completed' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Done စာရင်း ({completedRecords.length} ဦး)
                    </span>
                  </div>
                  {completedGroups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allExp = completedGroups.every(g => expandedDates[g.dateKey] !== false);
                        const next: Record<string, boolean> = { ...expandedDates };
                        completedGroups.forEach(g => { next[g.dateKey] = !allExp; });
                        setExpandedDates(next);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-700/80 cursor-pointer font-medium transition"
                    >
                      {completedGroups.every(g => expandedDates[g.dateKey] !== false)
                        ? 'ရက်စွဲအားလုံး သိမ်းမည်'
                        : 'ရက်စွဲအားလုံး ဖြန့်မည်'}
                    </button>
                  )}
                </div>

                {completedRecords.length === 0 ? (
                  <div className="bg-stone-850 rounded-2xl border border-stone-800 p-8 text-center text-stone-400 space-y-2">
                    <p className="text-sm font-semibold text-stone-300">ဟောပြီးစီးသူ မရှိသေးပါ</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedGroups.map(group => {
                      const isDateExpanded = expandedDates[group.dateKey] !== false; // Default Expanded!
                      return (
                        <div key={group.dateKey} className="space-y-3 bg-stone-900/30 p-3 sm:p-4 rounded-2xl border border-stone-800/60">
                          {/* Date Sub-header Button */}
                          <button
                            type="button"
                            onClick={() => toggleDate(group.dateKey)}
                            className="flex items-center justify-between w-full px-3 py-2.5 bg-stone-900 hover:bg-stone-850 border border-stone-800/80 rounded-xl cursor-pointer transition select-none text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-bold text-emerald-200/90">{group.displayDate}</span>
                              <span className="px-1.5 py-0.2 rounded bg-stone-950 text-[10px] text-stone-400 font-bold font-mono">
                                {group.recordsCount} ဦး
                              </span>
                            </div>
                            <div className="text-stone-500">
                              {isDateExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>
                          
                          {isDateExpanded && (
                            <div className="space-y-4 pl-3 border-l border-emerald-500/10 ml-2">
                              {group.timeGroups.map(timeGroup => {
                                const timeCompKey = `${group.dateKey}_${timeGroup.timeKey}`;
                                const isTimeExpanded = expandedTimes[timeCompKey] !== false;
                                return (
                                  <div key={timeGroup.timeKey} className="space-y-2.5">
                                    {/* Time Slot Collapsible Header */}
                                    <button
                                      type="button"
                                      onClick={() => toggleTime(timeCompKey)}
                                      className="flex items-center justify-between w-full sm:w-auto gap-2 px-2.5 py-1.5 bg-stone-900/60 hover:bg-stone-900 border border-stone-800/80 rounded-lg text-left cursor-pointer transition select-none"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="text-xs font-bold text-stone-300">{timeGroup.displayTime}</span>
                                        <span className="px-1.5 py-0.2 rounded bg-stone-950 text-[10px] text-emerald-400 font-bold font-mono">
                                          {timeGroup.records.length} ဦး
                                        </span>
                                      </div>
                                      <div className="text-stone-500 ml-1">
                                        {isTimeExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </div>
                                    </button>

                                    {isTimeExpanded && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0 pt-1">
                                        {timeGroup.records.map(renderRecordCard)}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Quick View Customer Consultation History Modal */}
      <CustomerHistoryQuickViewModal
        isOpen={!!quickHistoryTarget}
        onClose={() => setQuickHistoryTarget(null)}
        targetRecord={quickHistoryTarget}
        allRecords={records}
        onOpenConsultation={(cId) => {
          setQuickHistoryTarget(null);
          const found = records.find(r => r.id === cId);
          if (found) onSelectRecord(found);
        }}
        onBookNewForCustomer={() => {
          setQuickHistoryTarget(null);
          onOpenNewConsultation();
        }}
      />
    </div>
  );
};
