import React from 'react';
import { 
  Sparkles, 
  Menu, 
  PlusCircle, 
  Wallet, 
  Crown, 
  Cloud, 
  LogOut, 
  Database,
  Smartphone,
  Wifi,
  WifiOff,
  ShieldCheck,
  UserCheck,
  Bell
} from 'lucide-react';
import { UserAccount, UserRole } from '../utils/auth';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export type ActiveTab = 
  | 'consultations' 
  | 'monthly_report' 
  | 'royal_customers' 
  | 'expenses' 
  | 'amulets'
  | 'users'
  | 'sync_monitor'
  | 'quota_monitor';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeTab: ActiveTab;
  currentAccount: UserAccount;
  onOpenVersionModal: () => void;
  onOpenCloudSyncModal?: () => void;
  onOpenDatabaseQuotaModal?: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenNewConsultation: () => void;
  onOpenNewExpense: () => void;
  onLogout: () => void;
  totalIncomeToday: number;
  todayCount: number;
  unreadNotificationCount?: number;
  todayAppointmentsCount?: number;
  cloudVersion?: string;
  isNewVersionAvailable?: boolean;
  storageQuotaPercentage?: number;
  isCloudSyncOverdue?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeTab,
  currentAccount,
  onOpenVersionModal,
  onOpenCloudSyncModal,
  onOpenDatabaseQuotaModal,
  onOpenNotificationCenter,
  onOpenNewConsultation,
  onOpenNewExpense,
  onLogout,
  totalIncomeToday,
  todayCount,
  unreadNotificationCount = 0,
  todayAppointmentsCount = 0,
  cloudVersion = '1.3.5',
  isNewVersionAvailable = false,
  storageQuotaPercentage,
  isCloudSyncOverdue = false,
}) => {
  const isOnline = useOnlineStatus();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'consultations': return 'ဗေဒင်မေးသူများ & POS';
      case 'monthly_report': return 'လစဉ် စာရင်းဇယား အစီရင်ခံစာ';
      case 'royal_customers': return 'ဖောက်သည်ကြီးများ (Royal VIP)';
      case 'expenses': return 'အသုံးစရိတ် စီမံခန့်ခွဲမှု';
      case 'amulets': return 'အဆောင်ပစ္စည်း ကတ်တလောက် (POS)';
      case 'users': return 'အသုံးပြုသူ အကောင့်များနှင့် လုပ်ပိုင်ခွင့်များ';
      case 'sync_monitor': return 'Sync Monitor Dashboard (Live Monitor)';
      case 'quota_monitor': return 'Quota Monitor Dashboard (Storage Analytics)';
      default: return 'မြန်မာ့ရိုးရာဗေဒင်ပညာ';
    }
  };

  const getMobileTabTitle = () => {
    switch (activeTab) {
      case 'consultations': return 'ဗေဒင်မှတ်တမ်း';
      case 'monthly_report': return 'လစဉ်ရှင်းတမ်း';
      case 'royal_customers': return 'VIP ဖောက်သည်';
      case 'expenses': return 'အသုံးစရိတ်';
      case 'amulets': return 'အဆောင် POS';
      case 'users': return 'အကောင့်များ';
      case 'sync_monitor': return 'Sync Monitor';
      case 'quota_monitor': return 'Quota Monitor';
      default: return 'ဗေဒင်မှတ်တမ်း';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur-md border-b border-amber-500/20 text-stone-100 shadow-md w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 w-full min-w-0">
          
          {/* Left: Menu Trigger & Page Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Side Bar ဖွင့်ရန် နှိပ်ပါ"
            >
              <Menu className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold hidden md:inline">Menu</span>
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-amber-200 truncate leading-tight">
                <span className="hidden sm:inline">{getTabTitle()}</span>
                <span className="sm:hidden">{getMobileTabTitle()}</span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-stone-400 hidden sm:block truncate">
                မြန်မာ့ရိုးရာဗေဒင်ပညာ • {currentAccount.sanctuaryName}
              </p>
            </div>
          </div>

          {/* Right: Clean, Uncluttered Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Desktop Metrics */}
            <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-stone-850 border border-stone-800 text-xs shrink-0">
              <div>
                <span className="text-stone-400">ယနေ့: </span>
                <span className="text-amber-400 font-semibold">{todayCount} ဦး</span>
              </div>
              <div className="h-3 w-px bg-stone-700" />
              <div>
                <span className="text-stone-400">ဝင်ငွေ: </span>
                <span className="text-emerald-400 font-semibold">{totalIncomeToday.toLocaleString()} ကျပ်</span>
              </div>
            </div>

            {/* Desktop Only: PWA Install & Version / Cloud Sync Badge */}
            <div className="hidden md:flex items-center gap-2">
              <PWAInstallButton variant="header" />
              
              {onOpenCloudSyncModal && (
                <button
                  onClick={onOpenCloudSyncModal}
                  title={isCloudSyncOverdue ? "Cloud Sync မလုပ်ရသေးသည်မှာ ၄၈ နာရီကျော်လွန်နေပါပြီ (နှိပ်ပါ)" : "Cloud Sync Status (နှိပ်ပါ)"}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                    isCloudSyncOverdue
                      ? 'bg-rose-950/80 border border-rose-500/60 text-rose-300 animate-pulse hover:bg-rose-900'
                      : 'bg-stone-850 border border-stone-700 text-emerald-300 hover:bg-stone-800'
                  }`}
                >
                  <Cloud className={`w-3.5 h-3.5 shrink-0 ${isCloudSyncOverdue ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span className="font-mono text-[11px] font-semibold">
                    {isCloudSyncOverdue ? 'Sync လိုအပ်' : `v${cloudVersion}`}
                  </span>
                </button>
              )}

              {!onOpenCloudSyncModal && (
                <button
                  onClick={onOpenVersionModal}
                  title="Version History (နှိပ်ပါ)"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs bg-stone-850 border border-stone-700 text-emerald-300 hover:bg-stone-800 transition cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold">v{cloudVersion}</span>
                </button>
              )}
            </div>

            {/* Notification Center Trigger Bell */}
            {onOpenNotificationCenter && (
              <button
                onClick={onOpenNotificationCenter}
                title="အသိပေးချက် စင်တာ / ယနေ့ ရက်ချိန်းများ (နှိပ်ပါ)"
                className="relative p-2 rounded-2xl bg-stone-850 hover:bg-stone-800 text-amber-300 border border-amber-500/30 transition cursor-pointer active:scale-95 shrink-0"
              >
                <Bell className={`w-5 h-5 ${todayAppointmentsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-stone-300'}`} />
                {(unreadNotificationCount > 0 || todayAppointmentsCount > 0) && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-md border-2 border-stone-900">
                    {unreadNotificationCount > 0 ? unreadNotificationCount : todayAppointmentsCount}
                  </span>
                )}
              </button>
            )}

            {/* + New Consultation Primary Action Button */}
            <button
              onClick={onOpenNewConsultation}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>+ အသစ်</span>
            </button>

            {/* Current Logged-in User Account Profile Pill */}
            <div className="flex items-center gap-1.5 bg-stone-850 border border-stone-700 rounded-2xl px-2.5 py-1.5 text-xs shrink-0">
              <span className="text-base">{currentAccount.avatarEmoji || '👤'}</span>
              <div className="text-left hidden sm:block">
                <span className="font-bold text-amber-300 text-xs block leading-tight">{currentAccount.name}</span>
                <span className="text-[10px] text-stone-400 block capitalize">{currentAccount.role.replace('_', ' ')}</span>
              </div>
              <button
                onClick={onLogout}
                title="အကောင့်မှ ထွက်မည် (Logout)"
                className="p-1 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer ml-0.5"
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
