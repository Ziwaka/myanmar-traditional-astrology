import { ConsultationRecord, AppNotification, ReminderCheckpoint } from '../types';
import { UserAccount } from './auth';
import { soundService } from './notificationSound';

const NOTIFICATIONS_STORAGE_KEY = 'myanmar_astrology_notifications_v1';
const SENT_CHECKPOINTS_STORAGE_KEY = 'myanmar_astrology_sent_checkpoints_v1';

export interface UpcomingAppointmentAlert {
  record: ConsultationRecord;
  checkpoint: ReminderCheckpoint;
  minutesRemaining: number;
  formattedTimeText: string;
  checkpointLabel: string;
}

// Load notifications from local storage
export function loadStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading notifications', e);
    return [];
  }
}

// Save notifications to local storage
export function saveStoredNotifications(notis: AppNotification[]): void {
  try {
    // Keep max 100 most recent notifications
    const trimmed = notis.slice(0, 100);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
}

// Load sent checkpoints map { [key: string]: boolean }
function loadSentCheckpoints(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(SENT_CHECKPOINTS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSentCheckpoint(key: string): void {
  try {
    const current = loadSentCheckpoints();
    current[key] = true;
    localStorage.setItem(SENT_CHECKPOINTS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving sent checkpoint', e);
  }
}

// Get checkpoint label in Burmese
export function getCheckpointLabel(checkpoint: ReminderCheckpoint): string {
  switch (checkpoint) {
    case '30_min':
      return 'နာရီဝက် (၃၀ မိနစ်) အလို';
    case '15_min':
      return '၁၅ မိနစ် အလို';
    case '5_min':
      return '၅ မိနစ် အလို';
    case '0_min':
      return 'ဟောမည့်အချိန် ရောက်ရှိပါပြီ!';
    default:
      return 'ရက်ချိန်း သတိပေးချက်';
  }
}

// Check if a consultation is assigned or accessible to a specific user
export function isConsultationForUser(record: ConsultationRecord, user: UserAccount): boolean {
  if (user.role === 'super_admin' || user.role === 'admin') {
    return true; // Super admin and Admin can view all or filter
  }
  if (!record.assignedUserId || record.assignedUserId === 'all') {
    return true; // Unassigned / General belongs to everyone
  }
  if (record.assignedUserId === user.id) {
    return true;
  }
  if (record.recordedBy && record.recordedBy.toLowerCase().includes(user.name.toLowerCase())) {
    return true;
  }
  return false;
}

// Get all appointments scheduled for today (YYYY-MM-DD)
export function getTodayAppointments(records: ConsultationRecord[], user: UserAccount): ConsultationRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  
  return records.filter((r) => {
    if (r.status === 'cancelled' || r.status === 'completed' || r.taskDone) return false;
    
    // Check if readingDateTime is today
    const readingDateStr = r.readingDateTime ? r.readingDateTime.slice(0, 10) : '';
    const bookingDateStr = r.bookingDate || '';
    const isToday = readingDateStr === todayStr || (!readingDateStr && bookingDateStr === todayStr);

    if (!isToday) return false;
    return isConsultationForUser(r, user);
  }).sort((a, b) => {
    const timeA = a.readingDateTime || a.bookingDate || '';
    const timeB = b.readingDateTime || b.bookingDate || '';
    return timeA.localeCompare(timeB);
  });
}

// Calculate minutes difference between target datetime and now
export function getMinutesDifference(targetDateTimeStr: string): number {
  if (!targetDateTimeStr) return -999999;
  const target = new Date(targetDateTimeStr).getTime();
  const now = Date.now();
  return (target - now) / 60000;
}

// Check and trigger upcoming appointment notifications
export function checkUpcomingAppointments(
  records: ConsultationRecord[],
  currentUser: UserAccount,
  onTriggerAlertPopup: (alert: UpcomingAppointmentAlert) => void
): void {
  const today = new Date().toISOString().split('T')[0];
  const sentMap = loadSentCheckpoints();

  records.forEach((record) => {
    if (record.status === 'cancelled' || record.status === 'completed' || record.taskDone) {
      return;
    }

    if (!record.readingDateTime || !record.readingDateTime.startsWith(today)) {
      return;
    }

    if (!isConsultationForUser(record, currentUser)) {
      return;
    }

    const diffMinutes = getMinutesDifference(record.readingDateTime);
    
    // Checkpoints:
    // 30 mins: between 25 and 31 minutes remaining
    // 15 mins: between 12 and 16 minutes remaining
    // 5 mins: between 3.5 and 6 minutes remaining
    // 0 mins: between -2 and 1.5 minutes remaining

    const checkpoints: { key: ReminderCheckpoint; min: number; max: number; label: string; urgent?: boolean }[] = [
      { key: '30_min', min: 25, max: 31, label: 'နာရီဝက် (၃၀ မိနစ်) အလို' },
      { key: '15_min', min: 12, max: 16, label: '၁၅ မိနစ် အလို' },
      { key: '5_min', min: 3.5, max: 6, label: '၅ မိနစ် အလို' },
      { key: '0_min', min: -2, max: 1.5, label: 'ဟောမည့်အချိန် ရောက်ရှိပါပြီ!', urgent: true },
    ];

    for (const cp of checkpoints) {
      const sentKey = `noti_${record.id}_${cp.key}_${currentUser.id}`;
      
      if (diffMinutes >= cp.min && diffMinutes <= cp.max) {
        if (!sentMap[sentKey]) {
          // Mark as sent
          saveSentCheckpoint(sentKey);

          // Format reading time nicely
          const dateObj = new Date(record.readingDateTime);
          const timeText = dateObj.toLocaleTimeString('my-MM', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          // Play audio chime
          if (cp.urgent) {
            soundService.playUrgentAlert();
          } else {
            soundService.playChime();
          }

          // Trigger Web Notification API if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`📅 ဗေဒင်ရက်ချိန်း သတိပေးချက်: ${cp.label}`, {
                body: `ဟောရမည့်သူ: ${record.customerName || 'အမည်မဖော်ပြထားသူ'} (${timeText})\nဖုန်း: ${record.phone || '-'}`,
                icon: '/icons/icon-192.png',
                tag: sentKey,
              });
            } catch (e) {
              console.warn('Browser notification error', e);
            }
          }

          // Create notification item in log
          const newNoti: AppNotification = {
            id: `noti-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            consultationId: record.id,
            customerName: record.customerName || 'အမည်မသိသူ',
            readingDateTime: record.readingDateTime,
            checkpoint: cp.key,
            title: `📅 ရက်ချိန်း သတိပေးချက် (${cp.label})`,
            message: `ဟောရမည့်သူ: ${record.customerName || 'အမည်မဖော်ပြထားသူ'} • အချိန်: ${timeText}`,
            assignedUserId: record.assignedUserId || currentUser.id,
            assignedUserName: record.assignedUserName || currentUser.name,
            createdAt: new Date().toISOString(),
            isRead: false,
            phone: record.phone,
            serviceCategory: record.serviceCategory,
          };

          const currentList = loadStoredNotifications();
          saveStoredNotifications([newNoti, ...currentList]);

          // Trigger Popup Alert
          onTriggerAlertPopup({
            record,
            checkpoint: cp.key,
            minutesRemaining: Math.round(diffMinutes),
            formattedTimeText: timeText,
            checkpointLabel: cp.label,
          });

          break; // Fire only one checkpoint per cycle
        }
      }
    }
  });
}

// Request Browser Notification Permission
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch (e) {
    console.error('Error requesting notification permission', e);
    return false;
  }
}
