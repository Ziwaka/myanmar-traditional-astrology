import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AmuletCatalogItem, 
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
  generateNextConsultationId, 
  clearAllData 
} from './utils/storage';
import { 
  SuperAdminAccount, 
  getCurrentAccount, 
  isUserLoggedIn, 
  performLogout 
} from './utils/auth';
import { 
  CloudVersionInfo, 
  fetchCloudVersion, 
  getStoredLocalVersion, 
  saveStoredLocalVersion, 
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
import { AmuletsCatalogView } from './components/AmuletsCatalogView';
import { PrintReceiptModal } from './components/PrintReceiptModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { LoginScreen } from './components/LoginScreen';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Authentication State (Super Admin Amt)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserLoggedIn());
  const currentAccount: SuperAdminAccount = getCurrentAccount();

  // Primary datasets - clean with zero demo data
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [amuletsCatalog, setAmuletsCatalog] = useState<AmuletCatalogItem[]>([]);

  // Navigation & Layout (Sidebar is on-demand only)
  const [activeTab, setActiveTab] = useState<ActiveTab>('consultations');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cloud Version Synchronization States
  const [localVersion, setLocalVersion] = useState<string>(getStoredLocalVersion());
  const [cloudInfo, setCloudInfo] = useState<CloudVersionInfo | null>(null);
  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState<boolean>(false);
  const [isCheckingCloud, setIsCheckingCloud] = useState<boolean>(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ConsultationRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null);
  const [printingRecord, setPrintingRecord] = useState<ConsultationRecord | null>(null);

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
            setIsVersionModalOpen(true);
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

  // Initialize data and setup online event listener
  useEffect(() => {
    setConsultations(loadConsultations());
    setExpenses(loadExpenses());
    setAmuletsCatalog(loadAmuletsCatalog());

    // Initial check on mount
    checkCloudVersion(true);

    // Whenever internet comes online, re-check Cloud version
    const handleOnline = () => {
      checkCloudVersion(true);
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [checkCloudVersion]);

  // Apply Cloud Authoritative Version Update
  const handleApplyCloudUpdate = () => {
    if (cloudInfo) {
      saveStoredLocalVersion(cloudInfo.version);
      setLocalVersion(cloudInfo.version);
      setIsNewVersionAvailable(false);
      alert(`Cloud ဗားရှင်း v${cloudInfo.version} ကို အတည်ပြု သတ်မှတ်ပြီးပါပြီ။`);
    }
  };

  // Save Consultations when modified
  const handleSaveConsultation = (record: ConsultationRecord) => {
    const existingIndex = consultations.findIndex(c => c.id === record.id);
    let updated: ConsultationRecord[];
    if (existingIndex >= 0) {
      updated = [...consultations];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...consultations];
    }
    setConsultations(updated);
    saveConsultations(updated);

    if (selectedRecord && selectedRecord.id === record.id) {
      setSelectedRecord(record);
    }
  };

  // Delete Consultation
  const handleDeleteConsultation = (id: string) => {
    const updated = consultations.filter(c => c.id !== id);
    setConsultations(updated);
    saveConsultations(updated);
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  // Toggle Task Done
  const handleToggleTaskDone = (id: string) => {
    const updated = consultations.map(c => {
      if (c.id === id) {
        const nextDone = !c.taskDone;
        return {
          ...c,
          taskDone: nextDone,
          status: nextDone ? ('completed' as const) : c.status === 'completed' ? ('scheduled' as const) : c.status,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    });
    setConsultations(updated);
    saveConsultations(updated);

    if (selectedRecord && selectedRecord.id === id) {
      const found = updated.find(c => c.id === id);
      if (found) setSelectedRecord(found);
    }
  };

  // Add Expense
  const handleAddExpense = (expense: ExpenseRecord) => {
    const updated = [expense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  // Add Amulet to Catalog
  const handleAddCatalogItem = (item: AmuletCatalogItem) => {
    const updated = [...amuletsCatalog, item];
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
  };

  // Delete Amulet from Catalog
  const handleDeleteCatalogItem = (id: string) => {
    const updated = amuletsCatalog.filter(a => a.id !== id);
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
  };

  // Toggle Stock for Amulet
  const handleToggleStock = (id: string) => {
    const updated = amuletsCatalog.map(a => a.id === id ? { ...a, inStock: !a.inStock } : a);
    setAmuletsCatalog(updated);
    saveAmuletsCatalog(updated);
  };

  // Clear All Data
  const handleClearAllData = () => {
    if (window.confirm('မှတ်တမ်းများနှင့် အသုံးစရိတ်စာရင်း အားလုံးကို ရှင်းထုတ်ရန် သေချာပါသလား?')) {
      clearAllData();
      setConsultations([]);
      setExpenses([]);
      alert('စာရင်းများ အားလုံး ရှင်းထုတ်ပြီးပါပြီ။');
    }
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
    phone: string,
    birthDayOfWeek: DayOfWeekBurmese,
    birthDate?: string,
    age?: number,
    mahabote?: MahaboteHouse
  ) => {
    const nextId = generateNextConsultationId(consultations);
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const nowDateTimeStr = `${todayStr}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const prefilled: ConsultationRecord = {
      id: nextId,
      customerName,
      phone,
      birthDayOfWeek,
      birthDate,
      age,
      mahabote,
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

  // If not logged in as Super Admin Amt, render Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* On-Demand Slide-in Sidebar (Only shows when called!) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentAccount={currentAccount}
        onOpenVersionModal={() => setIsVersionModalOpen(true)}
        onOpenNewConsultation={() => {
          setEditingRecord(null);
          setIsFormOpen(true);
        }}
        onLogout={handleLogout}
        onClearAllData={handleClearAllData}
        todayCount={todayConsultations.length}
        totalIncomeToday={totalIncomeToday}
        cloudVersion={cloudInfo?.version || '1.2.1'}
      />

      {/* Main Full-Width Content Container (No permanent sidebar displacement) */}
      <div className="flex-1 flex flex-col w-full transition-all">
        
        {/* Top Navigation Bar with Menu Button */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(true)}
          activeTab={activeTab}
          currentAccount={currentAccount}
          onOpenVersionModal={() => setIsVersionModalOpen(true)}
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
          cloudVersion={cloudInfo?.version || '1.2.1'}
          isNewVersionAvailable={isNewVersionAvailable}
        />

        {/* Main Tab Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'amulets' && (
            <AmuletsCatalogView
              catalog={amuletsCatalog}
              onAddCatalogItem={handleAddCatalogItem}
              onDeleteCatalogItem={handleDeleteCatalogItem}
              onToggleStock={handleToggleStock}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="no-print border-t border-stone-800 bg-stone-950/80 py-4 text-center text-xs text-stone-500">
          <p>မြန်မာ့ရိုးရာဗေဒင်ပညာ မှတ်တမ်းနှင့် ဝန်ဆောင်မှု POS စနစ် • Cloudflare Pages Production Ready • Super Admin: {currentAccount.username}</p>
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
          initialData={editingRecord}
          amuletsCatalog={amuletsCatalog}
          nextId={generateNextConsultationId(consultations)}
        />
      )}

      {/* Modal 2: Consultation Dossier & Predictions Detail */}
      {selectedRecord && (
        <ConsultationDetailModal
          record={selectedRecord}
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
        />
      )}

      {/* Modal 3: Print Receipt / Consultation Voucher */}
      {printingRecord && (
        <PrintReceiptModal
          record={printingRecord}
          onClose={() => setPrintingRecord(null)}
        />
      )}

      {/* Modal 4: Version History & Cloud Verification Pop Up */}
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

      {/* PWA Offline Mode Toast Indicator */}
      <OfflineIndicator />

    </div>
  );
}
