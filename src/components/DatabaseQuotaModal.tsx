import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  PieChart, 
  Zap, 
  FileText 
} from 'lucide-react';
import { 
  DatabaseQuotaReport, 
  getDatabaseQuotaReport, 
  optimizeStorage, 
  formatBytes 
} from '../utils/databaseQuota';
import { exportAllDataAsJSON } from '../utils/storage';

interface DatabaseQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImported?: () => void;
}

export const DatabaseQuotaModal: React.FC<DatabaseQuotaModalProps> = ({
  isOpen,
  onClose,
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
    if (isOpen) {
      loadReport();
      setOptimizeMessage(null);
    }
  }, [isOpen]);

  if (!isOpen || !report) return null;

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
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getStatusColor = () => {
    if (report.status === 'critical') return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
    if (report.status === 'warning') return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  };

  const getProgressBarColor = () => {
    if (report.status === 'critical') return 'bg-gradient-to-r from-rose-500 to-red-600';
    if (report.status === 'warning') return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-emerald-500 to-teal-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Database className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-200">
                  Database Quota & Storage
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor()}`}>
                  {report.statusLabel}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                ဗေဒင်မှတ်တမ်းများနှင့် အချက်အလက်များ သိမ်းဆည်းနိုင်မှု ပမာဏ (Quota Tracker)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={loadReport}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              title="ပြန်လည်တွက်ချက်မည်"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs sm:text-sm">
          
          {/* Main Quota Gauge Card */}
          <div className="p-5 rounded-2xl bg-stone-850 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>သတ်မှတ် Quota အသုံးပြုထားမှု (Capacity)</span>
              </span>
              <span className="text-sm font-bold font-mono text-amber-300">
                {report.usedPercentage}% အသုံးပြုပြီး
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-stone-950 p-0.5 border border-stone-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                  style={{ width: `${Math.max(2, report.usedPercentage)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-stone-400 pt-1 font-mono">
                <span>အသုံးပြုပြီး: <strong className="text-stone-200">{report.formattedUsed}</strong></span>
                <span>ကျန်ရှိနေရာလွတ်: <strong className="text-emerald-400">{report.formattedRemaining}</strong></span>
                <span>စုစုပေါင်း Quota: <strong className="text-amber-400">{report.formattedQuota}</strong></span>
              </div>
            </div>

            {/* Capacity Estimation Note */}
            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                လက်ရှိ သတ်မှတ် Quota အရ ဗေဒင်မေးသူပေါင်း <strong>~၅,၀၀၀ မှ ၁၀,၀၀၀ ဦးကျော်</strong> အထိ စိတ်ချစွာ စာရင်းသွင်း သိမ်းဆည်းနိုင်ပါသည်။
              </span>
            </div>
          </div>

          {/* Cloud Database & Multi-User Live Sync Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-850 to-stone-900 border border-emerald-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google Cloud Firestore (Multi-User Real-time Sync)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Active Live Sync
              </span>
            </div>

            <p className="text-[11px] text-stone-300 leading-relaxed">
              Google Cloud Firestore ကို ချိတ်ဆက်ပြီးဖြစ်သဖြင့် <strong>ဖုန်း၊ တက်ဘလက်၊ ကွန်ပျူတာ စက် (၂) လုံး (သို့မဟုတ်) လူ (၂) ယောက်</strong> တစ်ပြိုင်နက်တည်း အသုံးပြုပါက တစ်ဖက်မှ ရိုက်ထည့်လိုက်သော ဗေဒင်မှတ်တမ်းနှင့် အသုံးစရိတ်များသည် အခြားတစ်ဖက်တွင် ချက်ချင်း (Real-time) အလိုအလျောက် ပေါ်လာပါမည်။
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-stone-400">
              <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-500 block">Cloud Project:</span>
                <span className="text-emerald-300 font-semibold truncate block">dub-height-4wh4c</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-stone-500 block">Cloud Quota:</span>
                <span className="text-amber-300 font-semibold truncate block">1 GiB (~1,000,000+ မှတ်တမ်း)</span>
              </div>
            </div>
          </div>

          {/* Storage Breakdown by Category */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-amber-400" />
              <span>ကဏ္ဍအလိုက် နေရာယူထားမှု အသေးစိတ် (Breakdown)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-850/80 border border-stone-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-stone-200 text-xs">{item.label}</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block pl-4">
                      {item.count} ခု မှတ်တမ်းတင်ထားဆဲ
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-stone-200 block">
                      {item.formattedSize}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Feedback */}
          {optimizeMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{optimizeMessage}</span>
            </div>
          )}

          {/* Database Tools & Maintenance Actions */}
          <div className="p-4 rounded-2xl bg-stone-850/60 border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Database Quota ထိန်းသိမ်းရေး ကိရိယာများ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              
              {/* Compress Database */}
              <button
                type="button"
                onClick={handleOptimize}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 border border-stone-700 font-medium transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Optimize (ဖိသိပ်မည်)</span>
              </button>

              {/* Export Backup */}
              <button
                type="button"
                onClick={exportAllDataAsJSON}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-emerald-300 border border-stone-700 font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backup ထုတ်မည်</span>
              </button>

              {/* Import Backup */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-blue-300 border border-stone-700 font-medium transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Restore (ထည့်မည်)</span>
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

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Database Limit: {report.formattedQuota} Client Storage
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
          >
            ပိတ်မည်
          </button>
        </div>

      </div>
    </div>
  );
};
