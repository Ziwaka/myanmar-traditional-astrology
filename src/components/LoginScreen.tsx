import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  AlertCircle 
} from 'lucide-react';
import { performLogin, SUPER_ADMIN_CREDENTIALS } from '../utils/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = performLogin(username, password);
      if (success) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('User Name သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-stone-950 relative overflow-hidden">
      
      {/* Background Astrological Aura */}
      <div className="absolute w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none -top-24 -left-24" />
      <div className="absolute w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-3xl pointer-events-none -bottom-24 -right-24" />

      <div className="w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* App Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-stone-950 font-bold border border-amber-300/40">
            <Crown className="w-9 h-9" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်း
            </h1>
            <p className="text-xs text-amber-400/90 font-medium mt-1">
              Super Admin စနစ်သို့ ဝင်ရောက်ခြင်း (Authentication)
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-medium focus:outline-none focus:border-amber-500 transition"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg transition active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>ဝင်ရောက်နေပါသည်...</span>
            ) : (
              <>
                <span>Super Admin အဖြစ် ဝင်ရောက်မည်</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>

      {/* Footer System Badges */}
      <div className="mt-6 text-center text-xs text-stone-500 space-y-1">
        <p>မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်းနှင့် ဝန်ဆောင်မှု POS စနစ် • Cloudflare Pages Ready</p>
      </div>

    </div>
  );
};
