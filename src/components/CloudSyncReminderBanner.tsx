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
    <div className="bg-gradient-to-r from-amber-950/90 via-stone-900 to-rose-950/80 border-b border-amber-500/50 px-4 py-3 text-stone-100 shadow-xl relative z-20 backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Icon & Alert Text */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 mt-0.5 sm:mt-0 animate-pulse">
            <CloudAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-amber-200 text-xs sm:text-sm flex items-center gap-1.5">
                <span>⚠️ Cloud Data Sync သတိပေးချက်:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold">
                  {elapsedHours >= 9999 ? 'Sync မလုပ်ရသေးပါ' : `${elapsedHours} နာရီ ကြာမြင့်`}
                </span>
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Cloud Database သို့ Manual Sync မလုပ်ရသေးသည်မှာ ၄၈ နာရီ ကျော်လွန်နေပါပြီ ({formatLastSyncRelative(lastSyncTime)})။ စက်အားလုံးတွင် ဒေတာများ လုံခြုံကိုက်ညီစေရန် Sync ပြုလုပ်ပေးပါ။
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 pt-1 md:pt-0">
          <button
            type="button"
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-950" />
            <span>☁️ ယခုချက်ချင်း Sync ပြုလုပ်မည်</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            title="ခေတ္တ ဖျောက်ထားမည် (၆ နာရီကြာ)"
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800 transition cursor-pointer text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
