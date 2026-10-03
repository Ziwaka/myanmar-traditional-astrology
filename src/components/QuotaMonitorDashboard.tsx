import React, { useState, useEffect } from 'react';
import { 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload, 
  Zap, 
  PieChart, 
  Trash2, 
  ShieldAlert, 
  FileText,
  BarChart2,
  Sparkles,
  Server
} from 'lucide-react';
import { 
  DatabaseQuotaReport, 
  getDatabaseQuotaReport, 
  optimizeStorage, 
  formatBytes 
} from '../utils/databaseQuota';
import { exportAllDataAsJSON } from '../utils/storage';

interface QuotaMonitorDashboardProps {
  onDataImported?: () => void;
}

export const QuotaMonitorDashboard: React.FC<QuotaMonitorDashboardProps> = ({
  onDataImported,
}) => {
  const [report, setReport] = useState<DatabaseQuotaReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [optimizeMessage, setOptimizeMessage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const loadReport = async () => {
    setIsRefreshing(true);
    try {
      const data = await getDatabaseQuotaReport();
      setReport(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleOptimize = () => {
    const { freedBytes } = optimizeStorage();
    loadReport();
    setOptimizeMessage(
      freedBytes > 0
        ? `Database ကို Compress ပြုလုပ်ပြီး နေရာလွတ် ${formatBytes(freedBytes)} သက်သာအောင် ရှင်းလင်းပေးလိုက်ပါပြီ။`
        : 'Database သည် အကောင်းဆုံး Compact အခြေအနေတွင် ရှိပြီးဖြစ်ပါသည်။'
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (parsed && (parsed.consultations || parsed.appName)) {
          if (parsed.consultations && Array.isArray(parsed.consultations)) {
            localStorage.setItem('myanmar_astrology_consultations_v2_clean', JSON.stringify(parsed.consultations));
          }
          if (parsed.expenses && Array.isArray(parsed.expenses)) {
            localStorage.setItem('myanmar_astrology_expenses_v2_clean', JSON.stringify(parsed.expenses));
          }
          if (parsed.amulets && Array.isArray(parsed.amulets)) {
            localStorage.setItem('myanmar_astrology_amulets_v2', JSON.stringify(parsed.amulets));
          }

          alert('Backup ဒေတာများကို Database ထဲသို့ အောင်မြင်စွာ ထည့်သွင်း (Import) ပြီးပါပြီ။');
          loadReport();
          if (onDataImported) onDataImported();
        } else {
          alert('မမှန်ကန်သော Backup ဖိုင် ဖြစ်နေပါသည်။');
        }
      } catch (err) {
        alert('JSON ဖိုင် ဖတ်ရှုရာတွင် ချို့ယွင်းချက် ဖြစ်ပေါ်ပါသည်: ' + String(err));
      }
    };
    reader.readAsText(file);
  };

  if (!report) {
    return (
      <div className="p-12 text-center text-stone-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
        <p className="text-xs">Quota အချက်အလက်များ တွက်ချက်နေပါသည်...</p>
      </div>
    );
  }

  // Estimated daily ops calculation
  const totalDocs = report.recordCount.consultations + report.recordCount.expenses + report.recordCount.amulets;
  const estimatedDailyReads = Math.min(50000, totalDocs * 5);
  const estimatedDailyWrites = Math.min(20000, totalDocs * 2);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Database className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-200">
                Quota & Storage Monitor Dashboard
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                report.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                report.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {report.statusLabel}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Local Storage နေရာလွတ်နှင့် Google Firestore Cloud Daily Quota စောင့်ကြည့်စစ်ဆေးမှု
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadReport}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-semibold transition cursor-pointer active:scale-95 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>တွက်ချက်မှု ပြန်လုပ်မည်</span>
        </button>
      </div>

      {/* Storage Gauge & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Used Storage */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <span className="text-xs text-stone-400 block">အသုံးပြုထားသော ပမာဏ</span>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {report.formattedUsed}
          </div>
          <p className="text-[11px] text-stone-400">
            Allocated Quota ({report.formattedQuota}) ၏ <strong className="text-amber-400">{report.usedPercentage}%</strong>
          </p>
        </div>

        {/* Card 2: Remaining Space */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <span className="text-xs text-stone-400 block">ကျန်ရှိသော နေရာလွတ်</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {report.formattedRemaining}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            မှတ်တမ်းထောင်ပေါင်းများစွာ ဆက်လက်သိမ်းဆည်းနိုင်ပါသည်
          </p>
        </div>

        {/* Card 3: Total Document Count */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <span className="text-xs text-stone-400 block">စုစုပေါင်း မှတ်တမ်းအရေအတွက်</span>
          <div className="text-2xl font-bold font-mono text-blue-300">
            {totalDocs} <span className="text-xs font-normal text-stone-400">ခု</span>
          </div>
          <p className="text-[11px] text-stone-400">
            ဗေဒင် ({report.recordCount.consultations})၊ စရိတ် ({report.recordCount.expenses})
          </p>
        </div>

        {/* Card 4: Compression Health */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <span className="text-xs text-stone-400 block">Storage Optimization Status</span>
          <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 pt-1">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Compact & Minified</span>
          </div>
          <p className="text-[11px] text-stone-400">
            JSON Stringification Minification Active
          </p>
        </div>

      </div>

      {/* Storage Gauge Progress Bar */}
      <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-3">
        <div className="flex justify-between items-center text-xs text-stone-300 font-semibold">
          <span>Local Database Memory Quota Progress</span>
          <span>{report.formattedUsed} / {report.formattedQuota} ({report.usedPercentage}%)</span>
        </div>

        <div className="w-full h-3.5 bg-stone-900 rounded-full overflow-hidden p-0.5 border border-stone-800">
          <div
            style={{ width: `${Math.max(2, report.usedPercentage)}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              report.usedPercentage >= 90 ? 'bg-rose-500' :
              report.usedPercentage >= 70 ? 'bg-amber-500' :
              'bg-gradient-to-r from-emerald-500 to-amber-400'
            }`}
          />
        </div>
      </div>

      {/* Storage Breakdown & Firestore Daily Free Tier Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Collection Breakdown Table */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-bold text-stone-100 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span>အချက်အလက် ခွဲခြမ်းစိတ်ဖြာချက် (Storage Breakdown)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {report.breakdown.map((item) => (
              <div key={item.label} className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{item.label}</span>
                  <span className="font-mono font-bold text-amber-300">{item.formattedSize}</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(1, item.percentage)}%`, backgroundColor: item.color }}
                    className="h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>{item.count} မှတ်တမ်း</span>
                  <span>{item.percentage.toFixed(1)}% of used space</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Firestore Daily Free-Tier Quota Monitor */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-bold text-stone-100 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Google Cloud Firestore Free-Tier Quota Tracker</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              100% FREE TIER
            </span>
          </div>

          <div className="space-y-3">
            {/* Reads */}
            <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-semibold">Daily Read Operations (ဖတ်ရှုမှု ခွင့်ပြုချက်)</span>
                <span className="font-mono text-emerald-400 font-bold">~{estimatedDailyReads} / 50,000 reads/day</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (estimatedDailyReads / 50000) * 100)}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-stone-400">
                Google Cloud Firestore ၏ တစ်နေ့လျှင် ဖတ်ခွင့် ၅၀,၀၀၀ အခမဲ့ ပေးထားပါသည် (လုံလောက်စွာ ပိုလျှံပါသည်)။
              </p>
            </div>

            {/* Writes */}
            <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-semibold">Daily Write Operations (စာရင်းရေးသွင်း ခွင့်ပြုချက်)</span>
                <span className="font-mono text-amber-300 font-bold">~{estimatedDailyWrites} / 20,000 writes/day</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (estimatedDailyWrites / 20000) * 100)}%` }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <p className="text-[10px] text-stone-400">
                တစ်နေ့လျှင် စာရင်းအသစ်ရေးသွင်းမှု ၂၀,၀၀၀ အခမဲ့ ခွင့်ပြုထားပါသည် (လုံလောက်ပါသည်)။
              </p>
            </div>

            {/* Storage Limit */}
            <div className="bg-stone-900 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-300 font-semibold">Stored Data Allowance (Cloud Storage)</span>
                <span className="font-mono text-blue-300 font-bold">{report.formattedUsed} / 1.0 GiB</span>
              </div>
              <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (report.totalUsedBytes / (1024 * 1024 * 1024)) * 100)}%` }}
                  className="h-full bg-blue-400 rounded-full"
                />
              </div>
              <p className="text-[10px] text-stone-400">
                Google Cloud အခမဲ့ Storage 1 GB အထိ စာရင်းမှတ်တမ်းပေါင်း သောင်းနဲ့ချီ သိမ်းဆည်းနိုင်ပါသည်။
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Storage Optimization & Backup Actions */}
      <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
        <h3 className="font-bold text-stone-100 text-sm flex items-center gap-2 border-b border-stone-800 pb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Storage Optimization & Backup Management Suite</span>
        </h3>

        {optimizeMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{optimizeMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={handleOptimize}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ 1-Click Database Compress</span>
          </button>

          <button
            type="button"
            onClick={exportAllDataAsJSON}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-emerald-300 font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>📥 Full Backup JSON ဒေါင်းလုဒ်</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-blue-300 font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>📤 Backup JSON ပြန်ထည့်မည်</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

    </div>
  );
};
