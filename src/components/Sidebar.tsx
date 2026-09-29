import React from 'react';
import { 
  Sparkles, 
  CalendarDays, 
  TrendingUp, 
  Crown, 
  Wallet, 
  ShoppingBag, 
  PlusCircle, 
  Download, 
  Trash2, 
  Lock, 
  User, 
  Tag, 
  Smartphone, 
  X, 
  LogOut,
  ChevronRight, 
  ShieldCheck, 
  Building2,
  CloudCheck,
  Cloud
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { SuperAdminAccount } from '../utils/auth';
import { PWAInstallButton } from './PWAInstallButton';
import { exportAllDataAsJSON } from '../utils/storage';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentAccount: SuperAdminAccount;
  onOpenVersionModal: () => void;
  onOpenNewConsultation: () => void;
  onLogout: () => void;
  onClearAllData: () => void;
  todayCount: number;
  totalIncomeToday: number;
  cloudVersion?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentAccount,
  onOpenVersionModal,
  onOpenNewConsultation,
  onLogout,
  onClearAllData,
  todayCount,
  totalIncomeToday,
  cloudVersion = '1.2.1',
}) => {
  const navItems: { key: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      key: 'consultations',
      label: 'ဗေဒင်မေးသူများ & POS',
      icon: <CalendarDays className="w-4 h-4 text-amber-400" />,
    },
    {
      key: 'monthly_report',
      label: 'လစဉ် စာရင်းဇယား (အစီရင်ခံစာ)',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    },
    {
      key: 'royal_customers',
      label: 'ဖောက်သည်ကြီးများ (Royal VIP)',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      key: 'expenses',
      label: 'အသုံးစရိတ် စီမံခန့်ခွဲမှု',
      icon: <Wallet className="w-4 h-4 text-rose-400" />,
    },
    {
      key: 'amulets',
      label: 'အဆောင်ပစ္စည်း ကတ်တလောက်',
      icon: <ShoppingBag className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <>
      {/* Backdrop (Dark overlay when sidebar is open on ANY screen) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-in Drawer - ONLY appears when called (isOpen === true) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-stone-900 border-r border-amber-500/30 text-stone-100 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Astrologer Profile Box */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Brand Header with Close Button */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold border border-amber-300/40">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                  မြန်မာ့ရိုးရာဗေဒင်ပညာ
                </h1>
                <span className="text-[11px] text-amber-400/90 font-medium">Service & POS စနစ်</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              title="ပိတ်ရန်"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Super Admin Account Box */}
          <div className="p-3 m-3 rounded-2xl bg-stone-850 border border-amber-500/30 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  {currentAccount.avatarEmoji || '👑'}
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-100 flex items-center gap-1.5">
                    <span>{currentAccount.name}</span>
                  </div>
                  <div className="text-[11px] text-amber-400/90 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>User Name: {currentAccount.username}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                Super Admin
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-400">{currentAccount.sanctuaryName}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                title="Super Admin အကောင့်မှ ထွက်မည်"
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ထွက်မည်</span>
              </button>
            </div>
          </div>

          {/* New Consultation CTA Button */}
          <div className="px-3 mb-2">
            <button
              type="button"
              onClick={() => {
                onOpenNewConsultation();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ဗေဒင်အသစ်သွင်းရန်</span>
            </button>
          </div>

          {/* Navigation Menu Links */}
          <nav className="px-3 space-y-1 mt-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-wider">
              ပင်မ ကဏ္ဍများ
            </span>

            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === item.key
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-inner'
                    : 'text-stone-300 hover:bg-stone-850 hover:text-stone-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
              </button>
            ))}
          </nav>

          {/* Daily Quick Summary Widget */}
          <div className="m-3 p-3 rounded-xl bg-stone-850/70 border border-stone-800 text-xs space-y-2">
            <span className="text-[11px] font-semibold text-stone-400">ယနေ့ အခြေအနေ (Today)</span>
            <div className="flex justify-between items-center text-stone-300">
              <span>ဗေဒင်မေးသူ:</span>
              <strong className="text-amber-400">{todayCount} ဦး</strong>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>ယနေ့ဝင်ငွေ:</span>
              <strong className="text-emerald-400 font-mono">{totalIncomeToday.toLocaleString()} ကျပ်</strong>
            </div>
          </div>

          {/* Tools & Utilities */}
          <div className="px-3 py-2 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-wider">
              အရန်ကိရိယာများနှင့် Cloud
            </span>

            {/* PWA Mobile App Install Button */}
            <PWAInstallButton variant="sidebar" />

            {/* Version History & Cloud Sync Button */}
            <button
              type="button"
              onClick={() => {
                onOpenVersionModal();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-850 border border-stone-800 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>Version History (Cloud Sync)</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                v{cloudVersion}
              </span>
            </button>

            {/* Backup / Export */}
            <button
              type="button"
              onClick={() => {
                exportAllDataAsJSON();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-850 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ဒေတာများ Backup သိမ်းရန်</span>
            </button>

            {/* Clear All Data */}
            <button
              type="button"
              onClick={() => {
                onClearAllData();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>စာရင်းများ အားလုံးရှင်းထုတ်မည်</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-800 text-[11px] text-stone-500 text-center bg-stone-950">
          မြန်မာ့ရိုးရာဗေဒင်ပညာ • Cloudflare Pages Ready
        </div>
      </aside>
    </>
  );
};
