import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'sidebar' | 'banner' | 'icon';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'sidebar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as Standalone app
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>PWA App အဖြစ် သွင်းယူပြီး (Installed)</span>
        </div>
      );
    }
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
      >
        <Smartphone className="w-4 h-4" />
        <span>ဖုန်း/ကွန်ပျူတာတွင် App Install ပြုလုပ်ရန်</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 font-semibold text-xs transition cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>iPhone / iPad တွင် App သွင်းရန်</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-amber-500/40 p-5 shadow-2xl text-stone-100 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  <span>iPhone / iPad တွင် သွင်းနည်း</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong>အဆင့် ၁:</strong> Safari Browser ၏ အောက်ခြေရှိ <strong>Share (မျှဝေရန်)</strong> ခလုတ်ကို နှိပ်ပါ။
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong>အဆင့် ၂:</strong> အောက်သို့ အနည်းငယ်ဆွဲချပြီး <strong>"Add to Home Screen (ပင်မစာမျက်နှာသို့ ထည့်ရန်)"</strong> ကို ရွေးချယ်ပါ။
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-stone-800 border border-stone-700 text-emerald-400 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong>အဆင့် ၃:</strong> ညာဘက်အပေါ်ထောင့်ရှိ <strong>"Add"</strong> ကို နှိပ်လိုက်ပါက သင့်ဖုန်းတွင် သီးသန့် Mobile App အဖြစ် အသုံးပြုနိုင်ပါပြီ။
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
              >
                နားလည်ပါပြီ (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback generic browser install button
  return (
    <button
      onClick={() => {
        alert('သင့် Browser ၏ Menu (၃ စက်ပြောက်) မှ "Install App" သို့မဟုတ် "Add to Home screen" ကို နှိပ်၍ App အဖြစ် တိုက်ရိုက်သွင်းယူနိုင်ပါသည်။');
      }}
      className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium transition cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-amber-400" />
      <span>PWA App အဖြစ် သွင်းယူနည်း</span>
    </button>
  );
};
