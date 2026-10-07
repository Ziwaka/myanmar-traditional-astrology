import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeCapgoUpdater } from './utils/capgoUpdater';

// Initialize Capgo OTA Updater for Native APK
initializeCapgoUpdater().catch((err) => {
  console.warn('Capgo updater failed to initialize:', err);
});

createRoot(document.getElementById('root')!).render(<App />);

