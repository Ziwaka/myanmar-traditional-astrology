import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeCapgoUpdater } from './utils/capgoUpdater';

// Cleanup any lingering dev service workers to avoid unexpected token '<' issues
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

// Initialize Capgo OTA Updater for Native APK
initializeCapgoUpdater().catch((err) => {
  console.warn('Capgo updater failed to initialize:', err);
});

createRoot(document.getElementById('root')!).render(<App />);

