import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Trash2, 
  CheckCheck,
  Filter,
  AlertCircle
} from 'lucide-react';
import { ConsultationRecord, AppNotification } from '../types';
import { UserAccount, loadUserAccounts } from '../utils/auth';
import { 
  getTodayAppointments, 
  loadStoredNotifications, 
  saveStoredNotifications, 
  requestBrowserNotificationPermission,
  getMinutesDifference
} from '../utils/notifications';
import { soundService } from '../utils/notificationSound';
import { SERVICE_CATEGORIES, formatDateDDMMYYYY } from '../utils/astrology';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ConsultationRecord[];
  currentUser: UserAccount;
  onOpenConsultation: (consultationId: string) => void;
  onNotificationsUpdated?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  records,
  currentUser,
  onOpenConsultation,
  onNotificationsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'today_schedule' | 'alerts_history'>('today_schedule');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundService.getSoundEnabled());
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>(
    currentUser.role === 'super_admin' || currentUser.role === 'admin' ? 'all' : currentUser.id
  );
  const [browserNotiStatus, setBrowserNotiStatus] = useState<string>('default');

  const allUsers = loadUserAccounts();

  useEffect(() => {
    if (isOpen) {
      const stored = loadStoredNotifications();
      setNotifications(stored);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setBrowserNotiStatus(Notification.permission);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter today's appointments based on user filter
  const todayAppointments = getTodayAppointments(records, {
    ...currentUser,
    id: selectedUserFilter === 'all' ? currentUser.id : selectedUserFilter,
    role: selectedUserFilter === 'all' ? 'super_admin' : 'staff',
  });

  // Filter alerts history
  const filteredNotifications = notifications.filter((n) => {
    if (selectedUserFilter === 'all') return true;
    return n.assignedUserId === selectedUserFilter || !n.assignedUserId;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundService.setSoundEnabled(next);
    setSoundEnabled(next);
    if (next) {
      soundService.playChime();
    }
  };

  const handleRequestBrowserNoti = async () => {
    const granted = await requestBrowserNotificationPermission();
    if (granted) {
      setBrowserNotiStatus('granted');
      soundService.playChime();
    } else {
      setBrowserNotiStatus('denied');
    }
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
    if (onNotificationsUpdated) onNotificationsUpdated();
  };

  const handleClearAllHistory = () => {
    setNotifications([]);
    saveStoredNotifications([]);
    if (onNotificationsUpdated) onNotificationsUpdated();
  };

  const formatCountdown = (dateTimeStr?: string) => {
    if (!dateTimeStr) return '';
    const diff = getMinutesDifference(dateTimeStr);
    const roundMin = Math.round(diff);

    if (roundMin > 60) {
      const hours = Math.floor(roundMin / 60);
      const mins = roundMin % 60;
      return `နောက် ${hours} နာရီ ${mins > 0 ? `${mins} မိနစ်` : ''} အလို`;
    } else if (roundMin > 0) {
      return `နောက် ${roundMin} မိနစ် အလို`;
    } else if (roundMin >= -10) {
      return '🔥 ယခု ဟောမည့်အချိန်';
    } else {
      const pastMin = Math.abs(roundMin);
      return `လွန်ခဲ့သော ${pastMin > 60 ? `${Math.floor(pastMin / 60)} နာရီ` : `${pastMin} မိနစ်`}`;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
      }}
    >
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
                <span>အသိပေးချက် စင်တာ (Notification Center)</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                ယနေ့ ရက်ချိန်းများနှင့် အချိန်မီ သတိပေးချက်များ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Settings Bar & User Filter */}
        <div className="px-4 py-2.5 bg-stone-850 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          
          {/* User Account Scope Filter (for Admins) */}
          {(currentUser.role === 'super_admin' || currentUser.role === 'admin') ? (
            <div className="flex items-center gap-1.5 text-xs text-stone-300">
              <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-stone-400">တာဝန်ခံ စစ်ထုတ်ရန်:</span>
              <select
                value={selectedUserFilter}
                onChange={(e) => setSelectedUserFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-semibold text-xs cursor-pointer focus:border-amber-400"
              >
                <option value="all">👥 အားလုံး (All Astrologers)</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.avatarEmoji} {u.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-stone-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>တာဝန်ခံ: <strong className="text-amber-300">{currentUser.name}</strong></span>
            </div>
          )}

          {/* Sound & Browser Notification Toggles */}
          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundEnabled ? "အသံသတိပေးချက် ဖွင့်ထားပါသည် (နှိပ်၍ ပိတ်နိုင်သည်)" : "အသံသတိပေးချက် ပိတ်ထားပါသည် (နှိပ်၍ ဖွင့်ပါ)"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-stone-900 border-stone-700 text-stone-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'အသံ: ဖွင့်' : 'အသံ: ပိတ်'}</span>
            </button>

            {/* Browser Permission Request */}
            {browserNotiStatus !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
              <button
                onClick={handleRequestBrowserNoti}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Browser Noti ဖွင့်ရန်</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 shrink-0">
          <button
            onClick={() => setActiveTab('today_schedule')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'today_schedule'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ယနေ့ ရက်ချိန်းများ ({todayAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts_history')}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'alerts_history'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>အသိပေးချက် သမိုင်း ({filteredNotifications.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          
          {/* TAB 1: TODAY SCHEDULE */}
          {activeTab === 'today_schedule' && (
            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <Calendar className="w-12 h-12 mx-auto text-stone-600 mb-2" />
                  <p className="font-semibold text-sm">ယနေ့အတွက် ရက်ချိန်းထားရှိသူ မရှိသေးပါ</p>
                  <p className="text-xs text-stone-500 mt-1">အသစ်ထည့်သွင်းရန် "+ အသစ်" ခလုတ်ကို နှိပ်ပါ</p>
                </div>
              ) : (
                todayAppointments.map((record) => {
                  const countdown = formatCountdown(record.readingDateTime);
                  const isCurrent = countdown.includes('ယခု');
                  const service = SERVICE_CATEGORIES.find((s) => s.key === record.serviceCategory);

                  return (
                    <div
                      key={record.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        record.taskDone || record.status === 'completed'
                          ? 'bg-stone-950/50 border-stone-800 text-stone-400'
                          : isCurrent
                          ? 'bg-gradient-to-r from-amber-500/20 via-stone-900 to-amber-500/10 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-stone-850 hover:bg-stone-800/80 border-stone-700/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        
                        <div className="space-y-1.5 flex-1 min-w-0">
                          
                          {/* Name & Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-amber-400/80 bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-800">
                              {record.id}
                            </span>
                            <h3 className="text-base font-extrabold text-stone-100 truncate">
                              {record.customerName || 'အမည်မဖော်ပြထားသူ'}
                            </h3>
                            {record.taskDone && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ပြီးစီး
                              </span>
                            )}
                          </div>

                          {/* Details Row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
                            {record.readingDateTime && (
                              <span className="flex items-center gap-1 text-amber-300 font-semibold font-mono">
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                {new Date(record.readingDateTime).toLocaleTimeString('my-MM', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </span>
                            )}

                            {record.phone && (
                              <span className="flex items-center gap-1 text-stone-300 font-mono">
                                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                {record.phone}
                              </span>
                            )}

                            <span className="flex items-center gap-1 text-stone-400">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              {service?.label || 'ဗေဒင်ဟောစာတမ်း'}
                            </span>
                          </div>

                          {/* Assigned Astrologer */}
                          {record.assignedUserName && (
                            <p className="text-[11px] text-stone-400">
                              ဟောမည့်သူ: <span className="text-amber-300 font-semibold">{record.assignedUserName}</span>
                            </p>
                          )}
                        </div>

                        {/* Right: Countdown & Open Action */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          {countdown && (
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                              isCurrent
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}>
                              {countdown}
                            </span>
                          )}

                          <button
                            onClick={() => {
                              onClose();
                              onOpenConsultation(record.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition active:scale-95 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>ဖွင့်မည်</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: ALERTS HISTORY */}
          {activeTab === 'alerts_history' && (
            <div className="space-y-3">
              
              {/* Header Actions for History */}
              {filteredNotifications.length > 0 && (
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-xs">
                  <span className="text-stone-400">
                    စုစုပေါင်း: <strong className="text-stone-200">{filteredNotifications.length}</strong> ခု
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>အားလုံး ဖတ်ပြီးသတ်မှတ်</span>
                    </button>
                    <span className="text-stone-700">|</span>
                    <button
                      onClick={handleClearAllHistory}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>မှတ်တမ်းရှင်း</span>
                    </button>
                  </div>
                </div>
              )}

              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <Bell className="w-12 h-12 mx-auto text-stone-600 mb-2" />
                  <p className="font-semibold text-sm">အသိပေးချက် သမိုင်း မရှိသေးပါ</p>
                  <p className="text-xs text-stone-500 mt-1">ရက်ချိန်းနီးကပ်လာသည့်အခါ ဤနေရာတွင် အလိုအလျောက် ပေါ်လာပါမည်</p>
                </div>
              ) : (
                filteredNotifications.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => {
                      onClose();
                      onOpenConsultation(noti.consultationId);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                      noti.isRead
                        ? 'bg-stone-950/40 border-stone-800/80 hover:bg-stone-850'
                        : 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">
                          {noti.title}
                        </span>
                        {!noti.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-stone-200 font-semibold truncate">
                        {noti.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-400">
                        <span>{new Date(noti.createdAt).toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' })}</span>
                        {noti.assignedUserName && <span>• တာဝန်ခံ: {noti.assignedUserName}</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 shrink-0 text-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-center text-xs text-stone-500">
          ✨ ရက်ချိန်းမတိုင်မီ နာရီဝက်၊ ၁၅ မိနစ်၊ ၅ မိနစ်နှင့် အချိန်တည့်တည့်တို့တွင် အသိပေးချက် အလိုအလျောက် တက်ပေးပါသည်
        </div>

      </div>
    </div>
  );
};
