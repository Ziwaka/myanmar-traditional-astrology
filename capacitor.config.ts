import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myanmar.astrology.records',
  appName: 'မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်း',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: true,
      resetWhenUpdate: false,
      autoDeleteFailed: true,
      statsUrl: '', // Optional: custom self-hosted Capgo stats or default Capgo cloud
    },
  },
};

export default config;
