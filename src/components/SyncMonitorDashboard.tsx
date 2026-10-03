import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  UploadCloud, 
  DownloadCloud, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Trash2, 
  Smartphone, 
  Laptop, 
  Search, 
  Zap,
  Server,
  FileCheck
} from 'lucide-react';
import { ConsultationRecord, ExpenseRecord, AmuletCatalogItem } from '../types';
import { 
  checkFirestoreLatencyMs, 
  fetchCloudDocumentCounts, 
  uploadAllLocalToCloud, 
  pullAllCloudToLocal 
} from '../utils/firebase';
import { 
  getLastCloudSyncTime, 
  formatLastSyncRelative, 
  isCloudSyncOverdue, 
  getCloudSyncElapsedHours 
} from '../utils/cloudSyncReminder';
import { getSyncLogs, clearSyncLogs, SyncLogEntry, addSyncLog } from '../utils/syncLog';
import { getDeviceId, getDeviceName, saveDeviceName } from '../utils/deviceProfile';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface SyncMonitorDashboardProps {
  consultations: ConsultationRecord[];
  expenses: ExpenseRecord[];
  amulets: AmuletCatalogItem[];
  onRefreshLocalData: () => void;
}

export const SyncMonitorDashboard: React.FC<SyncMonitorDashboardProps> = ({
  consultations,
  expenses,
  amulets,
  onRefreshLocalData,
}) => {
  const isOnline = useOnlineStatus();
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isTestingLatency, setIsTestingLatency] = useState(false);
  const [cloudCounts, setCloudCounts] = useState<{ consultations: number; expenses: number; amulets: number } | null>(null);
  const [isCheckingCloudCounts, setIsCheckingCloudCounts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<SyncLogEntry[]>(getSyncLogs());
  const [filterAction, setFilterAction] = useState<string>('all');

  // Device Profile
  const [deviceName, setDeviceNameState] = useState(getDeviceName());
  const [isSavedDeviceName, setIsSavedDeviceName] = useState(false);
  const deviceId = getDeviceId();

  const lastSyncTime = getLastCloudSyncTime();
  const isOverdue = isCloudSyncOverdue();
  const elapsedHours = Math.floor(getCloudSyncElapsedHours());

  // Test Latency & Load Cloud Counts
  const runHealthAudit = async () => {
    setIsTestingLatency(true);
    setIsCheckingCloudCounts(true);
    try {
      const lat = await checkFirestoreLatencyMs();
      setLatencyMs(lat);

      const counts = await fetchCloudDocumentCounts();
      setCloudCounts({
        consultations: counts.consultations,
        expenses: counts.expenses,
        amulets: counts.amulets,
      });

      addSyncLog({
        action: 'connection_check',
        collection: 'system',
        itemCount: counts.consultations + counts.expenses + counts.amulets,
        status: 'success',
        details: `Connection Audit: Latency ${lat}ms. Cloud Docs: Consultations (${counts.consultations}), Expenses (${counts.expenses})`,
      });
      setLogs(getSyncLogs());
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingLatency(false);
      setIsCheckingCloudCounts(false);
    }
  };

  useEffect(() => {
    runHealthAudit();
  }, []);

  const handleForcePush = async () => {
    setIsSyncing(true);
    setActionMessage(null);
    try {
      const res = await uploadAllLocalToCloud();
      setActionMessage(`အောင်မြင်ပါသည်! ဗေဒင်မှတ်တမ်း (${res.uploadedConsultations}) ခုနှင့် အသုံးစရိတ် (${res.uploadedExpenses}) ခုကို Cloud သို့ ပို့တင်ပြီးပါပြီ။`);
      runHealthAudit();
      onRefreshLocalData();
    } catch (e) {
      setActionMessage(`Cloud သို့ ပို့တင်ရာတွင် ချို့ယွင်းချက် ဖြစ်ပေါ်ပါသည်: ${String(e)}`);
    } finally {
      setIsSyncing(false);
      setLogs(getSyncLogs());
    }
  };

  const handleForcePull = async () => {
    if (!window.confirm('Cloud မှ ဒေတာများ ဒေါင်းလုဒ်ဆွဲပြီး စက်ထဲသို့ အစားထိုး သိမ်းဆည်းရန် သေချာပါသလား?')) return;
    setIsSyncing(true);
    setActionMessage(null);
    try {
      const res = await pullAllCloudToLocal();
      setActionMessage(`အောင်မြင်ပါသည်! ဗေဒင်မှတ်တမ်း (${res.downloadedConsultations}) ခုနှင့် အသုံးစရိတ် (${res.downloadedExpenses}) ခုကို Cloud မှ ရယူပြီးပါပြီ။`);
      runHealthAudit();
      onRefreshLocalData();
    } catch (e) {
      setActionMessage(`Cloud မှ ဒေါင်းလုဒ်ဆွဲရာတွင် ချို့ယွင်းချက် ဖြစ်ပေါ်ပါသည်: ${String(e)}`);
    } finally {
      setIsSyncing(false);
      setLogs(getSyncLogs());
    }
  };

  const handleSaveDeviceName = (e: React.FormEvent) => {
    e.preventDefault();
    saveDeviceName(deviceName);
    setIsSavedDeviceName(true);
    setTimeout(() => setIsSavedDeviceName(false), 2000);
  };

  const filteredLogs = logs.filter(l => {
    if (filterAction === 'all') return true;
    return l.action === filterAction;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-stone-850 p-5 rounded-2xl border border-amber-500/30 shadow-xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-amber-200">
                Sync Monitor Dashboard (Cloud & Real-time Live Engine)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active Live Monitor
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Google Cloud Firestore Real-time Listeners, Data Integrity & Multi-device Live Synchronization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runHealthAudit}
            disabled={isTestingLatency || isCheckingCloudCounts}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-xs font-semibold transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingLatency ? 'animate-spin' : ''}`} />
            <span>စစ်ဆေးမှု ပြန်လုပ်မည်</span>
          </button>
        </div>
      </div>

      {/* Primary Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Network & Online Status */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>ကွန်ရက် အခြေအနေ</span>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            {isOnline ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Online
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Offline
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400">
            {isOnline ? 'Google Cloud သို့ ချိတ်ဆက်ထားပါသည်' : 'Offline Cache မုဒ်ဖြင့် အလုပ်လုပ်နေပါသည်'}
          </p>
        </div>

        {/* Card 2: Firestore Ping Latency */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>Firestore Latency Ping</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {latencyMs !== null ? `${latencyMs} ms` : 'စစ်ဆေးနေဆဲ...'}
          </div>
          <p className="text-[11px] text-stone-400">
            {latencyMs !== null && latencyMs < 200 ? '⚡ အလွန်လျင်မြန်ပါသည် (Optimal Speed)' : 'ပုံမှန် တုံ့ပြန်မှု အမြန်နှုန်း'}
          </p>
        </div>

        {/* Card 3: 48-Hour Sync Status */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>နောက်ဆုံး Manual Sync</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-bold text-stone-200 truncate" title={formatLastSyncRelative(lastSyncTime)}>
            {formatLastSyncRelative(lastSyncTime)}
          </div>
          <p className="text-[11px]">
            {isOverdue ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> ၄၈ နာရီကျော် (Sync ပြုလုပ်ရန် လိုအပ်)
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">နောက်ဆုံးပေါ် အဆင့်တွင် ရှိပါသည်</span>
            )}
          </p>
        </div>

        {/* Card 4: Realtime Active Listeners */}
        <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 shadow-lg space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400">
            <span>Realtime Listeners</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300">
            3 Active
          </div>
          <p className="text-[11px] text-stone-400">
            Consultations, Expenses & Amulets
          </p>
        </div>

      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block text-sm text-emerald-300">Sync လုပ်ဆောင်ချက် အောင်မြင်ပါသည်</span>
            <p className="leading-relaxed">{actionMessage}</p>
          </div>
        </div>
      )}

      {/* Data Sync & Document Audit Table */}
      <div className="bg-stone-850 rounded-2xl border border-stone-800 shadow-xl overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-stone-100 text-base">
              Local vs Cloud Document Audit & Sync Controls
            </h3>
          </div>
          <span className="text-xs text-stone-400">
            စက်တွင်း မှတ်တမ်းနှင့် Cloud ရှိ မှတ်တမ်းအရေအတွက် တိုက်ဆိုင်စစ်ဆေးမှု
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Collection 1: Consultations */}
          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 border-b border-stone-800 pb-2">
              <span>ဗေဒင်မှတ်တမ်းများ (Consultations)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                Main Collection
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">စက်တွင်း Local</span>
                <span className="text-lg font-bold font-mono text-stone-100">{consultations.length}</span>
              </div>
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Cloud Firestore</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {cloudCounts ? cloudCounts.consultations : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Collection 2: Expenses */}
          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 border-b border-stone-800 pb-2">
              <span>အသုံးစရိတ်များ (Expenses)</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                Finances
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">စက်တွင်း Local</span>
                <span className="text-lg font-bold font-mono text-stone-100">{expenses.length}</span>
              </div>
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Cloud Firestore</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {cloudCounts ? cloudCounts.expenses : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Collection 3: Amulets Catalog */}
          <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-purple-300 border-b border-stone-800 pb-2">
              <span>အဆောင်ပစ္စည်းများ (Amulets POS)</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px]">
                Catalog
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">စက်တွင်း Local</span>
                <span className="text-lg font-bold font-mono text-stone-100">{amulets.length}</span>
              </div>
              <div className="bg-stone-850 p-2.5 rounded-lg border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Cloud Firestore</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {cloudCounts ? cloudCounts.amulets : '-'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Sync Controls Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-stone-800">
          <button
            type="button"
            onClick={handleForcePush}
            disabled={isSyncing || !isOnline}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>🚀 စက်တွင်း ဒေတာများ Cloud သို့ Force-Push လုပ်မည်</span>
          </button>

          <button
            type="button"
            onClick={handleForcePull}
            disabled={isSyncing || !isOnline}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-blue-300 border border-blue-500/40 font-bold text-xs shadow transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <DownloadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>📥 Cloud မှ ဒေတာများ စက်ထဲသို့ Force-Pull ယူမည်</span>
          </button>
        </div>
      </div>

      {/* Connected Device Profile & Activity Logs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Device Profile Card */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-bold text-stone-100 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>လက်ရှိ စက်အမှတ်အသား (Device Profile)</span>
            </h3>
          </div>

          <form onSubmit={handleSaveDeviceName} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-stone-400">စက်/ကောင်တာ အမည်:</label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceNameState(e.target.value)}
                placeholder="ဥပမာ- ဆရာ့စက်၊ ကောင်တာ ၁"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-400">Device ID:</label>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 font-mono text-[11px] text-amber-300 truncate">
                {deviceId}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
            >
              {isSavedDeviceName ? 'သိမ်းဆည်းပြီးပါပြီ' : 'စက်အမည် သိမ်းမည်'}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400 space-y-1">
            <span className="font-semibold text-stone-300 block">Multi-Device Cloud Isolation:</span>
            <span>စက်အလိုက် သီးခြား အမှတ်အသားပြုထားသဖြင့် မည်သည့်စက်မှ သွင်းသည့် စာရင်းမဆို Audit Log တွင် တိကျစွာ မှတ်တမ်းတင်ပါမည်။</span>
          </div>
        </div>

        {/* Real-time Sync Activity Logs */}
        <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-stone-100 text-sm">
                Real-time Sync Activity Logs (နောက်ဆုံး လုပ်ဆောင်ချက်များ)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="bg-stone-900 border border-stone-700 text-stone-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">လုပ်ဆောင်ချက် (အားလုံး)</option>
                <option value="manual_push">Manual Push</option>
                <option value="manual_pull">Manual Pull</option>
                <option value="connection_check">Audit Test</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  clearSyncLogs();
                  setLogs([]);
                }}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                title="Log များ ရှင်းထုတ်မည်"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-stone-500 text-xs py-8">
                Sync လှုပ်ရှားမှု မှတ်တမ်း မရှိသေးပါ။
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        log.status === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className="font-semibold text-stone-200">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      {new Date(log.timestamp).toLocaleString('my-MM')}
                    </span>
                  </div>

                  <span className="font-mono text-amber-400 font-bold shrink-0">
                    {log.itemCount} items
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
