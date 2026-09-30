import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  X, 
  Sparkles, 
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const ForcedPWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed as standalone PWA or manually dismissed in session, don't show
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Forced Floating Install Banner at bottom */}
      <aside 
        aria-label="PWA Application Installation Prompt"
        className="fixed bottom-3 inset-x-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-stone-900/95 backdrop-blur-md border border-amber-500/50 rounded-3xl p-3.5 shadow-2xl shadow-amber-950/40 text-stone-100 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-200 text-xs sm:text-sm truncate">
                  ဖုန်းတွင် App အဖြစ် သွင်းယူပါ
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 shrink-0">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                အင်တာနက်မရှိချိန်နှင့် Fullscreen သုံးရန်
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              title="ခေတ္တပိတ်မည်"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Step-by-Step Installation Guide Modal (For iOS Safari or Chrome when direct prompt isn't fired) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 my-auto animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-200 text-sm sm:text-base">
                    {isIOS ? 'iPhone / iPad တွင် App သွင်းနည်း' : 'Android / Chrome တွင် App သွင်းနည်း'}
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    Home Screen တွင် Icon အဖြစ် ထည့်သွင်းခြင်း
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Instructions */}
            {isIOS ? (
              <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၁
                    </div>
                    <div>
                      <p className="font-medium">
                        Safari Browser ၏ အောက်ခြေ (သို့မဟုတ် ထိပ်) ရှိ <strong>Share ခလုတ်</strong> ကို နှိပ်ပါ:
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-700 text-amber-300 text-xs w-fit">
                        <Share2 className="w-4 h-4" />
                        <span>Share (မျှဝေရန် ခလုတ်)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၂
                    </div>
                    <div>
                      <p className="font-medium">
                        အောက်သို့ အနည်းငယ်ဆွဲချ၍ <strong>"Add to Home Screen"</strong> (ပင်မစခရင်သို့ ထည့်ရန်) ကို နှိပ်ပါ:
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-700 text-amber-300 text-xs w-fit">
                        <PlusSquare className="w-4 h-4" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၃
                    </div>
                    <div>
                      <p className="font-medium">
                        ထိပ်ညာဘက်ရှိ <strong>"Add"</strong> ကို နှိပ်လိုက်ပါက သင့်ဖုန်း မျက်နှာပြင်တွင် App အဖြစ် တန်းပေါ်လာပါမည်။
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၁
                    </div>
                    <div>
                      <p className="font-medium">
                        Chrome Browser ၏ ထိပ်ညာဘက်ရှိ <strong>အစက် ၃ စက် (⋮) Menu</strong> ကို နှိပ်ပါ:
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၂
                    </div>
                    <div>
                      <p className="font-medium">
                        Menu ထဲမှ <strong>"Install App" (အက်ပ် ထည့်သွင်းပါ)</strong> သို့မဟုတ် <strong>"Add to Home screen"</strong> ကို နှိပ်ပါ:
                      </p>
                      <div className="mt-1.5 flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-700 text-amber-300 text-xs w-fit">
                        <Download className="w-4 h-4" />
                        <span>Install App (အက်ပ် ထည့်သွင်းပါ)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      ၃
                    </div>
                    <div>
                      <p className="font-medium">
                        <strong>"Install"</strong> ကို အတည်ပြုပေးလိုက်ပါက ဖုန်းထဲတွင် App ကဲ့သို့ သီးခြား ပွင့်လာပါမည်။
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-bold text-xs sm:text-sm transition"
              >
                နားလည်ပါပြီ (Close)
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
