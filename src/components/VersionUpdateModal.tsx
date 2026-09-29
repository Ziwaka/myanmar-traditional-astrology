import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpCircle, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Tag, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';
import { CloudVersionInfo } from '../utils/versionCheck';

interface VersionUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudInfo: CloudVersionInfo | null;
  localVersion: string;
  onApplyUpdate: () => void;
}

export const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  onClose,
  cloudInfo,
  localVersion,
  onApplyUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !cloudInfo) return null;

  const handleUpdateClick = () => {
    setIsUpdating(true);
    // Smooth transition before reloading with latest version
    setTimeout(() => {
      onApplyUpdate();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200 ring-2 ring-amber-500/30">
        
        {/* Header with Sparkle Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-stone-950 border-b border-amber-500/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-amber-200">
                  ဗားရှင်းအသစ် (v{cloudInfo.version}) ထွက်ရှိပါပြီ!
                </h2>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                အလိုအလျောက် တိုက်စစ်ဆေးမှုမှ နောက်ဆုံးပေါ် Version အသစ်ကို တွေ့ရှိထားပါသည်
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] text-xs sm:text-sm">
          
          {/* Comparison Pill */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-850 p-3 rounded-2xl border border-stone-800">
              <span className="text-[11px] text-stone-400 block">သင့်စက်ရှိ ဗားရှင်း:</span>
              <span className="text-base font-bold font-mono text-stone-300">v{localVersion}</span>
              <span className="text-[10px] text-stone-500 block mt-0.5">လက်ရှိ သုံးစွဲနေဆဲ</span>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
              <span className="text-[11px] text-amber-300 block font-semibold">Cloud ဗားရှင်းအသစ်:</span>
              <span className="text-base font-bold font-mono text-amber-400">v{cloudInfo.version}</span>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">✨ Latest Recommended</span>
            </div>
          </div>

          {/* Release Date & Title */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-850/80 border border-stone-800 text-xs text-stone-300">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>{cloudInfo.title}</span>
            </span>
            <span className="text-stone-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{cloudInfo.releaseDate}</span>
            </span>
          </div>

          {/* Detailed Changelog */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-amber-300 tracking-wider">
              ဤဗားရှင်းတွင် ပြင်ဆင်မွမ်းမံထားသော အသေးစိတ် အချက်အလက်များ:
            </h4>
            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2.5">
              {cloudInfo.changelog.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-200 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notice info */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2">
            <ArrowUpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Update ပြုလုပ်ရာတွင် စာရင်းဒေတာများ ပျောက်ပျက်ခြင်း လုံးဝ မရှိဘဲ စနစ်အတွင်းရှိ Cache များကို နောက်ဆုံးပေါ် ဗားရှင်းသို့ အလိုအလျောက် လဲလှယ်ပေးမည် ဖြစ်ပါသည်။
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-semibold text-xs transition cursor-pointer"
          >
            နောက်မှ သွင်းမည်
          </button>

          <button
            type="button"
            onClick={handleUpdateClick}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isUpdating ? 'Update ပြုလုပ်နေပါသည်...' : '✨ ယခု ဗားရှင်းအသစ်သို့ တင်မည် (Update Now)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
