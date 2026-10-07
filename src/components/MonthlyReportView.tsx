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
  PieChart,
  LineChart as LineChartIcon,
  BarChart3,
  Percent,
  Layers,
  Activity,
  ArrowRightLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { ConsultationRecord, ExpenseRecord } from '../types';
import { formatMMK } from '../utils/astrology';

interface MonthlyReportViewProps {
  consultations: ConsultationRecord[];
  expenses: ExpenseRecord[];
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  consultations,
  expenses,
}) => {
  const [trendMetricView, setTrendMetricView] = useState<'all' | 'income_growth' | 'income' | 'profit' | 'expense' | 'growth'>('all');
  const [earningsChartMode, setEarningsChartMode] = useState<'category' | 'comparison'>('category');

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
    return consultations.filter(c => (c.readingDateTime || c.bookingDate || '').startsWith(selectedMonth));
  }, [consultations, selectedMonth]);

  const currentMonthExpenses = useMemo(() => {
    if (selectedMonth === 'all') return expenses;
    return expenses.filter(e => (e.date || '').startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Aggregate Calculations
  const metrics = useMemo(() => {
    // 1. Reading count (ဗေဒင်ဟော ဘယ်နှယောက်)
    const readingsCount = currentMonthConsultations.length;
    const completedReadings = currentMonthConsultations.filter(c => c.taskDone || c.status === 'completed').length;

    // 2. Yatra count (ယတြာ ဆောင်ရွက်သူများ)
    const yatraRecords = currentMonthConsultations.filter(c => c.yatraEnabled || c.yatraName || (c.yatraFee && c.yatraFee > 0) || (c.navawinType && c.navawinType !== 'none'));
    const yatraClientsCount = yatraRecords.length;

    // 3. Revenues
    const serviceRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.serviceFee || 0), 0);
    const yatraRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.yatraFee || c.navawinFee || 0), 0);
    const amuletsRevenue = currentMonthConsultations.reduce((sum, c) => sum + (c.amuletsTotal || 0), 0);
    const totalIncome = currentMonthConsultations.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
    const collectedIncome = currentMonthConsultations.reduce((sum, c) => {
      if (c.paymentStatus === 'paid') {
        return sum + (c.totalAmount || c.paidAmount || 0);
      }
      return sum + (c.paidAmount || 0);
    }, 0);
    const outstandingCredit = Math.max(0, totalIncome - collectedIncome);

    // 4. Expenses (ထွက်ငွေ)
    const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // 5. Net Profit (အသားတင်အမြတ်)
    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

    return {
      readingsCount,
      completedReadings,
      yatraClientsCount,
      serviceRevenue,
      yatraRevenue,
      amuletsRevenue,
      totalIncome,
      collectedIncome,
      outstandingCredit,
      totalExpense,
      netProfit,
      profitMargin,
    };
  }, [currentMonthConsultations, currentMonthExpenses]);

  // Generate 12-Month Financial Trend Data Series with MoM Growth Rate for Recharts Dual-Axis
  const last12MonthsTrend = useMemo(() => {
    const data: {
      key: string;
      monthLabel: string;
      fullLabel: string;
      income: number;
      expense: number;
      netProfit: number;
      readingsCount: number;
      yatraCount: number;
      growthRate: number;
      prevIncome: number;
    }[] = [];

    const now = new Date();
    const anchorDate = selectedMonth !== 'all' ? new Date(`${selectedMonth}-01T00:00:00`) : now;
    const shortMonthNames = ['ဇန်', 'ဖေ', 'မတ်', 'ဧ', 'မေ', 'ဇွန်', 'ဇူ', 'သြ', 'စက်', 'အောက်', 'နို', 'ဒီ'];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${yyyy}-${mm}`;

      const monthLabel = `${shortMonthNames[d.getMonth()]} '${String(yyyy).slice(2)}`;
      const fullLabel = `${yyyy} ခုနှစ်၊ ${shortMonthNames[d.getMonth()]}လ`;

      const monthConsultations = consultations.filter(c => (c.readingDateTime || c.bookingDate || '').startsWith(key));
      const monthExpenses = expenses.filter(e => (e.date || '').startsWith(key));

      const income = monthConsultations.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
      const expense = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
      const netProfit = income - expense;
      const readingsCount = monthConsultations.length;
      const yatraCount = monthConsultations.filter(c => c.yatraEnabled || c.yatraName || (c.yatraFee && c.yatraFee > 0) || (c.navawinType && c.navawinType !== 'none')).length;

      // Month-over-Month (MoM) Growth calculation
      const prevD = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      const prevKey = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}`;
      const prevConsultations = consultations.filter(c => (c.readingDateTime || c.bookingDate || '').startsWith(prevKey));
      const prevIncome = prevConsultations.reduce((sum, c) => sum + (c.totalAmount || 0), 0);

      const growthRate = prevIncome > 0
        ? Number((((income - prevIncome) / prevIncome) * 100).toFixed(1))
        : (income > 0 ? 100 : 0);

      data.push({
        key,
        monthLabel,
        fullLabel,
        income,
        expense,
        netProfit,
        readingsCount,
        yatraCount,
        growthRate,
        prevIncome,
      });
    }

    return data;
  }, [consultations, expenses, selectedMonth]);

  // 12-Month Summary Stats & MoM Highlights
  const trendStats = useMemo(() => {
    const total12Income = last12MonthsTrend.reduce((sum, m) => sum + m.income, 0);
    const total12Expense = last12MonthsTrend.reduce((sum, m) => sum + m.expense, 0);
    const total12Profit = total12Income - total12Expense;
    const avgMonthlyIncome = Math.round(total12Income / 12);
    const peakMonth = [...last12MonthsTrend].sort((a, b) => b.income - a.income)[0];
    const latestMonthTrend = last12MonthsTrend[last12MonthsTrend.length - 1];
    const latestGrowthRate = latestMonthTrend ? latestMonthTrend.growthRate : 0;
    const highestGrowthMonth = [...last12MonthsTrend].sort((a, b) => b.growthRate - a.growthRate)[0];

    return {
      total12Income,
      total12Expense,
      total12Profit,
      avgMonthlyIncome,
      peakMonth,
      latestGrowthRate,
      highestGrowthMonth,
    };
  }, [last12MonthsTrend]);

  // Category Breakdown for 'Monthly Earnings Overview' (Total Income vs Total Expenses by Category)
  const monthlyEarningsCategoryData = useMemo(() => {
    const list: {
      category: string;
      displayName: string;
      shortName: string;
      type: 'income' | 'expense';
      incomeAmount: number;
      expenseAmount: number;
      amount: number;
      fill: string;
      percentage: number;
    }[] = [];

    // 1. Income Categories
    if (metrics.serviceRevenue > 0) {
      list.push({
        category: 'income_astrology',
        displayName: 'ဗေဒင်ဟောခ (Readings)',
        shortName: 'ဗေဒင်ဟောခ',
        type: 'income',
        incomeAmount: metrics.serviceRevenue,
        expenseAmount: 0,
        amount: metrics.serviceRevenue,
        fill: '#10b981', // emerald-500
        percentage: metrics.totalIncome > 0 ? Math.round((metrics.serviceRevenue / metrics.totalIncome) * 100) : 0,
      });
    }
    if (metrics.yatraRevenue > 0) {
      list.push({
        category: 'income_yatra',
        displayName: 'ယတြာအစီအရင် (Yatra)',
        shortName: 'ယတြာခ',
        type: 'income',
        incomeAmount: metrics.yatraRevenue,
        expenseAmount: 0,
        amount: metrics.yatraRevenue,
        fill: '#f59e0b', // amber-500
        percentage: metrics.totalIncome > 0 ? Math.round((metrics.yatraRevenue / metrics.totalIncome) * 100) : 0,
      });
    }
    if (metrics.amuletsRevenue > 0) {
      list.push({
        category: 'income_amulets',
        displayName: 'အဆောင်ပစ္စည်း POS (Amulets)',
        shortName: 'အဆောင်ရောင်းရငွေ',
        type: 'income',
        incomeAmount: metrics.amuletsRevenue,
        expenseAmount: 0,
        amount: metrics.amuletsRevenue,
        fill: '#a855f7', // purple-500
        percentage: metrics.totalIncome > 0 ? Math.round((metrics.amuletsRevenue / metrics.totalIncome) * 100) : 0,
      });
    }

    // 2. Expense Categories
    const expCatMap = new Map<string, number>();
    currentMonthExpenses.forEach((e) => {
      const cat = e.category || 'အထွေထွေစရိတ်';
      expCatMap.set(cat, (expCatMap.get(cat) || 0) + (e.amount || 0));
    });

    const expenseColors = ['#f43f5e', '#fb7185', '#e11d48', '#f87171', '#fda4af', '#be123c', '#e11d48'];
    let cIdx = 0;
    expCatMap.forEach((amt, catName) => {
      list.push({
        category: `exp_${catName}`,
        displayName: `${catName} (အသုံးစရိတ်)`,
        shortName: catName,
        type: 'expense',
        incomeAmount: 0,
        expenseAmount: amt,
        amount: amt,
        fill: expenseColors[cIdx % expenseColors.length],
        percentage: metrics.totalExpense > 0 ? Math.round((amt / metrics.totalExpense) * 100) : 0,
      });
      cIdx++;
    });

    return list;
  }, [metrics, currentMonthExpenses]);

  // Side-by-Side Overall Comparison Chart Data
  const monthlyTotalComparisonData = useMemo(() => {
    return [
      {
        name: 'လစဉ် စုစုပေါင်း',
        income: metrics.totalIncome,
        expense: metrics.totalExpense,
        netProfit: metrics.netProfit,
      }
    ];
  }, [metrics]);

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

        {/* Card 2: Yatra Count */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-amber-500/30 shadow-xl relative overflow-hidden bg-gradient-to-br from-stone-850 via-amber-950/20 to-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">ယတြာ ဆောင်ရွက်မှု</span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-300">
              {metrics.yatraClientsCount} <span className="text-lg font-normal text-amber-200/70">ဦး</span>
            </div>
            <p className="text-xs text-stone-300 mt-1">
              ယတြာပြုလုပ်သူ စုစုပေါင်း: <strong className="text-amber-300">{metrics.yatraClientsCount}</strong> ဦး
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 flex justify-between">
            <span>ယတြာစရိတ် ရငွေ:</span>
            <span className="font-mono font-bold text-amber-300">{formatMMK(metrics.yatraRevenue)}</span>
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
                <span>ယတြာအစီအရင် ရငွေ:</span>
                <span className="font-mono text-amber-300">{formatMMK(metrics.yatraRevenue)}</span>
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

      {/* FEATURE 1: Monthly Earnings Overview Chart (Total Income vs Total Expenses by Category for Current Month) */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 text-emerald-300 border border-emerald-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <span>လစဉ် ဝင်ငွေနှင့် အသုံးစရိတ် ကဏ္ဍအလိုက် သုံးသပ်ချက် ဇယား (Monthly Earnings Overview)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {formatMonthLabel(selectedMonth)} အတွက် ဝင်ငွေအမျိုးအစားများနှင့် အသုံးစရိတ်ကဏ္ဍများ အသေးစိတ် နှိုင်းယှဉ်ချက်
              </p>
            </div>
          </div>

          {/* View Toggle Mode */}
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setEarningsChartMode('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                earningsChartMode === 'category'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ကဏ္ဍအလိုက် (By Category)</span>
            </button>
            <button
              type="button"
              onClick={() => setEarningsChartMode('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                earningsChartMode === 'comparison'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>ဝင်ငွေ vs ထွက်ငွေ နှိုင်းယှဉ်</span>
            </button>
          </div>
        </div>

        {/* Quick Category Badges Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-900/60 p-3 rounded-xl border border-emerald-900/30">
            <span className="text-[11px] text-stone-400 block">စုစုပေါင်း ဝင်ငွေ</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {formatMMK(metrics.totalIncome)}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-rose-900/30">
            <span className="text-[11px] text-stone-400 block">စုစုပေါင်း အသုံးစရိတ်</span>
            <span className="text-base font-bold font-mono text-rose-400">
              {formatMMK(metrics.totalExpense)}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-amber-900/30">
            <span className="text-[11px] text-stone-400 block">အသားတင် ကျန်ငွေ</span>
            <span className={`text-base font-bold font-mono ${metrics.netProfit >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
              {formatMMK(metrics.netProfit)}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block">အဓိက ဝင်ငွေရလမ်း</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200 block truncate">
              {metrics.serviceRevenue >= metrics.yatraRevenue && metrics.serviceRevenue >= metrics.amuletsRevenue
                ? `ဗေဒင်ဟောခ (${metrics.totalIncome > 0 ? Math.round((metrics.serviceRevenue / metrics.totalIncome) * 100) : 0}%)`
                : metrics.yatraRevenue >= metrics.amuletsRevenue
                ? `ယတြာအစီအရင် (${metrics.totalIncome > 0 ? Math.round((metrics.yatraRevenue / metrics.totalIncome) * 100) : 0}%)`
                : `အဆောင် POS (${metrics.totalIncome > 0 ? Math.round((metrics.amuletsRevenue / metrics.totalIncome) * 100) : 0}%)`
              }
            </span>
          </div>
        </div>

        {/* Recharts Monthly Earnings Overview BarChart */}
        <div className="w-full h-80 pt-2">
          {monthlyEarningsCategoryData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500 text-xs space-y-2">
              <BarChart3 className="w-8 h-8 opacity-40" />
              <span>ယခုလအတွက် ဝင်ငွေနှင့် အသုံးစရိတ် မှတ်တမ်း မရှိသေးပါ။</span>
            </div>
          ) : earningsChartMode === 'category' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyEarningsCategoryData}
                margin={{ top: 15, right: 15, left: -5, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#a8a29e"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={45}
                  axisLine={{ stroke: '#44403c' }}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#44403c' }}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                    if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                    return `${val}`;
                  }}
                />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      const isIncome = item.type === 'income';
                      return (
                        <div className="bg-stone-900/95 border border-stone-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[210px]">
                          <div className="font-bold text-stone-200 border-b border-stone-800 pb-1 flex items-center justify-between">
                            <span>{item.displayName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isIncome ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {isIncome ? 'ဝင်ငွေ (Income)' : 'အသုံးစရိတ် (Expense)'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-0.5">
                            <span className="text-stone-400">ပမာဏ:</span>
                            <span className={`font-mono font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {formatMMK(item.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-stone-400">
                            <span>{isIncome ? 'စုစုပေါင်း ဝင်ငွေ၏:' : 'စုစုပေါင်း စရိတ်၏:'}</span>
                            <span className="font-bold text-amber-300">{item.percentage}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="amount"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                >
                  {monthlyEarningsCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyTotalComparisonData}
                margin={{ top: 15, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#44403c' }}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#44403c' }}
                  tickFormatter={(val) => {
                    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                    if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
                    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                    return `${val}`;
                  }}
                />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-900/95 border border-amber-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[220px]">
                          <div className="font-bold text-amber-200 border-b border-stone-800 pb-1">
                            {formatMonthLabel(selectedMonth)} နှိုင်းယှဉ်ချက်
                          </div>
                          <div className="flex justify-between items-center text-emerald-400">
                            <span>ဝင်ငွေ (Total Income):</span>
                            <span className="font-mono font-bold">{formatMMK(d.income)}</span>
                          </div>
                          <div className="flex justify-between items-center text-rose-400">
                            <span>ထွက်ငွေ (Total Expenses):</span>
                            <span className="font-mono font-bold">{formatMMK(d.expense)}</span>
                          </div>
                          <div className="flex justify-between items-center text-amber-300 font-bold pt-1 border-t border-stone-800">
                            <span>အသားတင် အမြတ်:</span>
                            <span className="font-mono">{formatMMK(d.netProfit)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  formatter={(value) => {
                    if (value === 'income') return <span className="text-emerald-400">စုစုပေါင်း ဝင်ငွေ</span>;
                    if (value === 'expense') return <span className="text-rose-400">စုစုပေါင်း အသုံးစရိတ်</span>;
                    if (value === 'netProfit') return <span className="text-amber-400">အသားတင် အမြတ်</span>;
                    return value;
                  }}
                />
                <Bar dataKey="income" name="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
                <Bar dataKey="expense" name="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={60} />
                <Bar dataKey="netProfit" name="netProfit" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Color Legend Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-stone-800">
          <span className="text-stone-400 font-medium">ဝင်ငွေကဏ္ဍများ:</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> ဗေဒင်ဟောခ
          </span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> ယတြာအစီအရင်
          </span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded bg-purple-500 inline-block" /> အဆောင်ပစ္စည်း POS
          </span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-400 font-medium">အသုံးစရိတ်ကဏ္ဍများ:</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> အထွေထွေ/ဝယ်ယူ/လစာ စရိတ်များ
          </span>
        </div>
      </div>

      {/* FEATURE 2: 12-Month Financial Progress & Dual-Axis MoM Income Growth Trend Chart (Recharts) */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-sky-500/20 text-sky-300 border border-sky-500/30">
              <LineChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <span>လွန်ခဲ့သော ၁၂ လ ဘဏ္ဍာရေးနှင့် ဝင်ငွေ တိုးတက်မှု လမ်းကြောင်း (Dual-Axis MoM Growth Trend)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                လစဉ် ဝင်ငွေ (MMK) နှင့် လအလိုက် ဝင်ငွေ တိုးတက်မှုနှုန်း Month-over-Month (MoM %) ပူးတွဲဖော်ပြသော မျဉ်းကွေးဇယား
              </p>
            </div>
          </div>

          {/* Metric View Selector */}
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setTrendMetricView('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                trendMetricView === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              အားလုံး (All)
            </button>
            <button
              type="button"
              onClick={() => setTrendMetricView('income_growth')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                trendMetricView === 'income_growth'
                  ? 'bg-sky-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-sky-300'
              }`}
            >
              ဝင်ငွေ & MoM Growth
            </button>
            <button
              type="button"
              onClick={() => setTrendMetricView('income')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                trendMetricView === 'income'
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-emerald-300'
              }`}
            >
              ဝင်ငွေသီးသန့်
            </button>
            <button
              type="button"
              onClick={() => setTrendMetricView('profit')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                trendMetricView === 'profit'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-amber-300'
              }`}
            >
              အမြတ်
            </button>
            <button
              type="button"
              onClick={() => setTrendMetricView('expense')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                trendMetricView === 'expense'
                  ? 'bg-rose-500 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-rose-300'
              }`}
            >
              ထွက်ငွေ
            </button>
          </div>
        </div>

        {/* 12-Month Quick KPI Summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block">၁၂ လ စုစုပေါင်း ဝင်ငွေ</span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              {formatMMK(trendStats.total12Income)}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block">၁၂ လ စုစုပေါင်း အသုံးစရိတ်</span>
            <span className="text-base sm:text-lg font-bold font-mono text-rose-400">
              {formatMMK(trendStats.total12Expense)}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block">လတ်တလော MoM Growth</span>
            <span className={`text-base sm:text-lg font-bold font-mono flex items-center gap-1 ${
              trendStats.latestGrowthRate >= 0 ? 'text-sky-400' : 'text-rose-400'
            }`}>
              {trendStats.latestGrowthRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {trendStats.latestGrowthRate > 0 ? `+${trendStats.latestGrowthRate}%` : `${trendStats.latestGrowthRate}%`}
            </span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block">အမြင့်ဆုံး ဝင်ငွေရရှိသည့်လ</span>
            <span className="text-xs sm:text-sm font-bold text-stone-200 block truncate" title={trendStats.peakMonth && trendStats.peakMonth.income > 0 ? `${trendStats.peakMonth.fullLabel} (${formatMMK(trendStats.peakMonth.income)})` : '-'}>
              {trendStats.peakMonth && trendStats.peakMonth.income > 0
                ? `${trendStats.peakMonth.monthLabel}: ${formatMMK(trendStats.peakMonth.income)}`
                : '-'}
            </span>
          </div>
        </div>

        {/* Recharts Dual-Axis ComposedChart Container */}
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={last12MonthsTrend} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              
              {/* X-Axis */}
              <XAxis
                dataKey="monthLabel"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
              />

              {/* Primary Y-Axis (Left) - Currency MMK */}
              <YAxis
                yAxisId="left"
                stroke="#78716c"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                  return `${val}`;
                }}
              />

              {/* Secondary Y-Axis (Right) - Growth Rate % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#38bdf8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#0284c7' }}
                tickFormatter={(val) => `${val > 0 ? `+${val}` : val}%`}
              />

              {/* Zero Reference Line for MoM Growth Rate */}
              <ReferenceLine yAxisId="right" y={0} stroke="#44403c" strokeDasharray="3 3" />

              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isPositive = data.growthRate >= 0;
                    return (
                      <div className="bg-stone-900/95 border border-sky-500/40 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 min-w-[220px]">
                        <div className="font-bold text-amber-200 border-b border-stone-800 pb-1 flex items-center justify-between">
                          <span>{data.fullLabel}</span>
                          <span className="text-[10px] text-stone-400 font-mono">({data.key})</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> ဝင်ငွေ (Income):
                          </span>
                          <span className="font-mono font-bold">{formatMMK(data.income)}</span>
                        </div>
                        <div className="flex justify-between items-center text-rose-400">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> အသုံးစရိတ် (Expense):
                          </span>
                          <span className="font-mono font-bold">{formatMMK(data.expense)}</span>
                        </div>
                        <div className="flex justify-between items-center text-amber-300 font-semibold pt-1 border-t border-stone-800">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> အသားတင်အမြတ်:
                          </span>
                          <span className="font-mono font-bold">{formatMMK(data.netProfit)}</span>
                        </div>
                        
                        {/* Dual-Axis MoM Highlight in Tooltip */}
                        <div className={`flex justify-between items-center pt-1 border-t border-stone-800 font-bold ${isPositive ? 'text-sky-400' : 'text-rose-400'}`}>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> MoM တိုးတက်မှုနှုန်း:
                          </span>
                          <span className="font-mono">{isPositive ? `+${data.growthRate}%` : `${data.growthRate}%`}</span>
                        </div>

                        <div className="flex justify-between items-center text-stone-400 text-[11px] pt-0.5">
                          <span>ဧည့်သည်/ယတြာ:</span>
                          <span className="font-medium text-stone-300">{data.readingsCount} ဦး / {data.yatraCount} မှု</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                formatter={(value) => {
                  if (value === 'income') return <span className="text-emerald-400">ဝင်ငွေ (Income - MMK)</span>;
                  if (value === 'netProfit') return <span className="text-amber-400">အသားတင်အမြတ် (Net Profit)</span>;
                  if (value === 'expense') return <span className="text-rose-400">အသုံးစရိတ် (Expense)</span>;
                  if (value === 'growthRate') return <span className="text-sky-400 font-semibold">လစဉ် တိုးတက်မှု (MoM Growth %)</span>;
                  return value;
                }}
              />

              {/* Left Axis: Income Area */}
              {(trendMetricView === 'all' || trendMetricView === 'income' || trendMetricView === 'income_growth') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="income"
                  name="income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeAreaGradient)"
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                />
              )}

              {/* Left Axis: Net Profit Area */}
              {(trendMetricView === 'all' || trendMetricView === 'profit') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="netProfit"
                  name="netProfit"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#profitAreaGradient)"
                  activeDot={{ r: 5, fill: '#f59e0b', stroke: '#78350f', strokeWidth: 2 }}
                />
              )}

              {/* Left Axis: Expense Area */}
              {(trendMetricView === 'all' || trendMetricView === 'expense') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="expense"
                  name="expense"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#expenseAreaGradient)"
                  activeDot={{ r: 5, fill: '#f43f5e', stroke: '#881337', strokeWidth: 2 }}
                />
              )}

              {/* Right Axis: MoM Income Growth Rate Line Overlay */}
              {(trendMetricView === 'all' || trendMetricView === 'income_growth' || trendMetricView === 'growth') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growthRate"
                  name="growthRate"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0284c7', stroke: '#e0f2fe', strokeWidth: 1.5 }}
                  activeDot={{ r: 7, fill: '#38bdf8', stroke: '#0369a1', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yatra & Expenses Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Yatra by Type Breakdown */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>ယတြာ အမျိုးအစားအလိုက် ခွဲခြမ်းစိတ်ဖြာချက်</span>
            </h4>
            <span className="text-xs text-stone-400">စုစုပေါင်း {metrics.yatraClientsCount} ဦး</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {(() => {
              const yatraMap = new Map<string, { total: number; count: number }>();
              currentMonthConsultations.forEach((c) => {
                if (c.yatraEnabled || c.yatraName || (c.yatraFee && c.yatraFee > 0) || (c.navawinType && c.navawinType !== 'none')) {
                  const yName = c.yatraName || 'ယတြာ အစီအရင်';
                  const current = yatraMap.get(yName) || { total: 0, count: 0 };
                  yatraMap.set(yName, {
                    total: current.total + (c.yatraFee || c.navawinFee || 0),
                    count: current.count + 1,
                  });
                }
              });

              if (yatraMap.size === 0) {
                return (
                  <p className="text-stone-500 text-xs text-center py-6">
                    ယခုလတွင် ယတြာ ပြုလုပ်ထားသော မှတ်တမ်း မရှိသေးပါ။
                  </p>
                );
              }

              const totalYatraClients = Array.from(yatraMap.values()).reduce((s, v) => s + v.count, 0);

              return Array.from(yatraMap.entries()).map(([yName, data]) => {
                const percentage = totalYatraClients > 0
                  ? ((data.count / totalYatraClients) * 100).toFixed(0)
                  : 0;

                return (
                  <div key={yName} className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-200">{yName}</span>
                      <div className="text-stone-400 text-[11px] mt-0.5">
                        ဧည့်သည် {data.count} ဦး ({percentage}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-300">{formatMMK(data.total)}</span>
                    </div>
                  </div>
                );
              });
            })()}
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
            {(() => {
              const categoryMap = new Map<string, { total: number; count: number }>();
              currentMonthExpenses.forEach((e) => {
                const catName = e.category || 'အထွေထွေ';
                const current = categoryMap.get(catName) || { total: 0, count: 0 };
                categoryMap.set(catName, {
                  total: current.total + (e.amount || 0),
                  count: current.count + 1,
                });
              });

              if (categoryMap.size === 0) {
                return (
                  <p className="text-stone-500 text-xs text-center py-4">
                    ယခုလတွင် အသုံးစရိတ် မရှိသေးပါ။
                  </p>
                );
              }

              return Array.from(categoryMap.entries()).map(([catName, data]) => {
                const percentage = metrics.totalExpense > 0 
                  ? ((data.total / metrics.totalExpense) * 100).toFixed(0) 
                  : 0;

                return (
                  <div key={catName} className="bg-stone-900/60 p-3 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-200">{catName}</span>
                      <div className="text-stone-400 text-[11px] mt-0.5">
                        စာရင်းသွင်းမှု {data.count} ကြိမ် ({percentage}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-300">{formatMMK(data.total)}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

      </div>

      {/* NEW: Data Insight Trend Report, Business Health Check & Consultation Mode Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left: Consultation Modes Analysis (In Person vs Remote) */}
        <div className="lg:col-span-5 bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>မေးမြန်းမှု ပုံစံ သုံးသပ်ချက် (Consultation Mode)</span>
            </h4>
          </div>

          {(() => {
            const inPerson = currentMonthConsultations.filter(c => c.consultationMode === 'in_person').length;
            const remote = currentMonthConsultations.filter(c => c.consultationMode === 'remote').length;
            const total = inPerson + remote;
            const inPersonPercent = total > 0 ? Math.round((inPerson / total) * 100) : 0;
            const remotePercent = total > 0 ? Math.round((remote / total) * 100) : 0;

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800 text-center">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">လူကိုယ်တိုင် (In-Person)</span>
                    <div className="text-xl font-bold text-stone-200 mt-1">{inPerson} ဦး</div>
                    <span className="text-xs text-emerald-400 font-bold font-mono">{inPersonPercent}%</span>
                  </div>
                  <div className="bg-stone-900/70 p-3 rounded-xl border border-stone-800 text-center">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">အွန်လိုင်း (Remote Mode)</span>
                    <div className="text-xl font-bold text-stone-200 mt-1">{remote} ဦး</div>
                    <span className="text-xs text-sky-400 font-bold font-mono">{remotePercent}%</span>
                  </div>
                </div>

                {/* Progress bar ratio for modes */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-stone-500 font-mono">
                    <span>လူကိုယ်တိုင် ({inPersonPercent}%)</span>
                    <span>အဝေးရောက် ({remotePercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden flex border border-stone-800">
                    <div className="bg-emerald-500 h-full" style={{ width: `${inPersonPercent}%` }} />
                    <div className="bg-sky-400 h-full" style={{ width: `${remotePercent}%` }} />
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed bg-stone-900/40 p-2.5 rounded-xl border border-stone-800/60">
                  {inPersonPercent > remotePercent 
                    ? "💡 လူကိုယ်တိုင် လာရောက်မေးမြန်းမှု ပိုမိုများပြားသဖြင့် အဆောင်ပစ္စည်း POS ရောင်းအား တက်လာစေရန် ဟောခန်း၌ အဆောင်ပစ္စည်းများကို ပိုမိုခင်းကျင်းပြသရန် အကြံပြုအပ်ပါသည်။"
                    : "💡 အွန်လိုင်းမှ မေးမြန်းသူ ပိုမိုများပြားသဖြင့် ဟောစာတမ်းနှင့် ယတြာလမ်းညွှန်ချက်များကို PDF/ဘောက်ချာပုံစံဖြင့် စနစ်တကျ Viber/Messenger သို့ ပို့ဆောင်ပေးခြင်းဖြင့် ဝန်ဆောင်မှု ပိုမိုကောင်းမွန်စေပါသည်။"
                  }
                </p>
              </div>
            );
          })()}
        </div>

        {/* Right: Smart Business Suggestions & Health Audit */}
        <div className="lg:col-span-7 bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>စီးပွားရေး ကျန်းမာမှု သုံးသပ်ချက် နှင့် အကြံပြုချက်များ</span>
            </h4>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Auto Analysis
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-stone-300">
            {(() => {
              const avgTicketSize = metrics.readingsCount > 0 ? Math.round(metrics.totalIncome / metrics.readingsCount) : 0;
              const expenseRatio = metrics.totalIncome > 0 ? (metrics.totalExpense / metrics.totalIncome) * 100 : 0;
              const amuletRatio = metrics.totalIncome > 0 ? (metrics.amuletsRevenue / metrics.totalIncome) * 100 : 0;
              const yatraRatio = metrics.totalIncome > 0 ? (metrics.yatraRevenue / metrics.totalIncome) * 100 : 0;

              return (
                <div className="space-y-3">
                  {/* Dynamic Metric Box 1 */}
                  <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-800 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">1</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-200">တစ်ဦးချင်း ပျမ်းမျှ ဉာဏ်ပူဇော်ခ (Avg Ticket Size):</span>
                      <p className="text-[11px] text-stone-400">
                        မေးသူတစ်ဦးလျှင် ပျမ်းမျှ <strong className="text-emerald-300 font-mono">{formatMMK(avgTicketSize)}</strong> သုံးစွဲထားပါသည်။ {avgTicketSize < 40000 ? "ယတြာ ကတ်တလောက်မှ အစီအစဉ်များအား တိုက်တွန်းခြင်းဖြင့် ဝင်ငွေတိုးတက်စေနိုင်ပါသည်။" : "ဖောက်သည်များ၏ သုံးစွဲနိုင်စွမ်း ကောင်းမွန်သော အခြေအနေ ဖြစ်ပါသည်။"}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Metric Box 2 */}
                  <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-800 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">2</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-200">အသုံးစရိတ် ကာကွယ်မှုနှုန်း (Expense Health):</span>
                      <p className="text-[11px] text-stone-400">
                        ဝင်ငွေအပေါ် အသုံးစရိတ်အချိုးသည် <strong className="text-amber-300 font-mono">{expenseRatio.toFixed(0)}%</strong> ရှိပါသည်။ {expenseRatio > 40 ? "⚠️ အသုံးစရိတ်အချိုး ၄၀% ထက် ကျော်လွန်နေသဖြင့် အသုံးစရိတ်များကို ပိုမိုစိစစ်ရန် လိုအပ်ပါသည်။" : "✅ ဝင်ငွေနှင့်အသုံးစရိတ်အချိုးသည် အန္တရာယ်ကင်းသော ကောင်းမွန်သည့်ဘောင်အတွင်း တည်ရှိနေပါသည်။"}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Metric Box 3 */}
                  <div className="p-3 bg-stone-900/50 rounded-xl border border-stone-800 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">3</div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-200">အဆောင်ပစ္စည်း POS ရောင်းအား အချိုး:</span>
                      <p className="text-[11px] text-stone-400">
                        စုစုပေါင်းဝင်ငွေ၏ <strong className="text-purple-300 font-mono">{amuletRatio.toFixed(0)}%</strong> သည် အဆောင်ရောင်းအားမှ ဖြစ်သည်။ {amuletRatio < 15 ? "အဆောင်ပစ္စည်းများကို ဟောခန်းတွင် ပိုမိုမိတ်ဆက်ပေးခြင်းဖြင့် အပိုဆောင်းဝင်ငွေကို မြှင့်တင်နိုင်ပါသည်။" : "အဆောင်ပစ္စည်း POS ရောင်းအားသည် လုပ်ငန်းအတွက် အဓိကအားထားရသော မဏ္ဍိုင်ဖြစ်နေပါပြီ။"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
};
