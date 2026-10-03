import React from 'react';
import { 
  CalendarDays, 
  TrendingUp, 
  Crown, 
  Wallet, 
  ShoppingBag, 
  Flame,
  Sparkles, 
  X, 
  Cloud, 
  LogOut, 
  Database, 
  Download, 
  Trash2,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Smartphone,
  Wifi,
  WifiOff,
  Users,
  Activity,
  Bell
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { UserAccount, getEffectivePermissions } from '../utils/auth';
import { exportAllDataAsJSON } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentAccount: UserAccount;
  onOpenVersionModal: () => void;
  onOpenCloudSyncModal?: () => void;
  onOpenDatabaseQuotaModal?: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenNewConsultation: () => void;
  onLogout: () => void;
  onClearAllData: () => void;
  todayCount: number;
  totalIncomeToday: number;
  cloudVersion?: string;
  storageQuotaUsedFormatted?: string;
  storageQuotaPercentage?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  currentAccount,
  onOpenVersionModal,
  onOpenCloudSyncModal,
  onOpenDatabaseQuotaModal,
  onOpenNotificationCenter,
  onOpenNewConsultation,
  onLogout,
  onClearAllData,
  todayCount,
  totalIncomeToday,
  cloudVersion = '1.3.5',
  storageQuotaUsedFormatted,
  storageQuotaPercentage,
}) => {
  const isOnline = useOnlineStatus();
  const perms = getEffectivePermissions(currentAccount.role);

  const navItems: { key: ActiveTab; label: string; icon: React.ReactNode; badge?: string; hide?: boolean }[] = [
    {
      key: 'consultations',
      label: 'ဗေဒင်မေးသူများ & POS',
      icon: <CalendarDays className="w-4 h-4 text-amber-400" />,
    },
    {
      key: 'monthly_report',
      label: 'လစဉ် စာရင်းဇယား (အစီရင်ခံစာ)',
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      hide: !perms.canViewMonthlyReports,
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
      hide: !perms.canManageExpenses,
    },
    {
      key: 'yatra_catalog',
      label: 'ယတြာ ကတ်တလောက် (Yatra Catalog)',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      hide: !perms.canManageAmulets,
    },
    {
      key: 'amulets_catalog',
      label: 'အဆောင်ပစ္စည်း ကတ်တလောက် (Amulet POS)',
      icon: <ShoppingBag className="w-4 h-4 text-purple-400" />,
      hide: !perms.canManageAmulets,
    },
    {
      key: 'users',
      label: 'User အကောင့် & လုပ်ပိုင်ခွင့်များ',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      hide: !perms.canManageUsers && currentAccount.role !== 'super_admin',
    },
    {
      key: 'sync_monitor',
      label: 'Sync Monitor Dashboard',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      badge: 'Live',
    },
    {
      key: 'quota_monitor',
      label: 'Quota Monitor Dashboard',
      icon: <Database className="w-4 h-4 text-amber-400" />,
      badge: '5 MB',
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold border border-amber-300/40">
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
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              title="ပိတ်ရန်"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Dossier Box */}
          <div className="p-3.5 m-3 rounded-2xl bg-stone-850 border border-amber-500/30 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  {currentAccount.avatarEmoji || '👤'}
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-100">
                    {currentAccount.name}
                  </div>
                  <div className="text-[11px] text-amber-400/90 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>User: {currentAccount.username}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                {currentAccount.role.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-400 truncate max-w-[170px]">{currentAccount.title}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                title="အကောင့်မှ ထွက်မည်"
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition cursor-pointer font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ထွက်မည်</span>
              </button>
            </div>
          </div>

          {/* Notification Center Button */}
          {onOpenNotificationCenter && (
            <div className="px-3 mb-2">
              <button
                type="button"
                onClick={() => {
                  onOpenNotificationCenter();
                  onClose();
                }}
                className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-2xl bg-stone-850 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs shadow transition cursor-pointer active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>အသိပေးချက် စင်တာ (ယနေ့ ရက်ချိန်းများ)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          )}

          {/* Navigation Menu Links */}
          <nav className="px-3 space-y-1 mt-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-wider">
              ပင်မ ကဏ္ဍများ
            </span>

            {navItems.filter(i => !i.hide).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-medium transition cursor-pointer ${
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
          <div className="m-3 p-3.5 rounded-2xl bg-stone-850/70 border border-stone-800 text-xs space-y-2">
            <span className="text-[11px] font-semibold text-stone-400">ယနေ့ အခြေအနေ (Today)</span>
            <div className="flex justify-between items-center text-stone-300">
              <span>ဗေဒင်မေးသူ:</span>
              <strong className="text-amber-400">{todayCount} ဦး</strong>
            </div>
            {perms.canViewMonthlyReports && (
              <div className="flex justify-between items-center text-stone-300">
                <span>ယနေ့ဝင်ငွေ:</span>
                <strong className="text-emerald-400 font-mono">{totalIncomeToday.toLocaleString()} ကျပ်</strong>
              </div>
            )}
          </div>

          {/* Tools & Utilities */}
          <div className="px-3 py-2 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-3 tracking-wider">
              အရန်ကိရိယာများနှင့် Cloud
            </span>

            {/* Live Online/Offline Card */}
            <div className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs border ${
              isOnline 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online ချိတ်ဆက်ထားသည်</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-rose-400" />
                    <span>Offline (စက်တွင်းသိမ်းမည်)</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-semibold font-mono">
                {isOnline ? 'Cloud Sync' : 'Local'}
              </span>
            </div>

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
                <span>Version History</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                v{cloudVersion}
              </span>
            </button>

            {/* Cloud Real-time Multi-Device Sync Button */}
            {onOpenCloudSyncModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenCloudSyncModal();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Database (စက်ပေါင်းစုံ Sync)</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
                  Live
                </span>
              </button>
            )}

            {/* Database Quota Button */}
            {onOpenDatabaseQuotaModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenDatabaseQuotaModal();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-850 border border-stone-800 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Database Quota</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-amber-300 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">
                    {storageQuotaPercentage !== undefined ? `${storageQuotaPercentage}%` : '5 MB'}
                  </span>
                </div>
              </button>
            )}

            {/* Backup / Export */}
            {perms.canExportImportData && (
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
            )}

            {/* Clear All Data */}
            {perms.canClearDatabase && (
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
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-800 text-[11px] text-stone-500 text-center bg-stone-950">
          မြန်မာ့ရိုးရာဗေဒင်ပညာ • v{cloudVersion}
        </div>
      </aside>
    </>
  );
};
