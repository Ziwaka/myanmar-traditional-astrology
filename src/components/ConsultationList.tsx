import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Printer, 
  Trash2, 
  Sparkles, 
  ShoppingBag, 
  Phone, 
  UserCheck, 
  Plus
} from 'lucide-react';
import { ConsultationRecord, ConsultationStatus } from '../types';
import { formatMMK, formatDateDDMMYYYY, NAWAWIN_OPTIONS } from '../utils/astrology';

interface ConsultationListProps {
  records: ConsultationRecord[];
  onSelectRecord: (record: ConsultationRecord) => void;
  onEditRecord: (record: ConsultationRecord) => void;
  onPrintRecord: (record: ConsultationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onToggleTaskDone: (id: string) => void;
  onOpenNewConsultation: () => void;
}

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
  const [statusFilter, setStatusFilter] = useState<'all' | ConsultationStatus | 'today'>('all');
  const [navawinFilter, setNavawinFilter] = useState<'all' | 'with_navawin' | '3_times'>('all');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search term filter
      const matchesSearch =
        rec.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.phone.includes(searchTerm) ||
        (rec.notes && rec.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (rec.predictions && rec.predictions.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'today') {
        const recDate = rec.readingDateTime.slice(0, 10);
        if (recDate !== todayStr) return false;
      } else if (statusFilter !== 'all') {
        if (rec.status !== statusFilter) return false;
      }

      // Navawin filter
      if (navawinFilter === 'with_navawin') {
        if (rec.navawinType === 'none') return false;
      } else if (navawinFilter === '3_times') {
        if (rec.navawinType !== '3_times' && rec.navawinType !== 'special') return false;
      }

      return true;
    });
  }, [records, searchTerm, statusFilter, navawinFilter, todayStr]);

  // Quick metrics
  const stats = useMemo(() => {
    const total = records.length;
    const completed = records.filter(r => r.taskDone || r.status === 'completed').length;
    const ongoingYatra = records.filter(r => r.status === 'yatra_ongoing').length;
    const yatraCount = records.filter(r => r.yatraEnabled || r.yatraName || (r.yatraFee && r.yatraFee > 0) || r.navawinType !== 'none').length;
    const totalRevenue = records.reduce((sum, r) => sum + r.totalAmount, 0);

    return { total, completed, ongoingYatra, yatraCount, totalRevenue };
  }, [records]);

  // Helper labels
  const getServiceName = (cat: string) => {
    return cat || 'ဗေဒင်ဝန်ဆောင်မှု';
  };

  const getNavawinBadge = (type: string) => {
    const found = NAWAWIN_OPTIONS.find(n => n.key === type);
    if (!found || type === 'none') {
      return <span className="text-stone-500 text-xs">- မပါ -</span>;
    }
    const color = type === '3_times' || type === 'special'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium ${color}`}>
        <Sparkles className="w-3 h-3 text-amber-400" />
        {found.label}
      </span>
    );
  };

  const getStatusBadge = (status: ConsultationStatus, taskDone: boolean) => {
    if (taskDone || status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ပြီးစီး (Done)
        </span>
      );
    }
    if (status === 'yatra_ongoing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
          <Clock className="w-3 h-3 text-amber-400" />
          ယတြာလုပ်ဆဲ
        </span>
      );
    }
    if (status === 'scheduled') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <Calendar className="w-3 h-3 text-blue-400" />
          ရက်ချိန်းစောင့်
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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0 overflow-hidden">
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full min-w-0">
        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400 truncate">ဗေဒင်မေးသူ စုစုပေါင်း</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-amber-200">{stats.total} ဦး</span>
            <span className="text-[10px] sm:text-xs text-emerald-400">ပြီးစီး {stats.completed}</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400 truncate">ယတြာ ယူသူ (စုစုပေါင်း)</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-amber-400">{stats.yatraCount} ဦး</span>
            <span className="text-[10px] sm:text-xs text-amber-300/80">ယတြာ {stats.ongoingYatra}</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400 truncate">ယတြာပြုလုပ်ဆဲ</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-xl sm:text-2xl font-bold text-blue-400">{stats.ongoingYatra} ဦး</span>
            <span className="text-[10px] sm:text-xs text-stone-400">စောင့်ကြည့်ဆဲ</span>
          </div>
        </div>

        <div className="bg-stone-850 p-3 sm:p-3.5 rounded-xl border border-stone-800 bg-gradient-to-br from-stone-900 to-stone-850 shadow-md min-w-0">
          <p className="text-[11px] sm:text-xs text-stone-400 truncate">ဝင်ငွေ စုစုပေါင်း</p>
          <div className="flex items-baseline justify-between mt-1 min-w-0">
            <span className="text-lg sm:text-xl font-bold text-emerald-400 truncate">{stats.totalRevenue.toLocaleString()} ကျပ်</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-stone-850 p-3 sm:p-4 rounded-xl border border-stone-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow w-full min-w-0">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72 lg:w-80 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="အမည်၊ ဖုန်း၊ ID ဖြင့် ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs min-w-0">
          <span className="text-stone-400 flex items-center gap-1 font-medium text-[11px] hidden sm:flex">
            <Filter className="w-3.5 h-3.5" /> စစ်ထုတ်ရန်:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 sm:flex-none bg-stone-900 text-stone-200 border border-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer text-xs min-w-0"
          >
            <option value="all">အခြေအနေ (အားလုံး)</option>
            <option value="today">ယနေ့ ရက်ချိန်းများ</option>
            <option value="scheduled">ရက်ချိန်းစောင့်</option>
            <option value="yatra_ongoing">ယတြာလုပ်ဆဲ</option>
            <option value="completed">ပြီးစီး</option>
          </select>

          <select
            value={navawinFilter}
            onChange={(e) => setNavawinFilter(e.target.value as any)}
            className="flex-1 sm:flex-none bg-stone-900 text-stone-200 border border-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer text-xs min-w-0"
          >
            <option value="all">နဝင်း (အားလုံး)</option>
            <option value="with_navawin">နဝင်းပါသူများ</option>
            <option value="3_times">၃ ကြိမ်စာ/အထူး</option>
          </select>

          <button
            onClick={onOpenNewConsultation}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition whitespace-nowrap cursor-pointer sm:ml-auto shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>အသစ်ထည့်</span>
          </button>
        </div>
      </div>

      {/* Main Table / Records List */}
      <div className="bg-stone-850 rounded-xl border border-stone-800 shadow-xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto w-full max-w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-xs border-b border-stone-800">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Task</th>
                <th className="py-3 px-3">ID & အမည်</th>
                <th className="py-3 px-3">နေ့နံ / မဟာဘုတ်</th>
                <th className="py-3 px-3">ဘိုကင် / ဟောမည့်အချိန်</th>
                <th className="py-3 px-3">ဝန်ဆောင်မှု</th>
                <th className="py-3 px-3">နဝင်းယတြာ</th>
                <th className="py-3 px-3">အဆောင်ပစ္စည်း</th>
                <th className="py-3 px-3 text-right">ကျသင့်ငွေ</th>
                <th className="py-3 px-3 text-center">အခြေအနေ</th>
                <th className="py-3 px-3 text-center">လုပ်ဆောင်ချက်</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-stone-500">
                    <p className="text-base">ရှာဖွေမှုနှင့် ကိုက်ညီသော ဗေဒင်မှတ်တမ်း မရှိသေးပါ။</p>
                    <button
                      onClick={onOpenNewConsultation}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> ပထမဆုံး စာရင်းသွင်းမည်
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isToday = rec.readingDateTime.slice(0, 10) === todayStr;
                  const formattedDateTime = rec.readingDateTime.replace('T', ' ');

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-stone-800/50 transition group ${
                        rec.taskDone ? 'bg-stone-900/40 text-stone-400' : ''
                      } ${isToday ? 'border-l-4 border-amber-500' : ''}`}
                    >
                      {/* Task Done Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleTaskDone(rec.id)}
                          title={rec.taskDone ? 'ပြီးစီးပြီး (အမှတ်အသားဖြုတ်ရန် နှိပ်ပါ)' : 'ပြီးစီးကြောင်း အမှတ်အသားပြုရန်'}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition cursor-pointer mx-auto ${
                            rec.taskDone
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-stone-600 hover:border-amber-400 bg-stone-900'
                          }`}
                        >
                          {rec.taskDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* ID & Name */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-100 group-hover:text-amber-300 flex items-center gap-1.5">
                          <span>{rec.customerName || 'မမေးသူ (အမည်မသိ)'}</span>
                          {rec.age && <span className="text-xs text-stone-400">({rec.age} နှစ်)</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400 mt-0.5">
                          <span className="font-mono text-amber-400/90 font-semibold">{rec.id}</span>
                          {rec.phone && (
                            <span className="flex items-center gap-0.5">
                              <Phone className="w-2.5 h-2.5 text-stone-500" />
                              {rec.phone}
                            </span>
                          )}
                          {rec.socialAccountName && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[10px] uppercase">
                              {rec.socialPlatform || 'Social'}: {rec.socialAccountName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Day of Week & Mahabote */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                          {rec.birthDayOfWeek} ဖွား
                        </span>
                        {rec.mahabote && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs bg-stone-800 text-stone-300 border border-stone-700">
                            {rec.mahabote} ဖွား
                          </span>
                        )}
                      </td>

                      {/* Booking & Reading Time */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-stone-200 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{formatDateDDMMYYYY(rec.readingDateTime)}</span>
                        </div>
                        <div className="text-xs text-stone-500">
                          ဘိုကင်: {formatDateDDMMYYYY(rec.bookingDate)}
                        </div>
                      </td>

                      {/* Service Category */}
                      <td className="py-3 px-3">
                        <div className="text-stone-200 font-medium">
                          {getServiceName(rec.serviceCategory)}
                        </div>
                        <div className="text-xs text-stone-400">
                          {formatMMK(rec.serviceFee)}
                        </div>
                      </td>

                      {/* Navawin Yatra */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getNavawinBadge(rec.navawinType)}
                        {rec.navawinFee > 0 && (
                          <div className="text-xs text-amber-400/80 font-mono mt-0.5">
                            +{formatMMK(rec.navawinFee)}
                          </div>
                        )}
                      </td>

                      {/* Amulets Purchased */}
                      <td className="py-3 px-3">
                        {rec.amulets && rec.amulets.length > 0 ? (
                          <div>
                            <div className="flex items-center gap-1 text-xs text-purple-300 font-medium">
                              <ShoppingBag className="w-3 h-3 text-purple-400" />
                              <span>{rec.amulets.length} မျိုး ({rec.amulets.reduce((a, b) => a + b.quantity, 0)} ခု)</span>
                            </div>
                            <div className="text-xs text-stone-400 truncate max-w-[130px]" title={rec.amulets.map(a => a.name).join(', ')}>
                              {rec.amulets.map(a => a.name).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-500 text-xs">- မဝယ်ပါ -</span>
                        )}
                      </td>

                      {/* Total Amount & Payment Status */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="font-bold text-emerald-400 font-mono text-sm">
                          {formatMMK(rec.totalAmount)}
                        </div>
                        <div className="text-xs">
                          {rec.paymentStatus === 'paid' ? (
                            <span className="text-emerald-400 font-medium">ရှင်းပြီး ({rec.paymentMethod.toUpperCase()})</span>
                          ) : rec.paymentStatus === 'partial' ? (
                            <span className="text-amber-400 font-medium">
                              စရန် {formatMMK(rec.paidAmount)} (ကျန် {formatMMK(rec.totalAmount - rec.paidAmount)})
                            </span>
                          ) : (
                            <span className="text-rose-400 font-medium">မရှင်းရသေး</span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {getStatusBadge(rec.status, rec.taskDone)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onPrintRecord(rec)}
                            title="ပြေစာ/ဟောစာတမ်း ပရင့်ထုတ်ရန် / PDF / PNG ဒေါင်းလုဒ်ဆွဲရန်"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/50 transition cursor-pointer font-bold text-xs shadow"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print / PDF</span>
                          </button>
                          <button
                            onClick={() => onSelectRecord(rec)}
                            title="ဟောချက်နှင့် ကိုယ်ရေးအချက်အလက် ကြည့်ရန်"
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditRecord(rec)}
                            title="ပြင်ဆင်ရန်"
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-blue-300 hover:text-blue-200 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`"${rec.customerName}" ၏ ဗေဒင်မှတ်တမ်းကို ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                                onDeleteRecord(rec.id);
                              }
                            }}
                            title="ဖျက်ရန်"
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
