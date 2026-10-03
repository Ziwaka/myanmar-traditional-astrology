import React from 'react';
import { 
  CloudAlert, 
  RefreshCw, 
  X, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  UploadCloud
} from 'lucide-react';
import { 
  getLastCloudSyncTime, 
  formatLastSyncRelative, 
  dismissCloudSyncReminder, 
  getCloudSyncElapsedHours 
} from '../utils/cloudSyncReminder';

interface CloudSyncReminderBannerProps {
  onOpenSyncModal: () => void;
  onDismiss: () => void;
  totalLocalRecords?: number;
}

export const CloudSyncReminderBanner: React.FC<CloudSyncReminderBannerProps> = ({
  onOpenSyncModal,
  onDismiss,
  totalLocalRecords = 0,
}) => {
  const lastSyncTime = getLastCloudSyncTime();
  const elapsedHours = Math.floor(getCloudSyncElapsedHours());

  const handleDismiss = () => {
    dismissCloudSyncReminder(6); // Dismiss for 6 hours
    onDismiss();
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/95 via-stone-900 to-rose-950/90 border-b border-amber-500/50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-stone-100 shadow-xl relative z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Left: Icon & Alert Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
            <CloudAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-amber-200 text-xs sm:text-sm">
                ⚠️ Cloud Sync သတိပေးချက်:
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                {elapsedHours >= 9999 ? 'Sync မလုပ်ရသေးပါ' : `${elapsedHours} နာရီကျော်`}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-300 leading-snug">
              စက်အားလုံး ဒေတာလုံခြုံကိုက်ညီစေရန် Cloud သို့ Sync ပြုလုပ်ပေးပါ ({formatLastSyncRelative(lastSyncTime)})
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-0.5 sm:pt-0">
          <button
            type="button"
            onClick={onOpenSyncModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-extrabold text-xs shadow transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-950" />
            <span>☁️ Sync ပြုလုပ်မည်</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            title="ခေတ္တ ဖျောက်ထားမည်"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800 transition cursor-pointer text-xs shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
