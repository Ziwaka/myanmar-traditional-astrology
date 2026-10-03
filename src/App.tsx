import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AmuletCatalogItem, 
  YatraCatalogItem,
  ConsultationRecord, 
  DayOfWeekBurmese, 
  ExpenseRecord, 
  MahaboteHouse 
} from './types';
import { 
  loadConsultations, 
  saveConsultations, 
  loadExpenses, 
  saveExpenses, 
  loadAmuletsCatalog, 
  saveAmuletsCatalog, 
  loadYatraCatalog,
  saveYatraCatalog,
  generateNextConsultationId, 
  clearAllData 
} from './utils/storage';
import { 
  UserAccount, 
  getCurrentUser, 
  isUserLoggedIn, 
  performLogout,
  getEffectivePermissions
} from './utils/auth';
import { 
  CloudVersionInfo, 
  fetchCloudVersion, 
  getStoredLocalVersion, 
  saveStoredLocalVersion, 
  getLastSeenChangelogVersion,
  setLastSeenChangelogVersion,
  compareVersions, 
  LOCAL_APP_VERSION 
} from './utils/versionCheck';
import { Navbar, ActiveTab } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ConsultationList } from './components/ConsultationList';
import { ConsultationFormModal } from './components/ConsultationFormModal';
import { ConsultationDetailModal } from './components/ConsultationDetailModal';
import { MonthlyReportView } from './components/MonthlyReportView';
import { LoyalCustomersView } from './components/LoyalCustomersView';
import { ExpensesView } from './components/ExpensesView';
import { CatalogsManagerView } from './components/CatalogsManagerView';
import { UserManagementView } from './components/UserManagementView';
import { SyncMonitorDashboard } from './components/SyncMonitorDashboard';
import { QuotaMonitorDashboard } from './components/QuotaMonitorDashboard';
import { SystemGuideView } from './components/SystemGuideView';
import { PrintReceiptModal } from './components/PrintReceiptModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { VersionUpdateModal } from './components/VersionUpdateModal';
import { ReleaseChangelogPopUpModal } from './components/ReleaseChangelogPopUpModal';
import { ForcedPWAInstallBanner } from './components/ForcedPWAInstallBanner';
import { DatabaseQuotaModal } from './components/DatabaseQuotaModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { CloudSyncReminderBanner } from './components/CloudSyncReminderBanner';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AppointmentAlertPopup } from './components/AppointmentAlertPopup';
import { LoginScreen } from './components/LoginScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { getDatabaseQuotaReport } from './utils/databaseQuota';
import { 
  checkUpcomingAppointments, 
  UpcomingAppointmentAlert, 
  getTodayAppointments, 
  loadStoredNotifications 
} from './utils/notifications';
import { 
  shouldShowSyncReminderBanner, 
  isCloudSyncOverdue, 
  recordCloudSyncTime 
} from './utils/cloudSyncReminder';
import { 
  testFirestoreConnection,
  subscribeToConsultations, 
  subscribeToExpenses, 
  subscribeToUsers,
  subscribeToAmulets, 
  subscribeToYatras,
  subscribeToExpenseCategories,
  saveConsultationToCloud, 
  deleteConsultationFromCloud, 
  saveExpenseToCloud, 
  deleteExpenseFromCloud, 
  saveAmuletToCloud, 
  deleteAmuletFromCloud,
  saveYatraToCloud,
  deleteYatraFromCloud,
  cleanupAndMigrateYatrasFromAmulets,
  seedOrMigrateLocalToCloud
} from './utils/firebase';
import { loadExpenseCategories, saveExpenseCategories } from './utils/storage';
import { loadUserAccounts, saveUserAccounts } from './utils/auth';
import { getDeviceId, getDeviceName } from './utils/deviceProfile';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserLoggedIn());
  const [currentUser, setCurrentUser] = useState<UserAccount>(getCurrentUser());
  const currentPermissions = useMemo(() => getEffectivePermissions(currentUser.role), [currentUser]);

  // Primary datasets - clean with zero demo data
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [amuletsCatalog, setAmuletsCatalog] = useState<AmuletCatalogItem[]>([]);
  const [yatraCatalog, setYatraCatalog] = useState<YatraCatalogItem[]>([]);

  // Navigation & Layout (Sidebar is on-demand only)
  const [activeTab, setActiveTab] = useState<ActiveTab>('consultations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cloud Version Synchronization States
  const [localVersion, setLocalVersion] = useState<string>(getStoredLocalVersion());
  const [cloudInfo, setCloudInfo] = useState<CloudVersionInfo | null>(null);
  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState<boolean>(false);
  const [isCheckingCloud, setIsCheckingCloud] = useState<boolean>(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [isReleaseChangelogModalOpen, setIsReleaseChangelogModalOpen] = useState<boolean>(
    typeof window !== 'undefined' ? localStorage.getItem('myanmar_astrology_seen_changelog_136') !== 'true' : true
  );
  const [isCloudSyncModalOpen, setIsCloudSyncModalOpen] = useState<boolean>(false);
  const [isDatabaseQuotaModalOpen, setIsDatabaseQuotaModalOpen] = useState<boolean>(false);
  const [storageQuotaPercentage, setStorageQuotaPercentage] = useState<number>(0);
  const [storageQuotaUsedFormatted, setStorageQuotaUsedFormatted] = useState<string>('0 B');
  const [showSyncReminderBanner, setShowSyncReminderBanner] = useState<boolean>(false);

  // Refresh Database Quota metrics & Cloud Sync reminder state
  const refreshDatabaseQuota = useCallback(async () => {
    try {
      const q = await getDatabaseQuotaReport();
      setStorageQuotaPercentage(q.usedPercentage);
      setStorageQuotaUsedFormatted(q.formattedUsed);
      setShowSyncReminderBanner(shouldShowSyncReminderBanner(loadConsultations().length > 0 || loadExpenses().length > 0));
    } catch (e) {
      console.warn('Could not load quota report', e);
    }
  }, []);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ConsultationRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);
  const [printingRecord, setPrintingRecord] = useState<ConsultationRecord | null>(null);
  const [isUpdatePromptModalOpen, setIsUpdatePromptModalOpen] = useState(false);

  // Notification Center & Real-time Alarm Alert States
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [activeAlertPopup, setActiveAlertPopup] = useState<UpcomingAppointmentAlert | null>(null);
  const [notificationRefreshTrigger, setNotificationRefreshTrigger] = useState<number>(0);

  // User-scoped Today's Appointments & Unread Notification Counts
  const todayAppointments = useMemo(() => {
    return getTodayAppointments(consultations, currentUser);
  }, [consultations, currentUser]);

  const unreadNotificationCount = useMemo(() => {
    const allNotis = loadStoredNotifications();
    return allNotis.filter(n => !n.isRead && (
      currentUser.role === 'super_admin' || 
      currentUser.role === 'admin' || 
      n.assignedUserId === currentUser.id ||
      !n.assignedUserId
    )).length;
  }, [currentUser, notificationRefreshTrigger]);

  // Periodic Watcher for 30m, 15m, 5m, 0m Consultation Alarms (Every 5 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Run check immediately
    checkUpcomingAppointments(consultations, currentUser, (alert) => {
      setActiveAlertPopup(alert);
      setNotificationRefreshTrigger((prev) => prev + 1);
    });

    const intervalId = setInterval(() => {
      checkUpcomingAppointments(consultations, currentUser, (alert) => {
        setActiveAlertPopup(alert);
        setNotificationRefreshTrigger((prev) => prev + 1);
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [consultations, currentUser, isAuthenticated]);

  // Check Cloud Version vs Local Version
  const checkCloudVersion = useCallback(async (autoOpenModalOnDiff = false) => {
    setIsCheckingCloud(true);
    try {
      const data = await fetchCloudVersion();
      if (data) {
        setCloudInfo(data);
        const currentLocal = getStoredLocalVersion();
        const diff = compareVersions(data.version, currentLocal);
        if (diff > 0) {
          setIsNewVersionAvailable(true);
          if (autoOpenModalOnDiff) {
            setIsUpdatePromptModalOpen(true);
          }
        } else {
          setIsNewVersionAvailable(false);
        }
      }
    } catch (err) {
      console.warn('Error comparing versions', err);
    } finally {
      setIsCheckingCloud(false);
    }
  }, []);

  // Initialize data, setup online event listener, and continuous version watcher
  useEffect(() => {
    // Load offline cached data initially
    const localC = loadConsultations();
    const localE = loadExpenses();
    const localA = loadAmuletsCatalog();
    const localY = loadYatraCatalog();
    setConsultations(localC);
    setExpenses(localE);
    setAmuletsCatalog(localA);
    setYatraCatalog(localY);

    // Check if user has seen changelog for this current version release
    const lastSeenVer = getLastSeenChangelogVersion();
    if (compareVersions(LOCAL_APP_VERSION, lastSeenVer) > 0) {
      setIsVersionModalOpen(true);
      setLastSeenChangelogVersion(LOCAL_APP_VERSION);
    }

    // Initial check on mount (automatically opens popup if newer version is ready)
    checkCloudVersion(true);
    refreshDatabaseQuota();

    // Test Firestore connection & seed if cloud is empty
    testFirestoreConnection().then(() => {
      seedOrMigrateLocalToCloud(localC, localE, localA, loadUserAccounts(), localY);
      cleanupAndMigrateYatrasFromAmulets().catch(err => console.warn('Amulets to Yatras migration check:', err));
    }).catch(err => {
      console.warn('Initial cloud sync check:', err);
    });

    // Real-time Firestore subscriptions for multi-user / multi-device instant sync
    const unsubConsultations = subscribeToConsultations((cloudRecords) => {
      if (cloudRecords && cloudRecords.length > 0) {
        setConsultations(prevLocal => {
          // Robust merge: cloud records are primary, but preserve any newly added local records
          const cloudIds = new Set(cloudRecords.map(c => c.id));
          const localOnly = prevLocal.filter(l => !cloudIds.has(l.id));

          // Background push any local-only records to cloud to ensure zero data loss
          if (localOnly.length > 0) {
            localOnly.forEach(l => {
              saveConsultationToCloud(l).catch(err => console.warn('Background sync error:', err));
            });
          }

          const merged = [...cloudRecords, ...localOnly];
          merged.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
          saveConsultations(merged);
          return merged;
        });
        refreshDatabaseQuota();
      }
    });

    const unsubExpenses = subscribeToExpenses((cloudExpenses) => {
      if (cloudExpenses && cloudExpenses.length > 0) {
        setExpenses(prevLocal => {
          const cloudIds = new Set(cloudExpenses.map(e => e.id));
          const localOnly = prevLocal.filter(l => !cloudIds.has(l.id));

          if (localOnly.length > 0) {
            localOnly.forEach(l => {
              saveExpenseToCloud(l).catch(err => console.warn('Background sync error:', err));
            });
          }

          const merged = [...cloudExpenses, ...localOnly];
          merged.sort((a, b) => new Date(b.createdAt || b.date || '').getTime() - new Date(a.createdAt || a.date || '').getTime());
          saveExpenses(merged);
          return merged;
        });
        refreshDatabaseQuota();
      }
    });

    const unsubUsers = subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        saveUserAccounts(cloudUsers);
      }
    });

    const unsubAmulets = subscribeToAmulets((cloudAmulets) => {
      if (cloudAmulets && cloudAmulets.length > 0) {
        setAmuletsCatalog(cloudAmulets);
        saveAmuletsCatalog(cloudAmulets);
        refreshDatabaseQuota();
      }
    });

    const unsubYatras = subscribeToYatras((cloudYatras) => {
      if (cloudYatras && cloudYatras.length > 0) {
        setYatraCatalog(cloudYatras);
        saveYatraCatalog(cloudYatras);
        refreshDatabaseQuota();
      }
    });

    const unsubExpenseCategories = subscribeToExpenseCategories((cloudCategories) => {
      if (cloudCategories && cloudCategories.length > 0) {
        saveExpenseCategories(cloudCategories);
      }
    });

    // Continuous Version Polling every 30 seconds
    const versionInterval = setInterval(() => {
      checkCloudVersion(true);
    }, 30000);

    // Whenever browser tab gains focus or visibility, re-check Cloud version
    const handleFocus = () => {
      checkCloudVersion(true);
      refreshDatabaseQuota();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkCloudVersion(true);
      }
    };
    const handleOnline = () => {
      checkCloudVersion(true);
      refreshDatabaseQuota();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(versionInterval);
      unsubConsultations();
      unsubExpenses();
      unsubUsers();
      unsubAmulets();
      unsubYatras();
      unsubExpenseCategories();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkCloudVersion, refreshDatabaseQuota]);

  // Apply Cloud Authoritative Version Update (reloads app with fresh assets & service worker update)
  const handleApplyCloudUpdate = () => {
    if (cloudInfo) {
      saveStoredLocalVersion(cloudInfo.version);
      setLocalVersion(cloudInfo.version);
      setIsNewVersionAvailable(false);
      setIsUpdatePromptModalOpen(false);
      setIsVersionModalOpen(false);

      // Trigger Service Worker update
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (const reg of regs) {
            reg.update();
          }
        });
      }

      // Smoothly reload page with cache-busting query parameter
      setTimeout(() => {
        window.location.href = window.location.pathname + '?_v=' + Date.now();
      }, 250);
    }
  };

  // Save Consultations when modified (writes to Cloud & triggers realtime sync for all devices)
  const handleSaveConsultation = (record: ConsultationRecord) => {
    let finalRecord = { ...record };
    const isNew = !editingRecord;

    // Collision & Overwrite Guard:
    // If saving a new record, but another device created this ID in the meantime:
    if (isNew && consultations.some(c => c.id === finalRecord.id)) {
      const freshId = generateNextConsultationId(consultations);
      finalRecord.id = freshId;
    }

    // Multi-User Auditing & Concurrency versioning
    const currentDevice = getDeviceName();
    finalRecord.updatedAt = new Date().toISOString();
    finalRecord.updatedBy = currentDevice;
    if (!finalRecord.recordedBy) {
      finalRecord.recordedBy = currentDevice;
    }
    finalRecord.deviceId = getDeviceId();
    finalRecord.version = (finalRecord.version || 0) + 1;

    const existingIndex = consultations.findIndex(c => c.id === finalRecord.id);
    let updated: ConsultationRecord[];
    if (existingIndex >= 0) {
      // Smart Field Merge: keep existing predictions or payment if edited from another device
      const existing = consultations[existingIndex];
      const mergedRecord: ConsultationRecord = {
        ...existing,
        ...finalRecord,
        // Ensure non-empty predictions/notes are preserved
        predictions: finalRecord.predictions || existing.predictions,
        yatraInstructions: finalRecord.yatraInstructions || existing.yatraInstructions,
        notes: finalRecord.notes || existing.notes,
      };
      updated = [...consultations];
      updated[existingIndex] = mergedRecord;
      finalRecord = mergedRecord;
    } else {
      updated = [finalRecord, ...consultations];
    }
    setConsultations(updated);
    saveConsultations(updated);
    refreshDatabaseQuota();

    // Push to Google Cloud Firestore (deep merge)
    saveConsultationToCloud(finalRecord).catch(e => console.warn('Cloud save error:', e));

    if (selectedRecord && selectedRecord.id === finalRecord.id) {
      setSelectedRecord(finalRecord);
    }
  };

  // Delete Consultation
  const handleDeleteConsultation = (id: string) => {
    const updated = consultations.filter(c => c.id !== id);
    setConsultations(updated);
    saveConsultations(updated);
    refreshDatabaseQuota();

    // Push deletion to Cloud Firestore
    deleteConsultationFromCloud(id).catch(e => console.warn('Cloud delete error:', e));

    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  // Toggle Task Done
  const handleToggleTaskDone = (id: string) => {
    let updatedTarget: ConsultationRecord | null = null;
    const updated = consultations.map(c => {
      if (c.id === id) {
        const nextDone = !c.taskDone;
        const rec = {
          ...c,
          taskDone: nextDone,
          status: nextDone ? ('completed' as const) : c.status === 'completed' ? ('scheduled' as const) : c.status,
          updatedAt: new Date().toISOString()
        };
        updatedTarget = rec;
        return rec;
      }
      return c;
    });
    setConsultations(updated);
    saveConsultations(updated);
    refreshDatabaseQuota();

    if (updatedTarget) {
      saveConsultationToCloud(updatedTarget).catch(e => console.warn('Cloud update error:', e));
    }

    if (selectedRecord && selectedRecord.id === id) {
      const found = updated.find(c => c.id === id);
      if (found) setSelectedRecord(found);
    }
  };

  // Add Expense
  const handleAddExpense = (expense: ExpenseRecord) => {
    const finalExpense: ExpenseRecord = {
      ...expense,
      recordedBy: getDeviceName(),
    };
    const updated = [finalExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    refreshDatabaseQuota();
    saveExpenseToCloud(finalExpense).catch(e => console.warn('Cloud expense save error:', e));
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
    refreshDatabaseQuota();
    deleteExpenseFromCloud(id).catch(e => console.warn('Cloud expense delete error:', e));
  };

  // Add Yatra to Catalog
  const handleAddYatraCatalogItem = (item: YatraCatalogItem) => {
    const updated = [...yatraCatalog, item];
    setYatraCatalog(updated);
    saveYatraCatalog(updated);
    refreshDatabaseQuota();
    saveYatraToCloud(item).catch(e => console.warn('Cloud yatra save error:', e));
  };

  // Delete Yatra from Catalog
  const handleDeleteYatraCatalogItem = (id: string) => {
    const updated = yatraCatalog.filter(y => y.id !== id);
    setYatraCatalog(updated);
    saveYatraCatalog(updated);
    refreshDatabaseQuota();
    deleteYatraFromCloud(id).catch(e => console.warn('Cloud yatra delete error:', e));
  };

  // Add Amulet to Catalog
  const handleAddCatalogItem = (item: AmuletCatalogItem) => {
    const updated = [...amuletsCatalog, item];
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
    refreshDatabaseQuota();
    saveAmuletToCloud(item).catch(e => console.warn('Cloud amulet save error:', e));
  };

  // Delete Amulet from Catalog
  const handleDeleteCatalogItem = (id: string) => {
    const updated = amuletsCatalog.filter(a => a.id !== id);
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
    refreshDatabaseQuota();
    deleteAmuletFromCloud(id).catch(e => console.warn('Cloud amulet delete error:', e));
  };

  // Toggle Stock for Amulet
  const handleToggleStock = (id: string) => {
    let targetItem: AmuletCatalogItem | null = null;
    const updated = amuletsCatalog.map(a => {
      if (a.id === id) {
        const item = { ...a, inStock: !a.inStock };
        targetItem = item;
        return item;
      }
      return a;
    });
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
    if (targetItem) {
      saveAmuletToCloud(targetItem).catch(e => console.warn('Cloud amulet stock error:', e));
    }
  };

  // Clear All Data
  const handleClearAllData = () => {
    if (window.confirm('မှတ်တမ်းများနှင့် အသုံးစရိတ်စာရင်း အားလုံးကို ရှင်းထုတ်ရန် သေချာပါသလား?')) {
      clearAllData();
      setConsultations([]);
      setExpenses([]);
      refreshDatabaseQuota();
      alert('စာရင်းများ အားလုံး ရှင်းထုတ်ပြီးပါပြီ။');
    }
  };

  // Handle data restored / imported
  const handleDataImported = () => {
    setConsultations(loadConsultations());
    setExpenses(loadExpenses());
    setAmuletsCatalog(loadAmuletsCatalog());
    refreshDatabaseQuota();
  };

  // Logout Super Admin
  const handleLogout = () => {
    if (window.confirm('Super Admin အကောင့်မှ ထွက်ခွာရန် သေချာပါသလား?')) {
      performLogout();
      setIsAuthenticated(false);
    }
  };

  // Pre-fill booking for Royal Customer
  const handleBookForCustomer = (
    customerName: string,
    phone: string
  ) => {
    const nextId = generateNextConsultationId(consultations);
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const nowDateTimeStr = `${todayStr}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const prefilled: ConsultationRecord = {
      id: nextId,
      customerName,
      phone,
      bookingDate: todayStr,
      readingDateTime: nowDateTimeStr,
      serviceCategory: 'general_reading',
      serviceFee: 20000,
      navawinType: 'none',
      navawinFee: 0,
      amulets: [],
      amuletsTotal: 0,
      totalAmount: 20000,
      paidAmount: 20000,
      paymentStatus: 'paid',
      paymentMethod: 'kpay',
      status: 'scheduled',
      taskDone: false,
      predictions: '',
      yatraInstructions: '',
      notes: 'ဖောက်သည်ဟောင်း ရက်ချိန်းအသစ်',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingRecord(prefilled);
    setIsFormOpen(true);
  };

  // Metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayConsultations = useMemo(() => {
    return consultations.filter(c => (c.readingDateTime || c.bookingDate).startsWith(todayStr));
  }, [consultations, todayStr]);

  const totalIncomeToday = useMemo(() => {
    return todayConsultations.reduce((sum, c) => sum + (c.paidAmount || c.totalAmount || 0), 0);
  }, [todayConsultations]);

  // If not logged in, render Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 overflow-x-clip w-full">
      
      {/* On-Demand Slide-in Sidebar (Only shows when called!) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentAccount={currentUser}
        onOpenVersionModal={() => {
          if (isNewVersionAvailable) {
            setIsUpdatePromptModalOpen(true);
          } else {
            setIsVersionModalOpen(true);
          }
        }}
        onOpenCloudSyncModal={() => setIsCloudSyncModalOpen(true)}
        onOpenDatabaseQuotaModal={() => setIsDatabaseQuotaModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
        onOpenNewConsultation={() => {
          setEditingRecord(null);
          setIsFormOpen(true);
        }}
        onLogout={handleLogout}
        onClearAllData={handleClearAllData}
        todayCount={todayConsultations.length}
        totalIncomeToday={totalIncomeToday}
        cloudVersion={cloudInfo?.version || LOCAL_APP_VERSION}
        storageQuotaPercentage={storageQuotaPercentage}
        storageQuotaUsedFormatted={storageQuotaUsedFormatted}
      />

      {/* Main Full-Width Content Container (No permanent sidebar displacement) */}
      <div className="flex-1 flex flex-col w-full max-w-full transition-all">
        
        {/* Top Navigation Bar with Menu Button - Stays sticky pinned at top */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(true)}
          activeTab={activeTab}
          currentAccount={currentUser}
          onOpenVersionModal={() => {
            if (isNewVersionAvailable) {
              setIsUpdatePromptModalOpen(true);
            } else {
              setIsVersionModalOpen(true);
            }
          }}
          onOpenCloudSyncModal={() => setIsCloudSyncModalOpen(true)}
          onOpenDatabaseQuotaModal={() => setIsDatabaseQuotaModalOpen(true)}
          onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
          onOpenNewConsultation={() => {
            setEditingRecord(null);
            setIsFormOpen(true);
          }}
          onOpenNewExpense={() => {
            setActiveTab('expenses');
          }}
          onLogout={handleLogout}
          totalIncomeToday={totalIncomeToday}
          todayCount={todayConsultations.length}
          unreadNotificationCount={unreadNotificationCount}
          todayAppointmentsCount={todayAppointments.length}
          cloudVersion={cloudInfo?.version || LOCAL_APP_VERSION}
          isNewVersionAvailable={isNewVersionAvailable}
          storageQuotaPercentage={storageQuotaPercentage}
          isCloudSyncOverdue={isCloudSyncOverdue()}
        />

        {/* 48-Hour Overdue Cloud Sync Reminder Banner */}
        {showSyncReminderBanner && (
          <CloudSyncReminderBanner
            onOpenSyncModal={() => setIsCloudSyncModalOpen(true)}
            onDismiss={() => setShowSyncReminderBanner(false)}
            totalLocalRecords={consultations.length + expenses.length}
          />
        )}

        {/* Main Tab Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6">
          {activeTab === 'consultations' && (
            <ConsultationList
              records={consultations}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
              onEditRecord={(rec) => {
                setEditingRecord(rec);
                setIsFormOpen(true);
              }}
              onPrintRecord={(rec) => setPrintingRecord(rec)}
              onDeleteRecord={handleDeleteConsultation}
              onToggleTaskDone={handleToggleTaskDone}
              onOpenNewConsultation={() => {
                setEditingRecord(null);
                setIsFormOpen(true);
              }}
            />
          )}

          {activeTab === 'monthly_report' && (
            <MonthlyReportView
              consultations={consultations}
              expenses={expenses}
            />
          )}

          {activeTab === 'royal_customers' && (
            <LoyalCustomersView
              consultations={consultations}
              onBookForCustomer={handleBookForCustomer}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView
              expenses={expenses}
              consultations={consultations}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'yatra_catalog' && (
            <CatalogsManagerView
              yatraCatalog={yatraCatalog}
              amuletCatalog={amuletsCatalog}
              onAddYatraItem={handleAddYatraCatalogItem}
              onDeleteYatraItem={handleDeleteYatraCatalogItem}
              onAddAmuletItem={handleAddCatalogItem}
              onDeleteAmuletItem={handleDeleteCatalogItem}
              onToggleAmuletStock={handleToggleStock}
              forcedSubTab="yatra"
            />
          )}

          {(activeTab === 'amulets_catalog' || activeTab === 'amulets') && (
            <CatalogsManagerView
              yatraCatalog={yatraCatalog}
              amuletCatalog={amuletsCatalog}
              onAddYatraItem={handleAddYatraCatalogItem}
              onDeleteYatraItem={handleDeleteYatraCatalogItem}
              onAddAmuletItem={handleAddCatalogItem}
              onDeleteAmuletItem={handleDeleteCatalogItem}
              onToggleAmuletStock={handleToggleStock}
              forcedSubTab="amulets"
            />
          )}

          {activeTab === 'users' && (
            <UserManagementView
              currentUser={currentUser}
              onUserChanged={() => {
                setCurrentUser(getCurrentUser());
              }}
            />
          )}

          {activeTab === 'sync_monitor' && (
            <SyncMonitorDashboard
              consultations={consultations}
              expenses={expenses}
              amulets={amuletsCatalog}
              onRefreshLocalData={() => {
                setConsultations(loadConsultations());
                setExpenses(loadExpenses());
                setAmuletsCatalog(loadAmuletsCatalog());
                refreshDatabaseQuota();
              }}
            />
          )}

          {activeTab === 'quota_monitor' && (
            <QuotaMonitorDashboard
              onDataImported={() => {
                setConsultations(loadConsultations());
                setExpenses(loadExpenses());
                setAmuletsCatalog(loadAmuletsCatalog());
                refreshDatabaseQuota();
              }}
            />
          )}

          {activeTab === 'system_guide' && (
            <SystemGuideView />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print border-t border-stone-800 bg-stone-950/80 py-4 text-center text-xs text-stone-500">
          <p>မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်းနှင့် ဝန်ဆောင်မှု POS စနစ် • User: {currentUser.name} ({currentUser.role})</p>
        </footer>
      </div>

      {/* Modal 1: Consultation / POS Entry Form */}
      {isFormOpen && (
        <ConsultationFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveConsultation}
          onDirectPrint={(rec) => setPrintingRecord(rec)}
          initialData={editingRecord}
          amuletsCatalog={amuletsCatalog}
          yatraCatalog={yatraCatalog}
          nextId={generateNextConsultationId(consultations)}
          allRecords={consultations}
        />
      )}

      {/* Modal 2: Consultation Dossier & Predictions Detail */}
      {selectedRecord && (
        <ConsultationDetailModal
          record={selectedRecord}
          allRecords={consultations}
          onClose={() => setSelectedRecord(null)}
          onEdit={(rec) => {
            setSelectedRecord(null);
            setEditingRecord(rec);
            setIsFormOpen(true);
          }}
          onPrint={(rec) => {
            setSelectedRecord(null);
            setPrintingRecord(rec);
          }}
          onToggleTaskDone={handleToggleTaskDone}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
        />
      )}

      {/* Modal 3: Print Receipt / Consultation Voucher */}
      {printingRecord && (
        <PrintReceiptModal
          record={printingRecord}
          onClose={() => setPrintingRecord(null)}
        />
      )}

      {/* Modal 4: Release Changelog Celebration Pop Up (Auto / Manual) */}
      <ReleaseChangelogPopUpModal
        isOpen={isReleaseChangelogModalOpen}
        onClose={() => {
          setIsReleaseChangelogModalOpen(false);
          try {
            localStorage.setItem('myanmar_astrology_seen_changelog_136', 'true');
            setLastSeenChangelogVersion(LOCAL_APP_VERSION);
          } catch (e) {
            console.error(e);
          }
        }}
        version={LOCAL_APP_VERSION}
      />

      {/* Modal 4.1: Version History & Cloud Verification Pop Up */}
      {isVersionModalOpen && (
        <VersionHistoryModal
          isOpen={isVersionModalOpen}
          onClose={() => setIsVersionModalOpen(false)}
          cloudInfo={cloudInfo}
          localVersion={localVersion}
          isNewVersionAvailable={isNewVersionAvailable}
          onApplyCloudUpdate={handleApplyCloudUpdate}
          isCheckingCloud={isCheckingCloud}
          onCheckNow={() => checkCloudVersion(false)}
        />
      )}

      {/* Modal 4.2: Real-time Version Update Alert Pop Up */}
      <VersionUpdateModal
        isOpen={isUpdatePromptModalOpen}
        onClose={() => setIsUpdatePromptModalOpen(false)}
        cloudInfo={cloudInfo}
        localVersion={localVersion}
        onApplyUpdate={handleApplyCloudUpdate}
      />

      {/* Modal 5: Database Quota & Storage Analytics */}
      {isDatabaseQuotaModalOpen && (
        <DatabaseQuotaModal
          isOpen={isDatabaseQuotaModalOpen}
          onClose={() => setIsDatabaseQuotaModalOpen(false)}
          onDataImported={handleDataImported}
        />
      )}

      {/* Modal 6: Google Cloud Database 2-User Sync */}
      {isCloudSyncModalOpen && (
        <CloudSyncModal
          isOpen={isCloudSyncModalOpen}
          onClose={() => setIsCloudSyncModalOpen(false)}
          isOnline={navigator.onLine}
          totalConsultations={consultations.length}
          totalExpenses={expenses.length}
          onSyncComplete={() => {
            refreshDatabaseQuota();
          }}
        />
      )}

      {/* Modal 7: Notification Center Drawer (Today's Schedule & Alerts History) */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        records={consultations}
        currentUser={currentUser}
        onOpenConsultation={(cId) => {
          const matched = consultations.find(c => c.id === cId);
          if (matched) {
            setSelectedRecord(matched);
          }
        }}
        onNotificationsUpdated={() => setNotificationRefreshTrigger(prev => prev + 1)}
      />

      {/* Modal 8: Interactive Appointment Alert Popup (30m, 15m, 5m, 0m with Chime Sound) */}
      <AppointmentAlertPopup
        alert={activeAlertPopup}
        onClose={() => setActiveAlertPopup(null)}
        onOpenConsultation={(cId) => {
          const matched = consultations.find(c => c.id === cId);
          if (matched) {
            setSelectedRecord(matched);
          }
        }}
      />

      {/* Forced PWA Install Prompt Banner at bottom */}
      <ForcedPWAInstallBanner />

      {/* PWA Offline Mode Toast Indicator */}
      <OfflineIndicator />

    </div>
  );
}
