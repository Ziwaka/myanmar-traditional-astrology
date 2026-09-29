import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Cloud, 
  RefreshCw, 
  AlertCircle, 
  Tag, 
  ChevronDown,
  ChevronUp,
  History,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CloudVersionInfo, ALL_VERSION_HISTORY, VersionRelease } from '../utils/versionCheck';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudInfo: CloudVersionInfo | null;
  localVersion: string;
  isNewVersionAvailable: boolean;
  onApplyCloudUpdate: () => void;
  isCheckingCloud?: boolean;
  onCheckNow?: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  cloudInfo,
  localVersion,
  isNewVersionAvailable,
  onApplyCloudUpdate,
  isCheckingCloud = false,
  onCheckNow,
}) => {
  // Track expanded historical versions
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({
    '1.3.1': true,
    '1.3.0': true,
    '1.2.1': false,
    '1.2.0': false,
    '1.1.0': false,
    '1.0.0': false,
  });

  if (!isOpen) return null;

  const toggleExpand = (ver: string) => {
    setExpandedVersions(prev => ({
      ...prev,
      [ver]: !prev[ver]
    }));
  };

  const releases: VersionRelease[] = cloudInfo?.history || ALL_VERSION_HISTORY;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <History className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-200">
                  Version History & Changelog
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                  v{cloudInfo?.version || releases[0]?.version || '1.3.1'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                ဗားရှင်းအလိုက် ပြင်ဆင်မွမ်းမံမှု မှတ်တမ်းများနှင့် Cloud Synchronization
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

        {/* Content Area */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          
          {/* Cloud Version Comparison Card */}
          <div className="p-4 rounded-2xl bg-stone-850 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cloud ဗားရှင်း တိုက်စစ်ဆေးမှု ရလဒ်</span>
              </span>
              {onCheckNow && (
                <button
                  type="button"
                  onClick={onCheckNow}
                  disabled={isCheckingCloud}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs border border-stone-700 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCloud ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isCheckingCloud ? 'စစ်ဆေးနေဆဲ...' : 'ယခု ပြန်စစ်မည်'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[11px]">အတည်ပြု Cloud ဗားရှင်း:</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  v{cloudInfo?.version || releases[0]?.version}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">(Cloud Authoritative)</span>
              </div>

              <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[11px]">စက်အတွင်း လက်ရှိ ဗားရှင်း:</span>
                <span className="text-base font-bold font-mono text-amber-300">
                  v{localVersion}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">(Current Device)</span>
              </div>
            </div>

            {/* Cloud Version Status Badge */}
            {isNewVersionAvailable ? (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Cloud တွင် ဗားရှင်းအသစ် ရရှိနေပါပြီ!</strong>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Cloud အတည်ပြုဗားရှင်း ({cloudInfo?.version}) သို့ ချက်ချင်း အဆင့်မြှင့်တင်နိုင်ပါသည်။
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onApplyCloudUpdate}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap self-end sm:self-auto"
                >
                  Cloud ဗားရှင်းကို အတည်ယူမည်
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cloud စနစ်နှင့် တိုက်စစ်ဆေးပြီးပါပြီ။ သင့် App သည် Cloud ရှိ အတည်ပြုထားသော နောက်ဆုံးပေါ် ဗားရှင်း ဖြစ်ပါသည်။</span>
              </div>
            )}
          </div>

          {/* Complete Version History Timeline */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-stone-300 tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <span>ဗားရှင်း အပြည့်အစုံ မှတ်တမ်း (Full Version Changelog)</span>
              </h4>
              <span className="text-[11px] text-stone-500 font-mono">
                စုစုပေါင်း {releases.length} ကြိမ် မွမ်းမံထားသည်
              </span>
            </div>

            <div className="space-y-3">
              {releases.map((rel) => {
                const isExpanded = !!expandedVersions[rel.version];
                const isCurrent = rel.version === (cloudInfo?.version || releases[0]?.version);

                return (
                  <div 
                    key={rel.version}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isCurrent 
                        ? 'bg-stone-850/90 border-amber-500/40 ring-1 ring-amber-500/20' 
                        : 'bg-stone-850/50 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Header */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(rel.version)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                          isCurrent 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-stone-800 text-stone-300 border-stone-700'
                        }`}>
                          v{rel.version}
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-stone-100 text-xs sm:text-sm">
                              {rel.title}
                            </span>
                            {rel.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {rel.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            {rel.releaseDate}
                          </span>
                        </div>
                      </div>

                      <div className="p-1 rounded-lg text-stone-400 hover:text-stone-200">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Changelog List */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-stone-800/80">
                        <ul className="space-y-2 mt-2">
                          {rel.changelog.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-300 leading-relaxed">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCurrent ? 'text-amber-400' : 'text-emerald-400'}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloudflare Pages & Google Cloud Live Production Ready</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
          >
            နားလည်ပါပြီ (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
