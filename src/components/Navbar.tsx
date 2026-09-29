import React from 'react';
import { 
  Sparkles, 
  Menu, 
  PlusCircle, 
  Wallet, 
  Lock, 
  Crown, 
  Cloud, 
  LogOut,
  Tag,
  Database
} from 'lucide-react';
import { SuperAdminAccount } from '../utils/auth';

export type ActiveTab = 'consultations' | 'monthly_report' | 'royal_customers' | 'expenses' | 'amulets';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeTab: ActiveTab;
  currentAccount: SuperAdminAccount;
  onOpenVersionModal: () => void;
  onOpenCloudSyncModal?: () => void;
  onOpenDatabaseQuotaModal?: () => void;
  onOpenNewConsultation: () => void;
  onOpenNewExpense: () => void;
  onLogout: () => void;
  totalIncomeToday: number;
  todayCount: number;
  cloudVersion?: string;
  isNewVersionAvailable?: boolean;
  storageQuotaPercentage?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeTab,
  currentAccount,
  onOpenVersionModal,
  onOpenCloudSyncModal,
  onOpenDatabaseQuotaModal,
  onOpenNewConsultation,
  onOpenNewExpense,
  onLogout,
  totalIncomeToday,
  todayCount,
  cloudVersion = '1.3.1',
  isNewVersionAvailable = false,
  storageQuotaPercentage,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'consultations': return 'ဗေဒင်မေးသူများ မှတ်တမ်း & POS';
      case 'monthly_report': return 'လစဉ် စာရင်းဇယား အစီရင်ခံစာ';
      case 'royal_customers': return 'ဖောက်သည်ကြီးများ (Royal VIP)';
      case 'expenses': return 'အသုံးစရိတ် စီမံခန့်ခွဲမှု';
      case 'amulets': return 'အဆောင်ပစ္စည်း ကတ်တလောက် (POS)';
      default: return 'မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်း';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md border-b border-amber-500/20 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-3">
          
          {/* Left: Menu Trigger (Opens Sidebar Drawer) & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 transition cursor-pointer shadow-sm active:scale-95"
              title="Side Bar ဖွင့်ရန် နှိပ်ပါ"
            >
              <Menu className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold hidden sm:inline">Menu</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-amber-200">
                  {getTabTitle()}
                </h1>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Service & POS
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                မြန်မာ့ရိုးရာဗေဒင်ပညာ • {currentAccount.sanctuaryName}
              </p>
            </div>
          </div>

          {/* Right: Cloud Version Sync, Metrics, Actions, Super Admin Badge */}
          <div className="flex items-center gap-2">
            
            {/* Quick Metrics */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-stone-850 border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400">ယနေ့ဧည့်သည်: </span>
                <span className="text-amber-400 font-semibold">{todayCount} ဦး</span>
              </div>
              <div className="h-3 w-px bg-stone-700" />
              <div>
                <span className="text-stone-400">ယနေ့ဝင်ငွေ: </span>
                <span className="text-emerald-400 font-semibold">{totalIncomeToday.toLocaleString()} ကျပ်</span>
              </div>
            </div>

            {/* Cloud Version Status Badge */}
            <button
              onClick={onOpenVersionModal}
              title="Cloud Version History & Verification"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition cursor-pointer ${
                isNewVersionAvailable
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-stone-850 border-emerald-500/30 text-emerald-300 hover:bg-stone-800'
              }`}
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px] font-semibold">Cloud v{cloudVersion}</span>
            </button>

            {/* Cloud Real-time Multi-Device Sync Badge */}
            {onOpenCloudSyncModal && (
              <button
                onClick={onOpenCloudSyncModal}
                title="Google Cloud Real-time Database (Multi-Device Live Sync)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium hidden sm:inline">Live Sync (Multi-User)</span>
                <span className="text-[11px] font-medium sm:hidden">Live Sync</span>
              </button>
            )}

            {/* Database Quota Badge */}
            {onOpenDatabaseQuotaModal && (
              <button
                onClick={onOpenDatabaseQuotaModal}
                title="Database Quota စစ်ဆေးရန်"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-stone-850 border border-amber-500/30 text-amber-300 hover:bg-stone-800 transition cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] font-semibold">
                  Quota {storageQuotaPercentage !== undefined ? `${storageQuotaPercentage}%` : '5MB'}
                </span>
              </button>
            )}

            {/* + New Consultation Button */}
            <button
              onClick={onOpenNewConsultation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow transition active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">ဗေဒင်အသစ်သွင်းရန်</span>
              <span className="sm:hidden">အသစ်သွင်း</span>
            </button>

            {/* Super Admin Badge & Logout */}
            <div className="flex items-center gap-1 bg-stone-850 border border-stone-700/80 rounded-xl p-1 text-xs">
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-stone-200">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-amber-300">{currentAccount.username}</span>
              </div>
              <button
                onClick={onLogout}
                title="Super Admin ထွက်မည် (Logout)"
                className="p-1 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
