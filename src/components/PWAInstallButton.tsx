import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, X, Share2, PlusSquare, Info } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'sidebar' | 'header' | 'banner' | 'icon';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'sidebar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed as Standalone app, hide on mobile/header
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

  // Header / Top Navbar compact button
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={isInstallable ? install : () => setShowGuide(true)}
          title="ဖုန်းတွင် App အဖြစ် သွင်းယူရန်"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer active:scale-95 shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold hidden sm:inline">App Install</span>
          <span className="font-semibold sm:hidden">Install</span>
        </button>

        {showGuide && renderGuideModal(() => setShowGuide(false), isIOS)}
      </>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={isInstallable ? install : () => setShowGuide(true)}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>ဖုန်းတွင် App Install ပြုလုပ်ရန်</span>
        </button>

        {showGuide && renderGuideModal(() => setShowGuide(false), isIOS)}
      </>
    );
  }

  // Floating or banner variant
  return (
    <>
      <button
        onClick={isInstallable ? install : () => setShowGuide(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-medium transition cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-amber-400" />
        <span>PWA App သွင်းရန်</span>
      </button>

      {showGuide && renderGuideModal(() => setShowGuide(false), isIOS)}
    </>
  );
};

function renderGuideModal(onClose: () => void, isIOS: boolean) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-amber-500/50 p-6 shadow-2xl text-stone-100 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <span>{isIOS ? 'iPhone / iPad တွင် App သွင်းနည်း' : 'ဖုန်း / Browser တွင် App သွင်းနည်း'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3.5 text-xs text-stone-300">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-200 block">အဆင့် ၁:</strong>
                <span>Safari Browser ၏ အောက်ခြေရှိ <strong>Share (မျှဝေရန်)</strong> ခလုတ်ကို နှိပ်ပါ။</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-200 block">အဆင့် ၂:</strong>
                <span>အောက်သို့ အနည်းငယ်ဆွဲချပြီး <strong>"Add to Home Screen (ပင်မစာမျက်နှာသို့ ထည့်ရန်)"</strong> ကို ရွေးချယ်ပါ။</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-emerald-400 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-emerald-300 block">အဆင့် ၃:</strong>
                <span>ညာဘက်အပေါ်ထောင့်ရှိ <strong>"Add"</strong> ကို နှိပ်လိုက်ပါက သင့်ဖုန်းတွင် သီးသန့် Mobile App အဖြစ် ချက်ချင်း သုံးနိုင်ပါပြီ။</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-stone-300">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-200 block">အဆင့် ၁:</strong>
                <span>Chrome / Browser ၏ ညာဘက်အပေါ်ထောင့်ရှိ <strong>(၃ စက်ပြောက် Menu)</strong> ကို နှိပ်ပါ။</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 mt-0.5">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-amber-200 block">အဆင့် ၂:</strong>
                <span><strong>"Install app"</strong> သို့မဟုတ် <strong>"Add to Home screen (ပင်မစာမျက်နှာသို့ ထည့်မည်)"</strong> ကို ရွေးချယ်ပါ။</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 text-emerald-400 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-emerald-300 block">အဆင့် ၃:</strong>
                <span>"Install" ကို အတည်ပြုပေးလိုက်ပါက ဖုန်း၏ Home Screen တွင် သီးသန့် App အဖြစ် ထည့်သွင်းပြီးစီးပါမည်။</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
        >
          နားလည်ပါပြီ (Close)
        </button>
      </div>
    </div>
  );
}
