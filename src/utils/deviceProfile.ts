// Device and Staff profile identification for multi-user real-time sync

const STORAGE_KEYS = {
  DEVICE_ID: 'myanmar_astrology_device_id',
  DEVICE_NAME: 'myanmar_astrology_device_name',
};

// Generates or retrieves a unique persistent device ID
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      id = `DEV-${rand}`;
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  } catch {
    return 'DEV-LOCAL';
  }
}

// Retrieves the device or staff workstation label
export function getDeviceName(): string {
  try {
    const name = localStorage.getItem(STORAGE_KEYS.DEVICE_NAME);
    if (name) return name;
    
    // Auto-detect a friendly default
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const defaultName = isMobile ? 'မိုဘိုင်းလ် ဖုန်း (စက်)' : 'ကောင်တာ / ကွန်ပျူတာ';
    return defaultName;
  } catch {
    return 'စက် (၁)';
  }
}

// Saves a custom device or staff label
export function saveDeviceName(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEVICE_NAME, name.trim() || 'စက် (၁)');
  } catch (e) {
    console.warn('Could not save device name', e);
  }
}
