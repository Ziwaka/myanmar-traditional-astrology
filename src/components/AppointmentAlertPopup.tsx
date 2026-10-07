import React from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  ExternalLink, 
  X,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { UpcomingAppointmentAlert } from '../utils/notifications';
import { soundService } from '../utils/notificationSound';
import { SERVICE_CATEGORIES } from '../utils/astrology';

interface AppointmentAlertPopupProps {
  alert: UpcomingAppointmentAlert | null;
  onClose: () => void;
  onOpenConsultation: (consultationId: string) => void;
}

export const AppointmentAlertPopup: React.FC<AppointmentAlertPopupProps> = ({
  alert,
  onClose,
  onOpenConsultation,
}) => {
  if (!alert) return null;

  const { record, checkpoint, checkpointLabel, formattedTimeText } = alert;
  const isDuplicate = checkpoint === 'duplicate_alert';
  const isUrgent = checkpoint === '0_min' || isDuplicate;
  const serviceInfo = SERVICE_CATEGORIES.find((s) => s.key === record.serviceCategory);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
      }}
    >
      <div 
        className={`w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all duration-300 transform scale-100 my-auto ${
          isUrgent
            ? 'bg-gradient-to-b from-stone-900 via-rose-950/80 to-stone-900 border-rose-500 shadow-rose-500/30 animate-pulse'
            : 'bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 border-amber-500/70 shadow-amber-500/20'
        }`}
      >
        {/* Header Ribbon / Checkpoint Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-700/60">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-2xl ${isUrgent ? 'bg-rose-500/30 text-rose-300' : 'bg-amber-500/30 text-amber-300'}`}>
              {isDuplicate ? (
                <AlertTriangle className="w-5 h-5 text-rose-300 animate-bounce" />
              ) : (
                <Bell className="w-5 h-5 animate-bounce" />
              )}
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`}>
                {isDuplicate ? '⚠️ Duplicate သတိပေးချက်' : '📅 ရက်ချိန်း သတိပေးချက်'}
              </span>
              <span className="text-sm font-extrabold text-stone-100">
                {checkpointLabel}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Customer & Appointment Main Details */}
        <div className="my-5 space-y-4">
          
          {/* Prominent Customer Name */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-xs text-amber-300/80 font-medium block">ဟောရမည့်သူ အမည်</span>
            <h2 className="text-2xl font-black text-amber-300 mt-0.5 tracking-wide flex items-center justify-center gap-2">
              <User className="w-6 h-6 text-amber-400 shrink-0" />
              <span>{record.customerName || 'အမည်မဖော်ပြထားသူ'}</span>
            </h2>
            {record.phone && (
              <p className="text-xs text-stone-300 mt-1 flex items-center justify-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-mono">{record.phone}</span>
              </p>
            )}
          </div>

          {/* Time & Service Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
              <span className="text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> ဟောမည့်အချိန်:
              </span>
              <span className="font-bold text-amber-300 block text-sm mt-1 font-mono">
                {formattedTimeText}
              </span>
            </div>

            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
              <span className="text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ဝန်ဆောင်မှု:
              </span>
              <span className="font-bold text-stone-200 block text-xs mt-1 truncate">
                {serviceInfo?.label || 'ဗေဒင်ဟောစာတမ်း'}
              </span>
            </div>
          </div>

          {/* Assigned Astrologer */}
          {record.assignedUserName && (
            <div className="px-3 py-2 bg-stone-950/50 rounded-xl border border-stone-800/80 text-[11px] text-stone-300 flex items-center justify-between">
              <span className="text-stone-400">တာဝန်ခံ / ဟောမည့်သူ:</span>
              <span className="font-bold text-amber-300">{record.assignedUserName}</span>
            </div>
          )}

          {/* Predictions/Notes Preview if any */}
          {record.notes && (
            <div className="p-2.5 bg-stone-950/40 rounded-xl border border-stone-800/60 text-xs text-stone-300">
              <span className="text-[10px] text-stone-400 block font-semibold">မှတ်ချက်:</span>
              <p className="line-clamp-2 text-stone-300 italic text-[11px] mt-0.5">{record.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition cursor-pointer text-center"
          >
            ခေတ္တ ပိတ်မည်
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsultation(record.id);
            }}
            className="w-2/3 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>မှတ်တမ်း ချက်ချင်းဖွင့်မည်</span>
          </button>
        </div>
      </div>
    </div>
  );
};
