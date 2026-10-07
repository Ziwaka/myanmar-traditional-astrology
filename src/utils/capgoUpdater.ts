import { Capacitor } from '@capacitor/core';
import { 
  CapacitorUpdater, 
  BundleInfo, 
  DownloadEvent, 
  UpdateAvailableEvent, 
  DownloadCompleteEvent, 
  DownloadFailedEvent,
  LatestVersion 
} from '@capgo/capacitor-updater';

export interface CapgoUpdateStatus {
  isNative: boolean;
  currentVersion: string | null;
  latestVersion: string | null;
  isChecking: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  updateAvailable: boolean;
  error: string | null;
}

/**
 * Initializes Capgo Live Updater.
 * Crucial: Calls notifyAppReady() to confirm successful boot to Capgo and prevent automatic rollbacks.
 */
export async function initializeCapgoUpdater(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Notify Capgo engine that the app bundle successfully loaded and mounted React
    await CapacitorUpdater.notifyAppReady();
    console.log('[Capgo Updater] App ready signal sent successfully.');

    // Listen to download and update events
    await CapacitorUpdater.addListener('download', (info: DownloadEvent) => {
      console.log(`[Capgo Updater] Downloading update: ${info.percent}%`);
    });

    await CapacitorUpdater.addListener('updateAvailable', (event: UpdateAvailableEvent) => {
      console.log('[Capgo Updater] Update available event:', event);
    });

    await CapacitorUpdater.addListener('downloadComplete', (event: DownloadCompleteEvent) => {
      console.log('[Capgo Updater] Download complete:', event);
    });

    await CapacitorUpdater.addListener('downloadFailed', (info: DownloadFailedEvent) => {
      console.warn('[Capgo Updater] Download failed:', info);
    });
  } catch (error) {
    console.warn('[Capgo Updater] Initialization error:', error);
  }
}

/**
 * Checks for live OTA updates from Capgo and downloads if available
 */
export async function checkForCapgoLiveUpdate(
  onProgress?: (percent: number) => void
): Promise<{ hasUpdate: boolean; bundle?: LatestVersion; message?: string }> {
  if (!Capacitor.isNativePlatform()) {
    return { hasUpdate: false, message: 'Not running on native Android/iOS' };
  }

  try {
    console.log('[Capgo Updater] Checking for live OTA update...');
    const current = await CapacitorUpdater.current();
    console.log('[Capgo Updater] Current bundle:', current);

    // If custom onProgress is provided, subscribe briefly
    let handle: { remove: () => Promise<void> } | null = null;
    if (onProgress) {
      handle = await CapacitorUpdater.addListener('download', (info: DownloadEvent) => {
        onProgress(info.percent);
      });
    }

    // Trigger auto-download check if configured
    const latest: LatestVersion = await CapacitorUpdater.getLatest();
    
    if (handle) {
      await handle.remove();
    }

    if (latest && latest.version && (!current.bundle || current.bundle.version !== latest.version)) {
      return { hasUpdate: true, bundle: latest, message: `Update v${latest.version} is available!` };
    }

    return { hasUpdate: false, message: 'App is up to date' };
  } catch (err: any) {
    console.error('[Capgo Updater] Error checking update:', err);
    return { hasUpdate: false, message: err?.message || 'Update check failed' };
  }
}

/**
 * Reloads the app to apply the downloaded bundle immediately
 */
export async function applyCapgoUpdate(bundle: BundleInfo): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await CapacitorUpdater.set(bundle);
    await CapacitorUpdater.reload();
  } catch (err) {
    console.error('[Capgo Updater] Failed to apply update:', err);
  }
}
