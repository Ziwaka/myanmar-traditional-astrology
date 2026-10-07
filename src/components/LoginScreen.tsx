import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  AlertCircle,
  Users,
  Cloud,
  History
} from 'lucide-react';
import { performLogin, UserAccount } from '../utils/auth';
import { LOCAL_APP_VERSION } from '../utils/versionCheck';
import { ForcedPWAInstallBanner } from './ForcedPWAInstallBanner';
import { ReleaseChangelogPopUpModal } from './ReleaseChangelogPopUpModal';
import { AstrologyLogo } from './AstrologyLogo';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('Amt');
  const [password, setPassword] = useState('Amt999');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = performLogin(username, password);
      if (result.success && result.user) {
        setIsLoading(false);
        onLoginSuccess(result.user);
      } else {
        setIsLoading(false);
        setError(result.error || 'User Name သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
      }
    }, 200);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-stone-950 relative overflow-hidden">
      
      {/* Background Astrological Aura */}
      <div className="absolute w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none -top-24 -left-24" />
      <div className="absolute w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-3xl pointer-events-none -bottom-24 -right-24" />

      {/* Top Floating Version Badge */}
      <div className="mb-4 z-10">
        <button
          onClick={() => setIsChangelogModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-lg transition active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>v{LOCAL_APP_VERSION} Update အသစ် Changelog ကြည့်ရန်</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-5">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-3">
          <AstrologyLogo className="w-20 h-20 mx-auto" />

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              မြန်မာ့ရိုးရာဗေဒင်ပညာ
            </h1>
            <p className="text-xs text-amber-400/90 font-medium mt-1">
              User Account Management & POS စနစ်သို့ ဝင်ရောက်ခြင်း
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>User Name *</span>
            </label>
            <input
              type="text"
              placeholder="User Name ရိုက်ထည့်ပါ"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-medium focus:outline-none focus:border-amber-500 transition font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Password *</span>
            </label>
            <input
              type="password"
              placeholder="Password ရိုက်ထည့်ပါ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 transition font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>စစ်ဆေးနေပါသည်...</span>
            ) : (
              <>
                <span>အကောင့်သို့ ဝင်ရောက်မည်</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Demo Roles */}
        <div className="pt-3 border-t border-stone-800 text-xs space-y-2">
          <span className="text-[11px] text-stone-400 font-semibold block text-center">
            အမြန်စမ်းသပ် ဝင်ရောက်ရန် (Role အလိုက် နှိပ်နိုင်ပါသည်):
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('Amt', 'Amt999')}
              className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-left transition cursor-pointer"
            >
              <div className="font-bold">👑 Super Admin</div>
              <div className="text-[10px] text-stone-400 font-mono">Amt / Amt999</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'Admin123')}
              className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-emerald-500/40 text-emerald-300 text-left transition cursor-pointer"
            >
              <div className="font-bold">⚡ Admin</div>
              <div className="text-[10px] text-stone-400 font-mono">admin / Admin123</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('senior1', 'Senior123')}
              className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-cyan-500/40 text-cyan-300 text-left transition cursor-pointer"
            >
              <div className="font-bold">✨ Senior Staff</div>
              <div className="text-[10px] text-stone-400 font-mono">senior1 / Senior123</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('staff1', 'Staff123')}
              className="p-2 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-300 text-left transition cursor-pointer"
            >
              <div className="font-bold">📝 Staff</div>
              <div className="text-[10px] text-stone-400 font-mono">staff1 / Staff123</div>
            </button>
          </div>
        </div>

      </div>

      {/* Footer System Badges */}
      <div className="mt-6 text-center text-xs text-stone-500 space-y-1">
        <p>မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်းနှင့် ဝန်ဆောင်မှု POS စနစ် • Multi-Role RBAC</p>
      </div>

      {/* Forced PWA Install Prompt Banner */}
      <ForcedPWAInstallBanner />

      {/* Changelog Modal */}
      <ReleaseChangelogPopUpModal
        isOpen={isChangelogModalOpen}
        onClose={() => setIsChangelogModalOpen(false)}
        version={LOCAL_APP_VERSION}
      />

    </div>
  );
};
