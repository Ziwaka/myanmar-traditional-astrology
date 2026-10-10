import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  FileText, 
  X, 
  Save,
  Tag,
  Settings,
  FolderPlus,
  Layers,
  Edit2,
  CheckCircle2,
  PieChart,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Coins,
  CreditCard,
  Building2,
  Check,
  User
} from 'lucide-react';
import { DatePickerInput } from './DatePickerInput';
import { ExpenseRecord, ExpenseCategoryConfig, ConsultationRecord, ExtraIncomeRecord } from '../types';
import { formatMMK, formatDateDDMMYYYY, getRecordPaymentDate } from '../utils/astrology';
import { 
  loadExpenseCategories, 
  saveExpenseCategories, 
  DEFAULT_EXPENSE_CATEGORIES,
  loadExtraIncomes,
  saveExtraIncomes
} from '../utils/storage';
import { saveExpenseCategoryToCloud } from '../utils/firebase';

interface ExpensesViewProps {
  expenses: ExpenseRecord[];
  consultations?: ConsultationRecord[];
  onAddExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  consultations = [],
  onAddExpense,
  onDeleteExpense,
}) => {
  // Navigation View Tab State: 'daily_balance' | 'ledger' | 'extra_incomes' | 'categories' | 'analytics'
  const [activeTab, setActiveTab] = useState<'daily_balance' | 'ledger' | 'extra_incomes' | 'categories' | 'analytics'>('daily_balance');

  // Load persistent Category Configs
  const [categories, setCategories] = useState<ExpenseCategoryConfig[]>([]);
  // Extra Incomes State
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncomeRecord[]>([]);

  useEffect(() => {
    const loadedCats = loadExpenseCategories();
    setCategories(loadedCats);
    const loadedIncomes = loadExtraIncomes();
    setExtraIncomes(loadedIncomes);
  }, []);

  const handleUpdateCategories = (newCats: ExpenseCategoryConfig[]) => {
    setCategories(newCats);
    saveExpenseCategories(newCats);
  };

  const handleAddExtraIncome = (record: ExtraIncomeRecord) => {
    const updated = [record, ...extraIncomes];
    setExtraIncomes(updated);
    saveExtraIncomes(updated);
  };

  const handleDeleteExtraIncome = (id: string) => {
    if (confirm('ဤထပ်တိုးဝင်ငွေမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?')) {
      const updated = extraIncomes.filter(i => i.id !== id);
      setExtraIncomes(updated);
      saveExtraIncomes(updated);
    }
  };

  // Selected Date for Daily Balance Tab
  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const [selectedDailyDate, setSelectedDailyDate] = useState<string>(todayStr);

  // Search & Filters for Ledger
  const [searchTerm, setSearchTerm] = useState('');
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  
  // Modals state
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isPrintDailyReportOpen, setIsPrintDailyReportOpen] = useState(false);
  const [dailyFilterMode, setDailyFilterMode] = useState<'all' | 'incomes' | 'expenses'>('all');
  const [dailyTimelineMode, setDailyTimelineMode] = useState<'all_days' | 'single_day'>('all_days');

  // New Expense Form State
  const [title, setTitle] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [customSubCategoryInput, setCustomSubCategoryInput] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(todayStr);
  const [expensePaymentMethod, setExpensePaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>('cash');
  const [note, setNote] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  // New Extra Income Form State
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeCategory, setIncomeCategory] = useState<string>('အလှူငွေ / ကန်တော့ငွေ');
  const [incomeAmount, setIncomeAmount] = useState<number | ''>('');
  const [incomeDate, setIncomeDate] = useState(todayStr);
  const [incomePaymentMethod, setIncomePaymentMethod] = useState<'cash' | 'kpay' | 'wave' | 'cbbank' | 'ayapay'>('kpay');
  const [incomeNote, setIncomeNote] = useState('');

  // When selectedMainCategory changes, auto-default selectedSubCategory
  useEffect(() => {
    if (selectedMainCategory) {
      const match = categories.find(c => c.name === selectedMainCategory);
      if (match && match.subCategories.length > 0) {
        setSelectedSubCategory(match.subCategories[0]);
      } else {
        setSelectedSubCategory('');
      }
    }
  }, [selectedMainCategory, categories]);

  // Set default main category when opening expense modal
  useEffect(() => {
    if (isAddExpenseModalOpen && categories.length > 0 && !selectedMainCategory) {
      setSelectedMainCategory(categories[0].name);
    }
  }, [isAddExpenseModalOpen, categories, selectedMainCategory]);

  const availableSubCategories = useMemo(() => {
    const match = categories.find(c => c.name === selectedMainCategory);
    return match ? match.subCategories : [];
  }, [categories, selectedMainCategory]);

  const filterSubCategories = useMemo(() => {
    if (mainCategoryFilter === 'all') return [];
    const match = categories.find(c => c.name === mainCategoryFilter);
    return match ? match.subCategories : [];
  }, [categories, mainCategoryFilter]);

  // ==========================================
  // COMPREHENSIVE FINANCE & REVENUE CALCULATIONS
  // ==========================================
  const getRecordPaid = (c: ConsultationRecord): number => {
    const total = (typeof c.totalAmount === 'number' && c.totalAmount > 0)
      ? c.totalAmount
      : ((Number(c.serviceFee) || 0) + (Number(c.yatraFee || c.navawinFee) || 0) + (Number(c.amuletsTotal) || 0));

    if (c.paymentStatus === 'paid' || !c.paymentStatus) {
      return total;
    }
    if (c.paymentStatus === 'partial') {
      return typeof c.paidAmount === 'number' ? c.paidAmount : total;
    }
    if (typeof c.paidAmount === 'number' && c.paidAmount > 0) {
      return c.paidAmount;
    }
    if (c.taskDone || c.status === 'completed') {
      return total;
    }
    return 0;
  };

  const currentMonthStr = useMemo(() => new Date().toISOString().slice(0, 7), []);

  // 1. Current Month Summary (ဒီလ ၁ လစာ - ငွေရှင်းသည့်ရက်စွဲဖြင့် တွက်ချက်သည်)
  const monthSummary = useMemo(() => {
    const monthConsultations = consultations.filter(c => {
      const payDate = getRecordPaymentDate(c);
      return payDate.slice(0, 7) === currentMonthStr;
    });
    const cIncome = monthConsultations.reduce((sum, c) => sum + getRecordPaid(c), 0);
    const mExtraIncomes = extraIncomes.filter(i => (i.date || '').slice(0, 7) === currentMonthStr);
    const eIncome = mExtraIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalIncome = cIncome + eIncome;

    const mExpenses = expenses.filter(e => (e.date || '').slice(0, 7) === currentMonthStr);
    const totalExpense = mExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;

    return {
      monthStr: currentMonthStr,
      consultationCount: monthConsultations.length,
      cIncome,
      eIncome,
      totalIncome,
      totalExpense,
      netProfit,
    };
  }, [consultations, extraIncomes, expenses, currentMonthStr]);

  // 2. All-Time Summary (စုစုပေါင်း ဝင်ငွေ အားလုံး)
  const allTimeSummary = useMemo(() => {
    const cIncome = consultations.reduce((sum, c) => sum + getRecordPaid(c), 0);
    const eIncome = extraIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalIncome = cIncome + eIncome;
    const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpense;

    return {
      consultationCount: consultations.length,
      cIncome,
      eIncome,
      totalIncome,
      totalExpense,
      netProfit,
    };
  }, [consultations, extraIncomes, expenses]);

  // 3. Daily / Selected Period Calculations (ငွေရှင်းသည့်နေ့စွဲဖြင့် တိုက်ရိုက် စစ်ဆေးသည်)
  const dailyConsultations = useMemo(() => {
    return consultations.filter(c => {
      const payDate = getRecordPaymentDate(c);
      return payDate === selectedDailyDate;
    });
  }, [consultations, selectedDailyDate]);

  const dailyConsultationIncome = useMemo(() => {
    return dailyConsultations.reduce((sum, c) => sum + getRecordPaid(c), 0);
  }, [dailyConsultations]);

  const dailyExtraIncomes = useMemo(() => {
    return extraIncomes.filter(i => i.date === selectedDailyDate);
  }, [extraIncomes, selectedDailyDate]);

  const dailyExtraIncomeTotal = useMemo(() => {
    return dailyExtraIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
  }, [dailyExtraIncomes]);

  const dailyTotalIncome = useMemo(() => {
    return dailyConsultationIncome + dailyExtraIncomeTotal;
  }, [dailyConsultationIncome, dailyExtraIncomeTotal]);

  const dailyExpenses = useMemo(() => {
    return expenses.filter(e => e.date === selectedDailyDate);
  }, [expenses, selectedDailyDate]);

  const dailyTotalExpense = useMemo(() => {
    return dailyExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [dailyExpenses]);

  const dailyNetBalance = useMemo(() => {
    return dailyTotalIncome - dailyTotalExpense;
  }, [dailyTotalIncome, dailyTotalExpense]);

  // Payment Method Breakdown for the Selected Date
  const paymentBreakdown = useMemo(() => {
    const methods = [
      { key: 'cash', label: 'Cash (လက်ငင်းငွေသား)', icon: <Coins className="w-4 h-4 text-amber-400" /> },
      { key: 'kpay', label: 'KBZPay (KPay)', icon: <CreditCard className="w-4 h-4 text-blue-400" /> },
      { key: 'wave', label: 'WavePay (Wave)', icon: <CreditCard className="w-4 h-4 text-yellow-400" /> },
      { key: 'cbbank', label: 'CB Bank / AYA / Banking', icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
    ];

    return methods.map(m => {
      // Inflow from consultations
      const cInflow = dailyConsultations
        .filter(c => (c.paymentMethod || 'kpay') === m.key || (m.key === 'cbbank' && c.paymentMethod === 'ayapay'))
        .reduce((sum, c) => sum + getRecordPaid(c), 0);

      // Inflow from extra incomes
      const eInflow = dailyExtraIncomes
        .filter(i => (i.paymentMethod || 'cash') === m.key || (m.key === 'cbbank' && i.paymentMethod === 'ayapay'))
        .reduce((sum, i) => sum + (i.amount || 0), 0);

      const totalIn = cInflow + eInflow;

      // Expense outflow: deduct directly from selected payment method (defaults to cash)
      const totalOut = dailyExpenses
        .filter(e => {
          const pm = e.paymentMethod || 'cash';
          if (m.key === 'cbbank') {
            return pm === 'cbbank' || pm === 'ayapay';
          }
          return pm === m.key;
        })
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      return {
        key: m.key,
        label: m.label,
        icon: m.icon,
        inflow: totalIn,
        outflow: totalOut,
        net: totalIn - totalOut,
      };
    });
  }, [dailyConsultations, dailyExtraIncomes, dailyExpenses]);

  // Combined Chronological Stream of Day's Transactions
  const combinedDailyTransactions = useMemo(() => {
    const list: {
      id: string;
      type: 'consultation_income' | 'extra_income' | 'expense';
      title: string;
      category: string;
      amount: number;
      paymentMethod?: string;
      timeOrId?: string;
      note?: string;
    }[] = [];

    // Add Consultations
    dailyConsultations.forEach(c => {
      list.push({
        id: c.id,
        type: 'consultation_income',
        title: `${c.customerName || 'အမည်မဖော်ပြထားသူ'} (${c.serviceCategory || 'ဗေဒင်'})`,
        category: 'ဗေဒင်ဟောစာတမ်း / ယတြာ / အဆောင်',
        amount: c.paidAmount !== undefined ? c.paidAmount : (c.totalAmount || 0),
        paymentMethod: undefined,
        timeOrId: c.id,
        note: undefined,
      });
    });

    // Add Extra Incomes
    dailyExtraIncomes.forEach(i => {
      list.push({
        id: i.id,
        type: 'extra_income',
        title: i.title,
        category: i.category,
        amount: i.amount,
        paymentMethod: i.paymentMethod || 'cash',
        timeOrId: 'ထပ်တိုးဝင်ငွေ',
        note: i.note,
      });
    });

    // Add Expenses
    dailyExpenses.forEach(e => {
      list.push({
        id: e.id,
        type: 'expense',
        title: e.title,
        category: `${e.category}${e.subCategory ? ` • ${e.subCategory}` : ''}`,
        amount: e.amount,
        paymentMethod: e.paymentMethod || 'cash',
        timeOrId: e.receiptNumber || e.id,
        note: e.note,
      });
    });

    if (dailyFilterMode === 'incomes') {
      return list.filter(t => t.type !== 'expense');
    }
    if (dailyFilterMode === 'expenses') {
      return list.filter(t => t.type === 'expense');
    }
    return list;
  }, [dailyConsultations, dailyExtraIncomes, dailyExpenses, dailyFilterMode]);

  // Group ALL transactions across all days by exact payment/transaction date
  const allDaysTransactionGroups = useMemo(() => {
    const map = new Map<string, {
      date: string;
      totalIncome: number;
      totalExpense: number;
      netBalance: number;
      consultationCount: number;
      items: {
        id: string;
        type: 'consultation_income' | 'extra_income' | 'expense';
        title: string;
        category: string;
        amount: number;
        paymentMethod?: string;
        timeOrId?: string;
        note?: string;
        paidDate?: string;
      }[];
    }>();

    const getOrCreateGroup = (d: string) => {
      const cleanDate = (d || todayStr).slice(0, 10);
      if (!map.has(cleanDate)) {
        map.set(cleanDate, {
          date: cleanDate,
          totalIncome: 0,
          totalExpense: 0,
          netBalance: 0,
          consultationCount: 0,
          items: [],
        });
      }
      return map.get(cleanDate)!;
    };

    // 1. Consultations (using exact Payment Date)
    consultations.forEach(c => {
      const payDate = getRecordPaymentDate(c);
      const paid = getRecordPaid(c);
      if (paid > 0) {
        const grp = getOrCreateGroup(payDate);
        grp.totalIncome += paid;
        grp.netBalance += paid;
        grp.consultationCount += 1;
        grp.items.push({
          id: c.id,
          type: 'consultation_income',
          title: `${c.customerName || 'မမေးသူ'} (${c.serviceCategory || 'ဗေဒင်'})`,
          category: 'ဗေဒင်ဟောစာတမ်း / ယတြာ',
          amount: paid,
          paymentMethod: undefined,
          timeOrId: c.id,
          note: undefined,
          paidDate: payDate,
        });
      }
    });

    // 2. Extra Incomes
    extraIncomes.forEach(i => {
      const iDate = i.date || todayStr;
      const grp = getOrCreateGroup(iDate);
      grp.totalIncome += i.amount;
      grp.netBalance += i.amount;
      grp.items.push({
        id: i.id,
        type: 'extra_income',
        title: i.title,
        category: i.category,
        amount: i.amount,
        paymentMethod: i.paymentMethod || 'cash',
        timeOrId: 'ထပ်တိုးဝင်ငွေ',
        note: i.note,
        paidDate: iDate,
      });
    });

    // 3. Expenses
    expenses.forEach(e => {
      const eDate = e.date || todayStr;
      const grp = getOrCreateGroup(eDate);
      grp.totalExpense += e.amount;
      grp.netBalance -= e.amount;
      grp.items.push({
        id: e.id,
        type: 'expense',
        title: e.title,
        category: `${e.category}${e.subCategory ? ` • ${e.subCategory}` : ''}`,
        amount: e.amount,
        paymentMethod: e.paymentMethod || 'cash',
        timeOrId: e.receiptNumber || e.id,
        note: e.note,
        paidDate: eDate,
      });
    });

    // Convert to array and sort descending by date (newest first)
    const list = Array.from(map.values());
    list.sort((a, b) => b.date.localeCompare(a.date));

    // Apply dailyFilterMode
    return list.map(grp => {
      let filteredItems = grp.items;
      if (dailyFilterMode === 'incomes') {
        filteredItems = grp.items.filter(t => t.type !== 'expense');
      } else if (dailyFilterMode === 'expenses') {
        filteredItems = grp.items.filter(t => t.type === 'expense');
      }
      return {
        ...grp,
        items: filteredItems,
      };
    }).filter(grp => grp.items.length > 0);
  }, [consultations, extraIncomes, expenses, todayStr, dailyFilterMode]);

  // Filtered expenses for Ledger
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.subCategory && e.subCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.note && e.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.receiptNumber && e.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (mainCategoryFilter !== 'all' && e.category !== mainCategoryFilter) return false;
      if (subCategoryFilter !== 'all' && e.subCategory !== subCategoryFilter) return false;
      return true;
    });
  }, [expenses, searchTerm, mainCategoryFilter, subCategoryFilter]);

  const totalLedgerExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Category Breakdown analytics
  const categoryAnalytics = useMemo(() => {
    const map = new Map<string, { total: number; count: number; subMap: Map<string, number> }>();
    expenses.forEach(e => {
      const catName = e.category || 'အထွေထွေ';
      const subName = e.subCategory || 'အထွေထွေ';
      const cur = map.get(catName) || { total: 0, count: 0, subMap: new Map() };
      
      cur.total += (e.amount || 0);
      cur.count += 1;
      
      const curSubTotal = cur.subMap.get(subName) || 0;
      cur.subMap.set(subName, curSubTotal + (e.amount || 0));

      map.set(catName, cur);
    });

    const grandTotal = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    return Array.from(map.entries()).map(([catName, data]) => ({
      catName,
      total: data.total,
      count: data.count,
      percentage: grandTotal > 0 ? ((data.total / grandTotal) * 100).toFixed(1) : '0',
      subBreakdown: Array.from(data.subMap.entries()).map(([sName, sTotal]) => ({
        subName: sName,
        subTotal: sTotal,
        subPercentage: data.total > 0 ? ((sTotal / data.total) * 100).toFixed(0) : '0',
      })),
    }));
  }, [expenses]);

  // Save New Expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('စရိတ်ခေါင်းစဉ်နှင့် ငွေပမာဏ မှန်ကန်စွာ ထည့်သွင်းပေးပါ။');
      return;
    }

    const finalSubCat = customSubCategoryInput.trim() 
      ? customSubCategoryInput.trim() 
      : selectedSubCategory;

    // If custom sub-category was typed, automatically add it to the category config
    if (customSubCategoryInput.trim() && selectedMainCategory) {
      const updatedCats = categories.map(c => {
        if (c.name === selectedMainCategory) {
          if (!c.subCategories.includes(customSubCategoryInput.trim())) {
            return {
              ...c,
              subCategories: [...c.subCategories, customSubCategoryInput.trim()],
            };
          }
        }
        return c;
      });
      handleUpdateCategories(updatedCats);
    }

    const newExpense: ExpenseRecord = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      category: selectedMainCategory || 'အထွေထွေ အသုံးစရိတ်',
      subCategory: finalSubCat || 'အထွေထွေ',
      amount: Number(amount),
      date: date || todayStr,
      paymentMethod: expensePaymentMethod,
      note: note.trim() || undefined,
      receiptNumber: receiptNumber.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setIsAddExpenseModalOpen(false);

    // Reset Form
    setTitle('');
    setAmount('');
    setNote('');
    setReceiptNumber('');
    setCustomSubCategoryInput('');
  };

  // Save Extra Income
  const handleSaveExtraIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeTitle.trim() || !incomeAmount || Number(incomeAmount) <= 0) {
      alert('ဝင်ငွေခေါင်းစဉ်နှင့် ငွေပမာဏ မှန်ကန်စွာ ထည့်သွင်းပေးပါ။');
      return;
    }

    const newIncome: ExtraIncomeRecord = {
      id: `INC-${Date.now().toString().slice(-6)}`,
      title: incomeTitle.trim(),
      category: incomeCategory || 'အထွေထွေဝင်ငွေ',
      amount: Number(incomeAmount),
      date: incomeDate || todayStr,
      paymentMethod: incomePaymentMethod,
      note: incomeNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    handleAddExtraIncome(newIncome);
    setIsAddIncomeModalOpen(false);

    // Reset Form
    setIncomeTitle('');
    setIncomeAmount('');
    setIncomeNote('');
  };

  // Category Configuration Modal State
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#f59e0b');
  const [addingSubForCatId, setAddingSubForCatId] = useState<string | null>(null);
  const [newSubCatInput, setNewSubCatInput] = useState('');

  const handleAddMainCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const exists = categories.some(c => c.name.trim().toLowerCase() === newCatName.trim().toLowerCase());
    if (exists) {
      alert('ဤ Category အမည် ရှိပြီးသား ဖြစ်ပါသည်။');
      return;
    }

    const newConfig: ExpenseCategoryConfig = {
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      subCategories: ['အထွေထွေ'],
      color: newCatColor,
    };

    const updated = [...categories, newConfig];
    handleUpdateCategories(updated);
    saveExpenseCategoryToCloud(newConfig);

    setNewCatName('');
  };

  const handleAddSubCategory = (catId: string) => {
    if (!newSubCatInput.trim()) return;

    const updated = categories.map(c => {
      if (c.id === catId) {
        if (c.subCategories.includes(newSubCatInput.trim())) {
          return c;
        }
        return {
          ...c,
          subCategories: [...c.subCategories, newSubCatInput.trim()],
        };
      }
      return c;
    });

    handleUpdateCategories(updated);
    setNewSubCatInput('');
    setAddingSubForCatId(null);
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('ဤ Category ကို ဖျက်ရန် သေချာပါသလား?')) {
      const updated = categories.filter(c => c.id !== catId);
      handleUpdateCategories(updated);
    }
  };

  const handleDeleteSubCategory = (catId: string, subName: string) => {
    const updated = categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subCategories: c.subCategories.filter(s => s !== subName),
        };
      }
      return c;
    });
    handleUpdateCategories(updated);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* 3 Core Revenue Overview Cards: ၁ လစာ ဝင်ငွေ, စုစုပေါင်း ဝင်ငွေ, ရွေးချယ်ထားသော ကာလ ဝင်ငွေ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        
        {/* 1. ၁ လစာ ဝင်ငွေ (Current Month Income) */}
        <div className="bg-gradient-to-br from-emerald-950/60 via-stone-900 to-stone-900 border border-emerald-500/40 p-4 sm:p-4.5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>ဒီလ ၁ လစာ ဝင်ငွေ</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
              {monthSummary.monthStr}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
            {formatMMK(monthSummary.totalIncome)}
          </div>

          <div className="text-[11px] text-stone-400 space-y-1 border-t border-emerald-500/20 pt-2">
            <div className="flex justify-between">
              <span>ဗေဒင် ({monthSummary.consultationCount} ဦး):</span>
              <strong className="text-stone-200 font-mono">{formatMMK(monthSummary.cIncome)}</strong>
            </div>
            {monthSummary.eIncome > 0 && (
              <div className="flex justify-between">
                <span>အခြားဝင်ငွေ:</span>
                <strong className="text-emerald-400 font-mono">+{formatMMK(monthSummary.eIncome)}</strong>
              </div>
            )}
            <div className="flex justify-between text-stone-400 pt-0.5 border-t border-stone-800/80">
              <span>ဒီလ စရိတ်: {formatMMK(monthSummary.totalExpense)}</span>
              <span className={monthSummary.netProfit >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                အသားတင်: {formatMMK(monthSummary.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. စုစုပေါင်း ဝင်ငွေ (All-time Total Income) */}
        <div className="bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-900 border border-amber-500/40 p-4 sm:p-4.5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>စုစုပေါင်း ဝင်ငွေ (အားလုံး)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              All-Time
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
            {formatMMK(allTimeSummary.totalIncome)}
          </div>

          <div className="text-[11px] text-stone-400 space-y-1 border-t border-amber-500/20 pt-2">
            <div className="flex justify-between">
              <span>စုစုပေါင်း မေးသူ ({allTimeSummary.consultationCount} ဦး):</span>
              <strong className="text-stone-200 font-mono">{formatMMK(allTimeSummary.cIncome)}</strong>
            </div>
            {allTimeSummary.eIncome > 0 && (
              <div className="flex justify-between">
                <span>စုစုပေါင်း အခြားဝင်ငွေ:</span>
                <strong className="text-amber-400 font-mono">+{formatMMK(allTimeSummary.eIncome)}</strong>
              </div>
            )}
            <div className="flex justify-between text-stone-400 pt-0.5 border-t border-stone-800/80">
              <span>ထွက်ငွေ စုစုပေါင်း: {formatMMK(allTimeSummary.totalExpense)}</span>
              <span className={allTimeSummary.netProfit >= 0 ? "text-amber-300 font-bold" : "text-rose-400 font-bold"}>
                လက်ကျန်: {formatMMK(allTimeSummary.netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. ရွေးချယ်ထားသော ကာလ ဝင်ငွေ (Selected Period / Daily Income) */}
        <div className="bg-gradient-to-br from-blue-950/60 via-stone-900 to-stone-900 border border-blue-500/40 p-4 sm:p-4.5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider truncate">
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
              <span>ရွေးချယ်ထားသော ကာလ ဝင်ငွေ</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 shrink-0 font-mono">
              {selectedDailyDate === todayStr ? 'ယနေ့' : formatDateDDMMYYYY(selectedDailyDate)}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-blue-300 font-mono tracking-tight">
            {formatMMK(dailyTotalIncome)}
          </div>

          <div className="text-[11px] text-stone-400 space-y-1 border-t border-blue-500/20 pt-2">
            <div className="flex justify-between">
              <span>ကာလတွင်း ဗေဒင် ({dailyConsultations.length} ဦး):</span>
              <strong className="text-stone-200 font-mono">{formatMMK(dailyConsultationIncome)}</strong>
            </div>
            {dailyExtraIncomeTotal > 0 && (
              <div className="flex justify-between">
                <span>အခြားဝင်ငွေ:</span>
                <strong className="text-blue-400 font-mono">+{formatMMK(dailyExtraIncomeTotal)}</strong>
              </div>
            )}
            <div className="flex justify-between text-stone-400 pt-0.5 border-t border-stone-800/80">
              <span>ကာလတွင်း စရိတ်: {formatMMK(dailyTotalExpense)}</span>
              <span className={dailyNetBalance >= 0 ? "text-blue-300 font-bold" : "text-rose-400 font-bold"}>
                Balance: {formatMMK(dailyNetBalance)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Header & Tabs Navigation */}
      <div className="bg-stone-850 p-3 sm:p-4 rounded-3xl border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span>အသုံးစရိတ်နှင့် ငွေစီးဆင်းမှု စီမံခန့်ခွဲရေး (Finance & Balance)</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              ဗေဒင်ဝင်ငွေနှင့် အလိုအလျောက် ချိတ်ဆက်တွက်ချက်မှု၊ ထပ်တိုးဝင်ငွေ၊ အသုံးစရိတ်နှင့် တရက်တာ Balance
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setIncomeDate(selectedDailyDate);
                setIsAddIncomeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>+ အခြားဝင်ငွေ</span>
            </button>

            <button
              onClick={() => {
                setDate(selectedDailyDate);
                setIsAddExpenseModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ စရိတ်အသစ်</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu - Responsive Grid / Wrap (NO HORIZONTAL SCROLL) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 pt-3 border-t border-stone-800/80 text-xs">
          
          <button
            onClick={() => setActiveTab('daily_balance')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
              activeTab === 'daily_balance'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">တရက်တာ Balance</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-rose-500 text-stone-950 shadow-md font-extrabold ring-2 ring-rose-400/50'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">အသုံးစရိတ် စာရင်း ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('extra_incomes')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
              activeTab === 'extra_incomes'
                ? 'bg-emerald-500 text-stone-950 shadow-md font-extrabold ring-2 ring-emerald-400/50'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">အခြားဝင်ငွေများ ({extraIncomes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-1 ring-amber-400'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">စရိတ် သုံးသပ်ချက်</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl font-bold transition text-center cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-1 ring-amber-400'
                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="leading-tight">စရိတ် အမျိုးအစားများ</span>
          </button>

        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: DAILY BALANCE & CASH FLOW (PRIMARY) */}
      {/* ========================================== */}
      {activeTab === 'daily_balance' && (
        <div className="space-y-4">
          
          {/* Mode Switcher: နေ့အလိုက် Transaction အားလုံး (Timeline) vs ရက်စွဲတစ်ခုချင်း (Single Date) */}
          <div className="flex items-center justify-between gap-2 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 shadow-inner">
            <button
              type="button"
              onClick={() => setDailyTimelineMode('all_days')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                dailyTimelineMode === 'all_days'
                  ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-850'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📅 နေ့အလိုက် Transaction အားလုံး ({allDaysTransactionGroups.length} ရက်စာ)</span>
            </button>

            <button
              type="button"
              onClick={() => setDailyTimelineMode('single_day')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                dailyTimelineMode === 'single_day'
                  ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-850'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>🎯 ရက်စွဲတစ်ခုချင်း စစ်ဆေးမည် ({formatDateDDMMYYYY(selectedDailyDate)})</span>
            </button>
          </div>

          {/* VIEW 1: DAY-BY-DAY ALL TRANSACTIONS TIMELINE */}
          {dailyTimelineMode === 'all_days' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-stone-850 p-3.5 sm:p-4 rounded-2xl border border-stone-800 shadow-md">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>နေ့အလိုက် Transaction အားလုံး Timeline ({allDaysTransactionGroups.length} ရက်စာ)</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    နေ့ရက်အလိုက် ဗေဒင်ဝင်ငွေ၊ ထပ်တိုးဝင်ငွေ၊ အသုံးစရိတ်နှင့် နေ့စဉ် Balance များ
                  </p>
                </div>

                {/* Filter: All / Incomes / Expenses */}
                <div className="flex flex-wrap items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setDailyFilterMode('all')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      dailyFilterMode === 'all' ? 'bg-amber-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    အားလုံး
                  </button>
                  <button
                    onClick={() => setDailyFilterMode('incomes')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      dailyFilterMode === 'incomes' ? 'bg-emerald-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    🟢 ဝင်ငွေသာ
                  </button>
                  <button
                    onClick={() => setDailyFilterMode('expenses')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                      dailyFilterMode === 'expenses' ? 'bg-rose-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    🔴 စရိတ်သာ
                  </button>
                </div>
              </div>

              {allDaysTransactionGroups.length === 0 ? (
                <div className="bg-stone-850 p-12 rounded-3xl border border-stone-800 text-center text-stone-400 space-y-2">
                  <Scale className="w-12 h-12 mx-auto text-stone-600" />
                  <p className="font-semibold text-sm">Transaction မှတ်တမ်း မရှိသေးပါ</p>
                  <p className="text-xs text-stone-500">ဗေဒင်စာရင်းသွင်းခြင်း၊ ဝင်ငွေ သို့မဟုတ် စရိတ်အသစ် ထည့်သွင်းနိုင်ပါသည်</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {allDaysTransactionGroups.map((grp) => {
                    const isTodayGrp = grp.date === todayStr;
                    return (
                      <div key={grp.date} className="bg-stone-850 rounded-2xl border border-stone-800/90 shadow-md overflow-hidden">
                        {/* Day Header Banner - Compact & Clean */}
                        <div className={`px-3 py-2 flex items-center justify-between gap-2 border-b border-stone-800/80 ${
                          isTodayGrp ? 'bg-amber-950/25' : 'bg-stone-900/90'
                        }`}>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <h4 className="font-extrabold text-xs sm:text-sm text-stone-100 font-mono truncate">
                              {formatDateDDMMYYYY(grp.date)}
                            </h4>
                            {isTodayGrp && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-stone-950 shrink-0">
                                ယနေ့
                              </span>
                            )}
                            <span className="text-[11px] text-stone-400 shrink-0">
                              ({grp.items.length} ခု)
                            </span>
                          </div>

                          {/* Day Totals Summary */}
                          <div className="flex items-center gap-2 text-xs shrink-0 font-mono">
                            <span className="text-emerald-400 font-bold text-[11px] sm:text-xs">
                              +{formatMMK(grp.totalIncome)}
                            </span>
                            {grp.totalExpense > 0 && (
                              <span className="text-rose-400 font-bold text-[11px] sm:text-xs">
                                -{formatMMK(grp.totalExpense)}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDailyDate(grp.date);
                                setDailyTimelineMode('single_day');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 text-[10px] font-semibold transition cursor-pointer"
                            >
                              အသေးစိတ် →
                            </button>
                          </div>
                        </div>

                        {/* Day Items List - Sleek & Compact */}
                        <div className="p-2 sm:p-2.5 space-y-1.5">
                          {grp.items.map((item, idx) => {
                            const isIncome = item.type !== 'expense';
                            const cleanNote = item.note && !item.note.includes('09-') ? item.note : '';
                            return (
                              <div
                                key={idx}
                                className={`px-2.5 sm:px-3 py-2 rounded-xl border transition flex items-center justify-between gap-2 ${
                                  isIncome
                                    ? 'bg-emerald-950/15 border-emerald-500/20 hover:bg-emerald-950/25'
                                    : 'bg-rose-950/15 border-rose-500/20 hover:bg-rose-950/25'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${
                                    isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                  }`}>
                                    {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-xs sm:text-sm text-stone-100 truncate">
                                        {item.title}
                                      </span>
                                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${
                                        item.type === 'consultation_income'
                                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                          : item.type === 'extra_income'
                                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                      }`}>
                                        {item.category}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5 truncate">
                                      {item.paymentMethod && <span className="font-bold uppercase text-stone-300">{item.paymentMethod}</span>}
                                      {item.timeOrId && <span>• ID: <strong className="text-amber-400/90 font-mono">{item.timeOrId}</strong></span>}
                                      {cleanNote && <span>• {cleanNote}</span>}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className={`font-mono font-bold text-xs sm:text-sm ${
                                    isIncome ? 'text-emerald-400' : 'text-rose-400'
                                  }`}>
                                    {isIncome ? `+${formatMMK(item.amount)}` : `-${formatMMK(item.amount)}`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: SINGLE DATE DETAILS & METRICS */}
          {dailyTimelineMode === 'single_day' && (
            <div className="space-y-4">
              {/* Date Selector & Print Toolbar (Single Clean Line & Responsive) */}
              <div className="bg-stone-850 p-3 sm:p-4 rounded-2xl border border-stone-800 space-y-3 shadow-inner">
                
                {/* Quick Date Pills */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-stone-300 font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>စစ်ဆေးလိုသည့် နေ့စွဲ:</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDailyDate(todayStr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedDailyDate === todayStr
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow ring-2 ring-amber-400/50'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      🌟 ယနေ့
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDailyDate(yesterdayStr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedDailyDate === yesterdayStr
                          ? 'bg-amber-500 text-stone-950 font-extrabold shadow ring-2 ring-amber-400/50'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      ⬅️ မနေ့က
                    </button>
                  </div>
                </div>

                {/* Date Picker Input & Print Voucher Action - 1 Full Row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <DatePickerInput
                      label=""
                      value={selectedDailyDate}
                      onChange={(d) => setSelectedDailyDate(d)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPrintDailyReportOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-extrabold transition cursor-pointer shadow active:scale-95 shrink-0"
                    title="တရက်တာ ရှင်းတမ်း Print ထုတ်ရန်"
                  >
                    <Printer className="w-4 h-4 text-stone-950" />
                    <span>Print ရှင်းတမ်း</span>
                  </button>
                </div>

              </div>

              {/* Top 3 Metric Hero Cards for Selected Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                
                {/* 1. Daily Total Income */}
                <div className="bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-500/30 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      <span>တရက်တာ စုစုပေါင်း ဝင်ငွေ</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Inflow
                    </span>
                  </div>

                  <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                    {formatMMK(dailyTotalIncome)}
                  </div>

                  <div className="mt-2 text-[11px] text-stone-400 space-y-0.5 border-t border-emerald-500/20 pt-2">
                    <div className="flex justify-between">
                      <span>🔮 ဗေဒင် + ယတြာ + အဆောင် ({dailyConsultations.length} ဦး):</span>
                      <strong className="text-stone-200 font-mono">{formatMMK(dailyConsultationIncome)}</strong>
                    </div>
                    {dailyExtraIncomeTotal > 0 && (
                      <div className="flex justify-between">
                        <span>➕ အခြားထပ်တိုး ဝင်ငွေ ({dailyExtraIncomes.length} ခု):</span>
                        <strong className="text-emerald-400 font-mono">{formatMMK(dailyExtraIncomeTotal)}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Daily Total Expenses */}
                <div className="bg-gradient-to-br from-rose-950/40 via-stone-900 to-stone-900 border border-rose-500/30 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      <span>တရက်တာ စုစုပေါင်း အသုံးစရိတ်</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Outflow ({dailyExpenses.length} ခု)
                    </span>
                  </div>

                  <div className="mt-2 text-2xl sm:text-3xl font-black text-rose-300 font-mono">
                    {formatMMK(dailyTotalExpense)}
                  </div>

                  <div className="mt-2 text-[11px] text-stone-400 space-y-0.5 border-t border-rose-500/20 pt-2 flex justify-between">
                    <span>ကုန်ကျခဲ့သော စရိတ်ခေါင်းစဉ်များ:</span>
                    <strong className="text-rose-300">{dailyExpenses.length > 0 ? `${dailyExpenses.length} မျိုး` : 'မရှိသေးပါ'}</strong>
                  </div>
                </div>

                {/* 3. Daily Net Balance */}
                <div className={`p-4 sm:p-5 rounded-3xl border shadow-lg relative overflow-hidden ${
                  dailyNetBalance >= 0
                    ? 'bg-gradient-to-br from-amber-950/40 via-stone-900 to-emerald-950/30 border-amber-500/50'
                    : 'bg-gradient-to-br from-rose-950/60 via-stone-900 to-stone-900 border-rose-500/60'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span>တရက်တာ အသားတင် Balance</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      dailyNetBalance >= 0
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {dailyNetBalance >= 0 ? '✨ လက်ကျန်ငွေပို' : '⚠️ စရိတ်ပိုငွေလို'}
                    </span>
                  </div>

                  <div className={`mt-2 text-2xl sm:text-3xl font-black font-mono ${
                    dailyNetBalance >= 0 ? 'text-amber-300' : 'text-rose-400'
                  }`}>
                    {dailyNetBalance < 0 ? `- ${formatMMK(Math.abs(dailyNetBalance))}` : formatMMK(dailyNetBalance)}
                  </div>

                  <div className="mt-2 text-[11px] text-stone-400 border-t border-stone-800 pt-2 flex justify-between">
                    <span>(ဝင်ငွေ − အသုံးစရိတ်):</span>
                    <span className={`font-bold ${dailyNetBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dailyNetBalance >= 0 ? 'အသားတင် အမြတ်/လက်ကျန်' : 'အသုံးစရိတ် ပိုလျှံနေပါသည်'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Payment Method Balances Grid */}
              <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-stone-200 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>ငွေပေးချေမှု နည်းလမ်းအလိုက် တရက်တာ ဝင်/ထွက်/လက်ကျန် စာရင်း</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {paymentBreakdown.map((pb) => (
                    <div key={pb.key} className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                        <span className="flex items-center gap-1.5">{pb.icon} {pb.label}</span>
                      </div>

                      <div className="text-[11px] text-stone-400 space-y-1">
                        <div className="flex justify-between">
                          <span>ဝင်ငွေ (In):</span>
                          <span className="text-emerald-400 font-mono font-semibold">+{formatMMK(pb.inflow)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>စရိတ် (Out):</span>
                          <span className="text-rose-400 font-mono font-semibold">-{formatMMK(pb.outflow)}</span>
                        </div>
                      </div>

                      <div className="border-t border-stone-800/80 pt-1.5 flex justify-between items-center text-xs">
                        <span className="text-stone-400 font-medium">လက်ကျန်:</span>
                        <strong className={`font-mono font-bold ${pb.net >= 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                          {pb.net < 0 ? `- ${formatMMK(Math.abs(pb.net))}` : formatMMK(pb.net)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combined Daily Transactions Stream */}
              <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 space-y-3">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>{formatDateDDMMYYYY(selectedDailyDate)} ၏ ဝင်/ထွက် စာရင်းအားလုံး ({combinedDailyTransactions.length} ခု)</span>
                    </h3>
                    <span className="text-xs text-stone-400">ဗေဒင်ဟောစာရင်းမှ အလိုအလျောက် သွင်းယူထားသော ဝင်ငွေ၊ ထပ်တိုးဝင်ငွေနှင့် စရိတ်များ</span>
                  </div>

                  {/* Filter: All / Incomes / Expenses - Wraps cleanly on mobile */}
                  <div className="flex flex-wrap items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
                    <button
                      onClick={() => setDailyFilterMode('all')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                        dailyFilterMode === 'all' ? 'bg-amber-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      အားလုံး ({dailyConsultations.length + dailyExtraIncomes.length + dailyExpenses.length})
                    </button>
                    <button
                      onClick={() => setDailyFilterMode('incomes')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                        dailyFilterMode === 'incomes' ? 'bg-emerald-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      🟢 ဝင်ငွေသာ ({dailyConsultations.length + dailyExtraIncomes.length})
                    </button>
                    <button
                      onClick={() => setDailyFilterMode('expenses')}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer text-center ${
                        dailyFilterMode === 'expenses' ? 'bg-rose-500 text-stone-950 font-extrabold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      🔴 စရိတ်သာ ({dailyExpenses.length})
                    </button>
                  </div>
                </div>

                {combinedDailyTransactions.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 space-y-2">
                    <Scale className="w-12 h-12 mx-auto text-stone-600" />
                    <p className="font-semibold text-sm">ဤနေ့ရက်အတွက် ဝင်ငွေ/အသုံးစရိတ် မှတ်တမ်း မရှိသေးပါ</p>
                    <p className="text-xs text-stone-500">ဗေဒင်စာရင်းသွင်းခြင်း၊ ဝင်ငွေ သို့မဟုတ် စရိတ်အသစ် ထည့်သွင်းနိုင်ပါသည်</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {combinedDailyTransactions.map((item, idx) => {
                      const isIncome = item.type !== 'expense';
                      const cleanNote = item.note && !item.note.includes('09-') ? item.note : '';
                      return (
                        <div
                          key={idx}
                          className={`px-2.5 sm:px-3 py-2 rounded-xl border transition flex items-center justify-between gap-2 ${
                            isIncome
                              ? 'bg-emerald-950/15 border-emerald-500/20 hover:bg-emerald-950/25'
                              : 'bg-rose-950/15 border-rose-500/20 hover:bg-rose-950/25'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center ${
                              isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs sm:text-sm text-stone-100 truncate">
                                  {item.title}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${
                                  item.type === 'consultation_income'
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                    : item.type === 'extra_income'
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                }`}>
                                  {item.category}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5 truncate">
                                {item.paymentMethod && <span className="font-bold uppercase text-stone-300">{item.paymentMethod}</span>}
                                {item.timeOrId && <span>• ID: <strong className="text-amber-400/90 font-mono">{item.timeOrId}</strong></span>}
                                {cleanNote && <span>• {cleanNote}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`font-mono font-bold text-xs sm:text-sm ${
                              isIncome ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {isIncome ? `+${formatMMK(item.amount)}` : `-${formatMMK(item.amount)}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: EXPENSE LEDGER (ALL EXPENSES)       */}
      {/* ========================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="စရိတ်အမည်၊ အမျိုးအစား၊ ပြေစာအမှတ် သို့မဟုတ် မှတ်ချက်ဖြင့် ရှာရန်..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '16px' }}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500 text-xs sm:text-sm"
              />
            </div>

            {/* Main Category Filter */}
            <div className="flex items-center gap-2">
              <select
                value={mainCategoryFilter}
                onChange={(e) => {
                  setMainCategoryFilter(e.target.value);
                  setSubCategoryFilter('all');
                }}
                className="px-3 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-stone-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">📂 Main Category အားလုံး</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Sub-Category Filter if main category selected */}
              {mainCategoryFilter !== 'all' && filterSubCategories.length > 0 && (
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-amber-300 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">📁 Sub Category အားလုံး</option>
                  {filterSubCategories.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Ledger Table / List */}
          <div className="bg-stone-850 rounded-3xl border border-stone-800 overflow-hidden shadow-md">
            
            <div className="p-4 bg-stone-900/60 border-b border-stone-800 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400">
                ရှာဖွေတွေ့ရှိသည့် စရိတ်: <strong className="text-stone-200">{filteredExpenses.length}</strong> ခု
              </span>
              <span className="text-xs font-bold text-rose-400 font-mono">
                စုစုပေါင်း ကျသင့်ငွေ: {formatMMK(totalLedgerExpenses)}
              </span>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <Wallet className="w-12 h-12 mx-auto text-stone-600" />
                <p className="font-semibold text-sm">အသုံးစရိတ် စာရင်း မရှိသေးပါ</p>
                <p className="text-xs text-stone-500">"+ စရိတ်အသစ်" ခလုတ်ကို နှိပ်၍ ထည့်သွင်းနိုင်ပါသည်</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 hover:bg-stone-800/40 transition flex items-center justify-between gap-3">
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-stone-100 truncate">{expense.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {expense.category}
                        </span>
                        {expense.subCategory && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700">
                            {expense.subCategory}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-amber-300 border border-stone-700 uppercase">
                          {expense.paymentMethod || 'cash'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          {formatDateDDMMYYYY(expense.date)}
                        </span>
                        {expense.receiptNumber && <span>• ပြေစာ: {expense.receiptNumber}</span>}
                        {expense.note && <span>• {expense.note}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-sm sm:text-base text-rose-400">
                        -{formatMMK(expense.amount)}
                      </span>

                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                        title="ဖျက်မည်"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: EXTRA INCOMES                       */}
      {/* ========================================== */}
      {activeTab === 'extra_incomes' && (
        <div className="space-y-4">
          
          <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>အခြား ထပ်တိုး ဝင်ငွေများ (Extra & Custom Incomes)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                အလှူငွေ/ကန်တော့ငွေ၊ စာအုပ်နှင့် ပစ္စည်းအရောင်း၊ သင်တန်းကြေး စသည့် ဗေဒင်ပြင်ပ ဝင်ငွေများ
              </p>
            </div>

            <button
              onClick={() => setIsAddIncomeModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ ဝင်ငွေအသစ် ထည့်မည်</span>
            </button>
          </div>

          <div className="bg-stone-850 rounded-3xl border border-stone-800 overflow-hidden shadow-md">
            {extraIncomes.length === 0 ? (
              <div className="py-16 text-center text-stone-400 space-y-2">
                <Coins className="w-12 h-12 mx-auto text-stone-600" />
                <p className="font-semibold text-sm">ထပ်တိုး ဝင်ငွေမှတ်တမ်း မရှိသေးပါ</p>
                <p className="text-xs text-stone-500">အလှူငွေ သို့မဟုတ် အခြားဝင်ငွေများအား ဤနေရာတွင် ထည့်သွင်းမှတ်တမ်းတင်နိုင်ပါသည်</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {extraIncomes.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-stone-800/40 transition flex items-center justify-between gap-3">
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-stone-100 truncate">{item.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.category}
                        </span>
                        {item.paymentMethod && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700 uppercase">
                            {item.paymentMethod}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          {formatDateDDMMYYYY(item.date)}
                        </span>
                        {item.note && <span>• {item.note}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-sm sm:text-base text-emerald-400">
                        +{formatMMK(item.amount)}
                      </span>

                      <button
                        onClick={() => handleDeleteExtraIncome(item.id)}
                        className="p-2 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                        title="ဖျက်မည်"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: ANALYTICS & CHARTS                  */}
      {/* ========================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 space-y-4 shadow-md">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span>Category အလိုက် အသုံးစရိတ် ခွဲခြမ်းစိတ်ဖြာမှု</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryAnalytics.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">{cat.catName}</span>
                    <span className="font-mono font-bold text-rose-400">{formatMMK(cat.total)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>အရေအတွက်: {cat.count} ခု</span>
                    <span>ရာခိုင်နှုန်း: {cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 5: CATEGORIES SETTINGS                 */}
      {/* ========================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          
          {/* Add Category Card */}
          <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 shadow-md">
            <h3 className="text-sm font-bold text-stone-200 mb-3 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Main Category အသစ် ထည့်သွင်းရန်</span>
            </h3>

            <form onSubmit={handleAddMainCategory} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                required
                placeholder="Category အမည် (ဥပမာ- သာသနာရေးစရိတ်)..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ fontSize: '16px' }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:border-amber-500"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                + Category ထည့်မည်
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 bg-stone-850 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="font-bold text-sm text-amber-300">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 rounded text-stone-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-stone-400 block font-semibold">Sub-Categories:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subCategories.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-700 text-stone-300 text-[11px] flex items-center gap-1"
                      >
                        <span>{sub}</span>
                        <button
                          onClick={() => handleDeleteSubCategory(cat.id, sub)}
                          className="hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {addingSubForCatId === cat.id ? (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Sub Category အသစ်..."
                      value={newSubCatInput}
                      onChange={(e) => setNewSubCatInput(e.target.value)}
                      style={{ fontSize: '16px' }}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubCategory(cat.id)}
                      className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold text-xs rounded-lg"
                    >
                      ထည့်
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingSubForCatId(null)}
                      className="p-1 text-stone-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingSubForCatId(cat.id)}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Sub Category ထပ်ထည့်ရန်
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 1: ADD NEW EXPENSE                   */}
      {/* ========================================== */}
      {isAddExpenseModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
          }}
        >
          <div className="bg-stone-900 border border-stone-750 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between px-5 py-3.5 bg-stone-950 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Wallet className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-bold text-stone-100 text-base">
                  အသုံးစရိတ် စာရင်းအသစ် ထည့်မည်
                </h3>
              </div>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* Expense Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  စရိတ် ခေါင်းစဉ်/အမည် <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ဥပမာ- ဘုရားပန်းနှင့် ဖယောင်းတိုင် ဝယ်ယူစရိတ်"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 font-medium focus:border-rose-500"
                />
              </div>

              {/* Main Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-300 block">
                  Main Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedMainCategory}
                  onChange={(e) => setSelectedMainCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-rose-500/50 text-rose-200 font-semibold focus:border-rose-400 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-300">
                  Sub-Category (အမျိုးအစားခွဲ)
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-amber-500/50 text-amber-200 font-semibold focus:border-amber-400 cursor-pointer"
                >
                  {availableSubCategories.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="">+ စိတ်ကြိုက် ရိုက်ထည့်မည်...</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  ကျသင့် ငွေပမာဏ (ကျပ်) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="ကျပ်"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-rose-300 font-mono font-bold focus:border-rose-500"
                />
              </div>

              {/* Date */}
              <DatePickerInput
                label="ရက်စွဲ"
                required
                value={date}
                onChange={(newVal) => setDate(newVal)}
              />

              {/* Payment Method / Paid From */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-amber-300">
                    ငွေထုတ်ယူသုံးစွဲသည့် အကောင့် (Paid From) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-stone-400">ရွေးချယ်သည့် အကောင့်ထဲမှ လျော့ပါမည်</span>
                </div>
                <select
                  value={expensePaymentMethod}
                  onChange={(e) => setExpensePaymentMethod(e.target.value as any)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-amber-500/40 text-amber-200 font-semibold focus:border-amber-400 cursor-pointer shadow-inner"
                >
                  <option value="cash">💵 လက်ငင်းငွေသား (Cash အိတ်ထဲမှ လျော့မည်)</option>
                  <option value="kpay">📱 KBZPay (KPay အကောင့်ထဲမှ လျော့မည်)</option>
                  <option value="wave">🌊 Wave Money (Wave အကောင့်ထဲမှ လျော့မည်)</option>
                  <option value="cbbank">🏦 CB Bank / Banking (ဘဏ်အကောင့်ထဲမှ လျော့မည်)</option>
                  <option value="ayapay">💳 AYA Pay (AYA အကောင့်ထဲမှ လျော့မည်)</option>
                </select>
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-400">
                  မှတ်ချက် (Optional)
                </label>
                <input
                  type="text"
                  placeholder="အထွေထွေ မှတ်ချက်..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs cursor-pointer"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>စရိတ်စာရင်း သိမ်းမည်</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: ADD EXTRA INCOME                  */}
      {/* ========================================== */}
      {isAddIncomeModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
          }}
        >
          <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150 max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between px-5 py-3.5 bg-stone-950 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Coins className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-stone-100 text-base">
                  အခြား ထပ်တိုးဝင်ငွေ ထည့်သွင်းမည်
                </h3>
              </div>
              <button
                onClick={() => setIsAddIncomeModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExtraIncome} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 text-xs sm:text-sm">
              
              {/* Income Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  ဝင်ငွေ ခေါင်းစဉ်/အကြောင်းအရာ <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ဥပမာ- ဖောက်သည်မှ ကန်တော့ငွေ၊ စာအုပ်ရောင်းရငွေ"
                  value={incomeTitle}
                  onChange={(e) => setIncomeTitle(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 font-medium focus:border-emerald-500"
                />
              </div>

              {/* Income Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-300 block">
                  ဝင်ငွေ အမျိုးအစား
                </label>
                <select
                  value={incomeCategory}
                  onChange={(e) => setIncomeCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-emerald-500/50 text-emerald-200 font-semibold focus:border-emerald-400 cursor-pointer"
                >
                  <option value="အလှူငွေ / ကန်တော့ငွေ">🙏 အလှူငွေ / ကန်တော့ငွေ</option>
                  <option value="စာအုပ် / ပစ္စည်းအရောင်း">📚 စာအုပ် / ပစ္စည်းအရောင်း</option>
                  <option value="သင်တန်းကြေး">🎓 ဗေဒင်သင်တန်းကြေး</option>
                  <option value="အထွေထွေဝင်ငွေ">✨ အထွေထွေ ဝင်ငွေ</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  ရရှိသည့် ငွေပမာဏ (ကျပ်) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="ကျပ်"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-emerald-300 font-mono font-bold focus:border-emerald-500"
                />
              </div>

              {/* Date */}
              <DatePickerInput
                label="ရက်စွဲ"
                required
                value={incomeDate}
                onChange={(newVal) => setIncomeDate(newVal)}
              />

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-300">
                  လက်ခံရရှိသည့် နည်းလမ်း:
                </label>
                <select
                  value={incomePaymentMethod}
                  onChange={(e) => setIncomePaymentMethod(e.target.value as any)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 font-medium focus:border-emerald-400 cursor-pointer"
                >
                  <option value="cash">💵 လက်ငင်းငွေသား (Cash)</option>
                  <option value="kpay">📱 KBZPay (KPay)</option>
                  <option value="wave">🌊 Wave Money</option>
                  <option value="cbbank">🏦 CB Bank / Banking</option>
                  <option value="ayapay">💳 AYA Pay</option>
                </select>
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-400">
                  မှတ်ချက် (Optional)
                </label>
                <input
                  type="text"
                  placeholder="အထွေထွေ မှတ်ချက်..."
                  value={incomeNote}
                  onChange={(e) => setIncomeNote(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs cursor-pointer"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ဝင်ငွေ သိမ်းမည်</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: PRINT DAILY REPORT                */}
      {/* ========================================== */}
      {isPrintDailyReportOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          style={{
            paddingTop: 'max(env(safe-area-inset-top, 2.75rem), 2.75rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 1.25rem), 1.25rem)',
          }}
        >
          <div className="bg-white text-stone-900 rounded-2xl w-full max-w-xl shadow-2xl p-6 my-auto max-h-[calc(100dvh-5.5rem)] sm:max-h-[90vh] overflow-y-auto">
            
            <div className="text-center border-b-2 border-stone-800 pb-3 mb-4">
              <h2 className="text-lg font-black text-stone-900">တရက်တာ ဝင်ငွေ၊ အသုံးစရိတ်နှင့် Balance ရှင်းတမ်း</h2>
              <p className="text-xs text-stone-600 font-bold mt-0.5">ရက်စွဲ: {formatDateDDMMYYYY(selectedDailyDate)}</p>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 bg-stone-100 rounded-xl mb-4 border border-stone-300 text-xs">
              <div>
                <span className="text-stone-500 block">စုစုပေါင်း ဝင်ငွေ</span>
                <strong className="text-emerald-700 font-mono text-sm">{formatMMK(dailyTotalIncome)}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">စုစုပေါင်း စရိတ်</span>
                <strong className="text-rose-700 font-mono text-sm">{formatMMK(dailyTotalExpense)}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">အသားတင် Balance</span>
                <strong className={`font-mono text-sm ${dailyNetBalance >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                  {dailyNetBalance < 0 ? `- ${formatMMK(Math.abs(dailyNetBalance))}` : formatMMK(dailyNetBalance)}
                </strong>
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-1.5 text-xs mb-6">
              <span className="font-bold block text-stone-800 border-b pb-1">စာရင်း အသေးစိတ်:</span>
              {combinedDailyTransactions.map((t, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-stone-200">
                  <div>
                    <span className="font-semibold">{t.title}</span>
                    <span className="text-stone-500 text-[10px] block">({t.category})</span>
                  </div>
                  <strong className={`font-mono ${t.type !== 'expense' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {t.type !== 'expense' ? `+${formatMMK(t.amount)}` : `-${formatMMK(t.amount)}`}
                  </strong>
                </div>
              ))}
            </div>

            {/* Print Action & Close */}
            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                onClick={() => setIsPrintDailyReportOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                ပိတ်မည်
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>ပရင့် ထုတ်မည် (Print)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
