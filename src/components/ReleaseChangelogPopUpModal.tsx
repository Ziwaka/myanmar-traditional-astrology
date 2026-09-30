import React from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Users, 
  Flame, 
  ShoppingBag, 
  Crown,
  ArrowRight,
  History
} from 'lucide-react';
import { ALL_VERSION_HISTORY, LOCAL_APP_VERSION, VersionRelease } from '../utils/versionCheck';

interface ReleaseChangelogPopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  version?: string;
}

export const ReleaseChangelogPopUpModal: React.FC<ReleaseChangelogPopUpModalProps> = ({
  isOpen,
  onClose,
  version = LOCAL_APP_VERSION,
}) => {
  if (!isOpen) return null;

  const currentRelease = ALL_VERSION_HISTORY.find(v => v.version === version) || ALL_VERSION_HISTORY[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-auto border-t-amber-400">
        
        {/* Celebration Gradient Header */}
        <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-5 sm:p-6 text-stone-950 relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-950/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-200 shadow-inner">
                <Sparkles className="w-7 h-7 animate-pulse text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-950/40 text-amber-200 font-mono font-bold text-xs border border-white/20">
                    v{currentRelease.version}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-200 font-bold text-[10px] border border-emerald-400/30">
                    New Update
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-stone-950 mt-1 leading-tight">
                  Update အသစ် အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ!
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-950/20 hover:bg-stone-950/40 text-stone-950 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Changelog Highlights */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[65vh] text-xs sm:text-sm">
          
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              {currentRelease.releaseDate} • {currentRelease.title}
            </span>
            <p className="text-xs text-stone-300">
              ဗေဒင်မေးသူ စာရင်းနှင့် POS စနစ်အား ပိုမိုမြန်ဆန် ချောမွေ့စေရန် အောက်ပါ အချက်များကို အဆင့်မြှင့်တင်ထားပါသည်:
            </p>
          </div>

          {/* Changelog Bullet Items */}
          <div className="space-y-2.5">
            {currentRelease.changelog.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-2xl bg-stone-850/80 border border-stone-800 text-stone-200 leading-relaxed hover:border-amber-500/40 transition"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <span className="text-xs sm:text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Quick Features Highlight Pill Grid */}
          <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-2 text-[11px] text-stone-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
              <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">PWA Mobile App</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Multi-Role RBAC</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Custom Yatra System</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/60 border border-stone-800">
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">Custom Amulets POS</span>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-stone-400 font-medium">
            ဗားရှင်း: <strong className="font-mono text-amber-300">v{currentRelease.version}</strong>
          </span>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer"
          >
            <span>နားလည်ပါပြီ (Got it)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
