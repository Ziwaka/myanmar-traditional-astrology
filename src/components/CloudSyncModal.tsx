import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  UploadCloud, 
  ShieldCheck, 
  Smartphone,
  Laptop,
  Monitor,
  Layers,
  Check,
  Save,
  Lock,
  GitMerge
} from 'lucide-react';
import { uploadAllLocalToCloud } from '../utils/firebase';
import { getDeviceId, getDeviceName, saveDeviceName } from '../utils/deviceProfile';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  totalConsultations: number;
  totalExpenses: number;
  onSyncComplete?: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  totalConsultations,
  totalExpenses,
  onSyncComplete,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Device name configuration
  const [deviceName, setDeviceNameState] = useState<string>(getDeviceName());
  const [isSavedName, setIsSavedName] = useState(false);
  const deviceId = getDeviceId();

  if (!isOpen) return null;

  const handleSaveDeviceName = (e: React.FormEvent) => {
    e.preventDefault();
    saveDeviceName(deviceName);
    setIsSavedName(true);
    setTimeout(() => setIsSavedName(false), 2500);
  };

  const handlePushAll = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await uploadAllLocalToCloud();
      setSyncResult(`အောင်မြင်ပါသည်! ဗေဒင်မှတ်တမ်း (${res.uploadedConsultations}) ခုနှင့် အသုံးစရိတ် (${res.uploadedExpenses}) ခုကို Google Cloud Database သို့ တင်ပို့လိုက်ပါပြီ။ စက်အားလုံးတွင် ချက်ချင်း အလိုအလျောက် ပေါ်လာပါမည်။`);
      if (onSyncComplete) onSyncComplete();
    } catch (e) {
      setSyncResult(`Cloud သို့ တင်ပို့ရာတွင် ချို့ယွင်းချက် ဖြစ်ပေါ်ပါသည်: ${String(e)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[94vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Cloud className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-emerald-200">
                  Google Cloud Multi-Device Sync
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Real-time Active
                </span>
              </div>
              <p className="text-xs text-stone-400">
                လူ (၂) ဦးမက စက်များစွာ ပြိုင်တူ စာရင်းသွင်းနိုင်သော Cloud Database စနစ်
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          
          {/* Workstation / Device Identity Setting */}
          <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>ဤစက်၏ တာဝန်ခံ အမည် သတ်မှတ်ခြင်း (Audit Identity)</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">ID: {deviceId}</span>
            </div>
            <p className="text-[11px] text-stone-400">
              မှတ်တမ်းသွင်းသူ/ပြင်သူကို သိရှိနိုင်ရန် ဤစက်၏ အမည်ကို သတ်မှတ်ထားနိုင်ပါသည် (ဥပမာ- ကောင်တာ ၁၊ ဆရာ့အခန်း၊ မန်နေဂျာ ဖုန်း)။
            </p>
            <form onSubmit={handleSaveDeviceName} className="flex gap-2">
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceNameState(e.target.value)}
                placeholder="ဥပမာ- ကောင်တာ (၁) / ဆရာ့အခန်း"
                className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSavedName ? <Check className="w-3.5 h-3.5 text-stone-950" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSavedName ? 'သိမ်းပြီး' : 'အမည်သိမ်းမည်'}</span>
              </button>
            </form>
          </div>

          {/* Multi-Device Architecture Card (Beyond 2 Users) */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-stone-850 to-stone-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-stone-300">
              <span className="font-semibold text-xs flex items-center gap-1.5 text-emerald-300">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>စက်များစွာ (၂ ဦးမက ၃၊ ၅၊ ၁၀ ဦး) ပြိုင်တူ ချိတ်ဆက်မှု</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {isOnline ? 'ONLINE • AUTO-SYNC' : 'OFFLINE MODE'}
              </span>
            </div>

            {/* Architecture Flow */}
            <div className="grid grid-cols-3 gap-2 py-3 bg-stone-900/90 rounded-xl border border-stone-800 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-stone-200">ကောင်တာ ၁</span>
                <span className="text-[10px] text-stone-500">ဧည့်သည်စာရင်းသွင်း</span>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 text-emerald-400">
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '4s' }} />
                  <Cloud className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold font-mono">Google Cloud</span>
                <span className="text-[9px] text-emerald-500">Zero Latency</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Laptop className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-stone-200">ဆရာ့အခန်း / စက် ၂</span>
                <span className="text-[10px] text-stone-500">ဟောချက်ဖြည့်/ကြည့်</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Google Cloud Firestore သည် ကမ္ဘာ့အဆင့်မီ စနစ်ဖြစ်သဖြင့် <strong>လူ (၂) ယောက်သာမက (၁၀) ယောက်၊ အခန်းပေါင်းစုံ၊ ကောင်တာပေါင်းစုံ</strong> မှ တစ်ပြိုင်နက် သုံးစွဲနိုင်ပါသည်။
            </p>
          </div>

          {/* Overwrite & Duplicate Protection Mechanisms */}
          <div className="p-4 rounded-2xl bg-stone-850/80 border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold text-stone-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Overwrite & Duplicate ပြဿနာ ကာကွယ်ထားပုံ</span>
            </h4>

            <div className="space-y-2.5 text-[11px] text-stone-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200 block">၁။ Duplicate ID တိုက်မိမှု အလိုအလျောက် ရှင်းထုတ်ခြင်း</strong>
                  <span>လူ ၂ ယောက်က တစ်ချိန်တည်းတွင် "အသစ်သွင်းမည်" ကို နှိပ်လျှင်လည်း စနစ်မှ Cloud Database ရှိ ID များကို စစ်ဆေး၍ ထပ်မသွားစေရန် နောက်နံပါတ်အသစ်သို့ Auto-bump ပြုလုပ်ပေးပါသည်။ မည်သည့်မှတ်တမ်းမှ ထပ်မသွားပါ (Zero Duplication)။</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <GitMerge className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-200 block">၂။ Smart Field Merging (မှတ်တမ်း အစားထိုး မပျောက်ပျက်ခြင်း)</strong>
                  <span>ဆရာက ဟောချက်ရေးနေချိန်တွင် ကောင်တာမှ ငွေလက်ခံပြီး Paid ဟု ပြောင်းလိုက်ပါက နှစ်ခုစလုံးကို ပေါင်းစည်း (Deep Merge) သွားစေပြီး တစ်ဦးရေးထားသည်ကို နောက်တစ်ဦးက ဖျက်ချမသွားနိုင်ပါ (No Overwrite)။</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <Layers className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-200 block">၃။ Audit Trail (ဘယ်သူသွင်း/ဘယ်သူပြင် မှတ်တမ်း)</strong>
                  <span>မှတ်တမ်းတိုင်းတွင် မည်သည့်စက်/တာဝန်ခံက စတင်သွင်းခဲ့ပြီး မည်သည့်စက်က နောက်ဆုံးအချိန်တွင် ပြင်ဆင်ခဲ့သည်ကို သမိုင်းမှတ်တမ်း အတိအကျ ထိန်းသိမ်းထားပါသည်။</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sync action message */}
          {syncResult && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{syncResult}</span>
            </div>
          )}

          {/* Push local to cloud button */}
          <div className="p-4 rounded-2xl bg-stone-850/60 border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-200">
                စက်ထဲရှိ စာရင်းများကို Cloud သို့ အားလုံး ပို့တင်ရန်
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                မှတ်တမ်း {totalConsultations} ခု
              </span>
            </div>
            <button
              onClick={handlePushAll}
              disabled={isSyncing || !isOnline}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 text-white font-bold text-xs transition cursor-pointer"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Cloud သို့ ပို့တင်နေပါသည်...' : 'လက်ရှိစာရင်း အားလုံး Cloud သို့ Sync လုပ်မည်'}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Google Firestore Multi-Tenant Cloud Architecture
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-bold text-xs transition cursor-pointer"
          >
            ပိတ်မည်
          </button>
        </div>

      </div>
    </div>
  );
};
