import React from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Cloud, 
  RefreshCw, 
  AlertCircle, 
  CloudCheck, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';
import { CloudVersionInfo } from '../utils/versionCheck';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-200">
                  Version History & Cloud Synchronization
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                  Cloud Authoritative
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Online ဝင်တိုင်း Cloud ဗားရှင်းနှင့် Local ဗားရှင်း တိုက်စစ်ဆေးမှု
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cloud Comparison Status Card */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs sm:text-sm">
          
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
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCloud ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isCheckingCloud ? 'စစ်ဆေးနေဆဲ...' : 'ယခု ပြန်လည်စစ်ဆေးမည်'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[11px]">အတည်ပြု Cloud ဗားရှင်း:</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {cloudInfo ? `v${cloudInfo.version}` : 'စစ်ဆေးဆဲ...'}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">(Cloud Authoritative)</span>
              </div>

              <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[11px]">စက်အတွင်း Local ဗားရှင်း:</span>
                <span className="text-base font-bold font-mono text-amber-300">
                  v{localVersion}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">(Device Cached)</span>
              </div>
            </div>

            {/* Cloud Version Status Badge */}
            {isNewVersionAvailable ? (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          {/* Cloud Authoritative Release Notes */}
          {cloudInfo && (
            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="font-bold text-stone-100 flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Cloud ဗားရှင်း (v{cloudInfo.version}) ပါဝင်သော အချက်များ:</span>
                </h4>
                <span className="text-xs text-stone-400">{cloudInfo.releaseDate}</span>
              </div>

              <ul className="space-y-2 text-stone-300 text-xs">
                {cloudInfo.changelog.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Historical Version Logs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase font-bold text-stone-400 tracking-wider">
              ယခင် ဗားရှင်းမှတ်တမ်းများ (History)
            </h4>

            <div className="p-3 rounded-xl bg-stone-850/60 border border-stone-800 text-xs space-y-1 text-stone-400">
              <div className="flex justify-between font-semibold text-stone-300">
                <span>v1.2.0 - PWA Mobile App & Clean Slate Data</span>
                <span>၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ</span>
              </div>
              <p>သန့်ရှင်းသော မူလစာရင်း၊ PWA Install နှင့် Offline စနစ်များ ထည့်သွင်းခြင်း။</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-850/60 border border-stone-800 text-xs space-y-1 text-stone-400">
              <div className="flex justify-between font-semibold text-stone-300">
                <span>v1.1.0 - Monthly Reports & Royal VIP Dossier</span>
                <span>၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ</span>
              </div>
              <p>လစဉ် ဝင်ငွေ/ထွက်ငွေ ရှင်းတမ်း၊ Royal VIP ဖောက်သည်များနှင့် ပြေစာပရင့် စနစ်။</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-850/60 border border-stone-800 text-xs space-y-1 text-stone-400">
              <div className="flex justify-between font-semibold text-stone-300">
                <span>v1.0.0 - Initial Release</span>
                <span>၂၀၂၆ ခုနှစ်၊ စက်တင်ဘာ</span>
              </div>
              <p>ကနဦး ဗေဒင်မေးသူများ မှတ်တမ်း၊ နဝင်းယတြာနှင့် အဆောင်ပစ္စည်း POS စနစ်။</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Cloudflare Pages Static Production Ready
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
