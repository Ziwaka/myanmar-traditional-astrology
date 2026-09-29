import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  Users, 
  ShoppingBag, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  Printer, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  PieChart
} from 'lucide-react';
import { ConsultationRecord, ExpenseRecord } from '../types';
import { formatMMK, NAWAWIN_OPTIONS, SERVICE_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/astrology';

interface MonthlyReportViewProps {
  consultations: ConsultationRecord[];
  expenses: ExpenseRecord[];
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  consultations,
  expenses,
}) => {
  // Extract all distinct year-months from both datasets
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    consultations.forEach(c => {
      if (c.readingDateTime) set.add(c.readingDateTime.slice(0, 7));
      if (c.bookingDate) set.add(c.bookingDate.slice(0, 7));
    });
    expenses.forEach(e => {
      if (e.date) set.add(e.date.slice(0, 7));
    });
    // Ensure current month is present
    const cur = new Date().toISOString().slice(0, 7);
    set.add(cur);
    return Array.from(set).sort().reverse();
  }, [consultations, expenses]);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    availableMonths[0] || new Date().toISOString().slice(0, 7)
  );

  // Filter records for selected month (or all)
  const currentMonthConsultations = useMemo(() => {
    if (selectedMonth === 'all') return consultations;
    return consultations.filter(c => (c.readingDateTime || c.bookingDate).startsWith(selectedMonth));
  }, [consultations, selectedMonth]);

  const currentMonthExpenses = useMemo(() => {
    if (selectedMonth === 'all') return expenses;
    return expenses.filter(e => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Aggregate Calculations
  const metrics = useMemo(() => {
    // 1. Reading count (ဗေဒင်ဟော ဘယ်နှယောက်)
    const readingsCount = currentMonthConsultations.length;
    const completedReadings = currentMonthConsultations.filter(c => c.taskDone || c.status === 'completed').length;

    // 2. Navawin count (နဝင်း ဘယ်နှယောက်)
    const navawinRecords = currentMonthConsultations.filter(c => c.navawinType !== 'none');
    const navawinClientsCount = navawinRecords.length;
    const navawin1Count = currentMonthConsultations.filter(c => c.navawinType === '1_time').length;
    const navawin2Count = currentMonthConsultations.filter(c => c.navawinType === '2_times').length;
    const navawin3Count = currentMonthConsultations.filter(c => c.navawinType === '3_times').length;
    const navawinSpecialCount = currentMonthConsultations.filter(c => c.navawinType === 'special').length;

    // 3. Revenues
    const serviceRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.serviceFee || 0), 0);
    const navawinRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.navawinFee || 0), 0);
    const amuletsRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.amuletsTotal || 0), 0);
    const totalIncome = currentMonthConsultations.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
    const collectedIncome = currentMonthConsultations.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
    const outstandingCredit = Math.max(0, totalIncome - collectedIncome);

    // 4. Expenses (ထွက်ငွေ)
    const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // 5. Net Profit (အသားတင်အမြတ်)
    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

    return {
      readingsCount,
      completedReadings,
      navawinClientsCount,
      navawin1Count,
      navawin2Count,
      navawin3Count,
      navawinSpecialCount,
      serviceRevenue,
      navawinRevenue,
      amuletsRevenue,
      totalIncome,
      collectedIncome,
      outstandingCredit,
      totalExpense,
      netProfit,
      profitMargin,
    };
  }, [currentMonthConsultations, currentMonthExpenses]);

  // Format month name for display
  const formatMonthLabel = (m: string) => {
    if (m === 'all') return 'ကာလ အားလုံး စုစုပေါင်း';
    const [year, month] = m.split('-');
    const monthNames: Record<string, string> = {
      '01': 'ဇန်နဝါရီ',
      '02': 'ဖေဖော်ဝါရီ',
      '03': 'မတ်',
      '04': 'ဧပြီ',
      '05': 'မေ',
      '06': 'ဇွန်',
      '07': 'ဇူလိုင်',
      '08': 'သြဂုတ်',
      '09': 'စက်တင်ဘာ',
      '10': 'အောက်တိုဘာ',
      '11': 'နိုဝင်ဘာ',
      '12': 'ဒီဇင်ဘာ'
    };
    return `${year} ခုနှစ်၊ ${monthNames[month] || month} လ`;
  };

  return (
    <div className="space-y-6">
      {/* Month Selector Bar */}
      <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-200">
              {formatMonthLabel(selectedMonth)} စာရင်းဇယား အစီရင်ခံစာ
            </h2>
            <p className="text-xs text-stone-400">
              ဗေဒင်ဟောကြားမှု၊ နဝင်းယတြာဦးရေ၊ ဝင်ငွေ၊ ထွက်ငွေနှင့် အသားတင်အမြတ် သုံးသပ်ချက်
            </p>
          </div>
        </div>

        {/* Month Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-stone-400 font-medium">လ ရွေးချယ်ရန်:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-stone-900 border border-stone-700 text-amber-300 font-medium rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:border-amber-500 cursor-pointer"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
            <option value="all">စာရင်း အားလုံး (All Time)</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-400" />
            <span>ပရင့်ထုတ်ရန်</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards (The 3 Core Questions: နဝင်းဘယ်နှယောက်၊ ဗေဒင်ဟောဘယ်နှယောက်၊ ဝင်ငွေဘယ်လောက်) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Astrology Readings Count */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl relative overflow-hidden bg-gradient-to-br from-stone-850 to-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">ဗေဒင် ဟောကြားမှု</span>
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-blue-200">
              {metrics.readingsCount} <span className="text-lg font-normal text-stone-400">ဦး</span>
            </div>
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ပြီးစီးပြီး: <strong className="text-emerald-300">{metrics.completedReadings}</strong> ဦး</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex justify-between">
            <span>ဗေဒင်ဟောခ ရငွေ:</span>
            <span className="font-mono font-bold text-stone-200">{formatMMK(metrics.serviceRevenue)}</span>
          </div>
        </div>

        {/* Card 2: Navawin Yatra Count */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-amber-500/30 shadow-xl relative overflow-hidden bg-gradient-to-br from-stone-850 via-amber-950/20 to-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">နဝင်းယတြာ ဦးရေ</span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-300">
              {metrics.navawinClientsCount} <span className="text-lg font-normal text-amber-200/70">ဦး</span>
            </div>
            <div className="text-xs text-stone-300 mt-1 flex items-center gap-2 flex-wrap">
              <span>၁ ကြိမ်: <strong className="text-amber-300">{metrics.navawin1Count}</strong></span>
              <span>•</span>
              <span>၂ ကြိမ်: <strong className="text-amber-300">{metrics.navawin2Count}</strong></span>
              <span>•</span>
              <span>၃ ကြိမ်/အထူး: <strong className="text-amber-400">{metrics.navawin3Count + metrics.navawinSpecialCount}</strong></span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex justify-between">
            <span>နဝင်းယတြာ ရငွေ:</span>
            <span className="font-mono font-bold text-amber-300">{formatMMK(metrics.navawinRevenue)}</span>
          </div>
        </div>

        {/* Card 3: Net Profit (Income vs Expense) */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-emerald-500/30 shadow-xl relative overflow-hidden bg-gradient-to-br from-stone-850 via-emerald-950/20 to-stone-900 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">အသားတင် အမြတ်ငွေ</span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-300 font-mono">
              {formatMMK(metrics.netProfit)}
            </div>
            <p className="text-xs text-stone-400 mt-1">
              အမြတ်ရာခိုင်နှုန်း: <strong className="text-emerald-400">{metrics.profitMargin}%</strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex justify-between">
            <span>အဆောင်ပစ္စည်း ရောင်းရငွေ:</span>
            <span className="font-mono font-bold text-purple-300">{formatMMK(metrics.amuletsRevenue)}</span>
          </div>
        </div>

      </div>

      {/* Financial Health Balance: Total Income vs Total Expense */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          <span>လစဉ် ငွေကြေးစီးဆင်းမှု ရှင်းတမ်း (Income, Expense & Net Profit)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Income Box */}
          <div className="bg-stone-900/80 p-4 rounded-xl border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> စုစုပေါင်း ဝင်ငွေ (Total Income)
              </span>
              <span>100%</span>
            </div>
            <div className="text-2xl font-bold text-emerald-300 font-mono">
              {formatMMK(metrics.totalIncome)}
            </div>
            <div className="pt-2 text-xs text-stone-400 space-y-1 border-t border-stone-800">
              <div className="flex justify-between">
                <span>ဗေဒင်ဟောစာတမ်း ဝန်ဆောင်ခ:</span>
                <span className="font-mono text-stone-300">{formatMMK(metrics.serviceRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>နဝင်းယတြာ ကုန်ကျငွေ:</span>
                <span className="font-mono text-amber-300">{formatMMK(metrics.navawinRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>အဆောင်ပစ္စည်း POS ရောင်းရငွေ:</span>
                <span className="font-mono text-purple-300">{formatMMK(metrics.amuletsRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Expense Box */}
          <div className="bg-stone-900/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span className="flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" /> စုစုပေါင်း အသုံးစရိတ် (Total Expenses)
              </span>
              <span>{metrics.totalIncome > 0 ? ((metrics.totalExpense / metrics.totalIncome) * 100).toFixed(0) : '0'}%</span>
            </div>
            <div className="text-2xl font-bold text-rose-300 font-mono">
              {formatMMK(metrics.totalExpense)}
            </div>
            <div className="pt-2 text-xs text-stone-400 space-y-1 border-t border-stone-800">
              <div className="flex justify-between">
                <span>စရိတ်မှတ်တမ်း အရေအတွက်:</span>
                <span className="font-mono text-stone-300">{currentMonthExpenses.length} ခု</span>
              </div>
              <div className="flex justify-between">
                <span>အများဆုံး ကုန်ကျစရိတ်:</span>
                <span className="font-mono text-rose-300">
                  {currentMonthExpenses.length > 0
                    ? formatMMK(Math.max(...currentMonthExpenses.map(e => e.amount)))
                    : '၀ ကျပ်'}
                </span>
              </div>
            </div>
          </div>

          {/* Net Profit Box */}
          <div className="bg-gradient-to-br from-amber-950/40 to-stone-900 p-4 rounded-xl border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>အသားတင် အမြတ်ငွေ (Net Profit)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                အမြတ်ကျန်
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-300 font-mono">
              {formatMMK(metrics.netProfit)}
            </div>
            <div className="pt-2 text-xs text-stone-400 space-y-1 border-t border-stone-800">
              <div className="flex justify-between">
                <span>လက်ခံရရှိပြီး ငွေသား/Pay:</span>
                <span className="font-mono text-emerald-300">{formatMMK(metrics.collectedIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>ကောက်ခံရန်ကျန် စရန်ငွေ:</span>
                <span className="font-mono text-amber-400">{formatMMK(metrics.outstandingCredit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Ratio */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-stone-400">
            <span>ဝင်ငွေ နှင့် ထွက်ငွေ အချိုး (Income vs Expense Ratio)</span>
            <span>
              အသားတင်အမြတ်: <strong className="text-emerald-400">{metrics.profitMargin}%</strong>
            </span>
          </div>
          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden flex">
            {metrics.totalIncome > 0 && (
              <>
                <div
                  style={{ width: `${Math.min(100, Math.max(0, (metrics.netProfit / metrics.totalIncome) * 100))}%` }}
                  className="bg-emerald-500 h-full"
                  title="အသားတင်အမြတ်"
                />
                <div
                  style={{ width: `${Math.min(100, (metrics.totalExpense / metrics.totalIncome) * 100)}%` }}
                  className="bg-rose-500 h-full"
                  title="အသုံးစရိတ်"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs pt-1 text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> အသားတင် အမြတ်
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> အသုံးစရိတ် ကုန်ကျငွေ
            </span>
          </div>
        </div>
      </div>

      {/* Navawin Detailed Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Navawin Breakdown */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>နဝင်းယတြာ အကြိမ်ရေအလိုက် ခွဲခြမ်းစိတ်ဖြာချက်</span>
            </h4>
            <span className="text-xs text-stone-400">စုစုပေါင်း {metrics.navawinClientsCount} ဦး</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {NAWAWIN_OPTIONS.map((opt) => {
              const count = currentMonthConsultations.filter(c => c.navawinType === opt.key).length;
              const totalAmount = currentMonthConsultations
                .filter(c => c.navawinType === opt.key)
                .reduce((s, c) => s + (c.navawinFee || 0), 0);
              const percentage = currentMonthConsultations.length > 0 
                ? ((count / currentMonthConsultations.length) * 100).toFixed(0) 
                : 0;

              return (
                <div key={opt.key} className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-200">{opt.label}</span>
                    <div className="text-stone-400 text-[11px] mt-0.5">
                      ဧည့်သည် {count} ဦး ({percentage}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300">{formatMMK(totalAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses by Category Breakdown */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="font-bold text-rose-300 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span>အသုံးစရိတ် အမျိုးအစားအလိုက် ခွဲခြမ်းစိတ်ဖြာချက်</span>
            </h4>
            <span className="text-xs text-stone-400">စုစုပေါင်း {formatMMK(metrics.totalExpense)}</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {EXPENSE_CATEGORIES.map((cat) => {
              const catExpenses = currentMonthExpenses.filter(e => e.category === cat.key);
              const catTotal = catExpenses.reduce((s, e) => s + (e.amount || 0), 0);
              const percentage = metrics.totalExpense > 0 
                ? ((catTotal / metrics.totalExpense) * 100).toFixed(0) 
                : 0;

              return (
                <div key={cat.key} className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-200">{cat.label}</span>
                    <div className="text-stone-400 text-[11px] mt-0.5">
                      စာရင်းသွင်းမှု {catExpenses.length} ကြိမ် ({percentage}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-300">{formatMMK(catTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
