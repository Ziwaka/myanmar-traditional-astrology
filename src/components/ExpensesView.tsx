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
  ChevronDown
} from 'lucide-react';
import { DatePickerInput } from './DatePickerInput';
import { ExpenseRecord, ExpenseCategoryConfig } from '../types';
import { formatMMK, formatDateDDMMYYYY } from '../utils/astrology';
import { loadExpenseCategories, saveExpenseCategories, DEFAULT_EXPENSE_CATEGORIES } from '../utils/storage';
import { saveExpenseCategoryToCloud, deleteExpenseCategoryFromCloud } from '../utils/firebase';

interface ExpensesViewProps {
  expenses: ExpenseRecord[];
  onAddExpense: (expense: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
}) => {
  // Navigation View Tab State: 'ledger' | 'categories' | 'analytics'
  const [activeTab, setActiveTab] = useState<'ledger' | 'categories' | 'analytics'>('ledger');

  // Load persistent Category Configs
  const [categories, setCategories] = useState<ExpenseCategoryConfig[]>([]);

  useEffect(() => {
    const loaded = loadExpenseCategories();
    setCategories(loaded);
  }, []);

  const handleUpdateCategories = (newCats: ExpenseCategoryConfig[]) => {
    setCategories(newCats);
    saveExpenseCategories(newCats);
  };

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [customSubCategoryInput, setCustomSubCategoryInput] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(todayStr);
  const [note, setNote] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  // When selectedMainCategory changes, auto-default selectedSubCategory to first available sub-category or empty
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

  // Set default main category when opening modal if empty
  useEffect(() => {
    if (isAddModalOpen && categories.length > 0 && !selectedMainCategory) {
      setSelectedMainCategory(categories[0].name);
    }
  }, [isAddModalOpen, categories, selectedMainCategory]);

  // Available Sub-Categories for selected Main Category in form
  const availableSubCategories = useMemo(() => {
    const match = categories.find(c => c.name === selectedMainCategory);
    return match ? match.subCategories : [];
  }, [categories, selectedMainCategory]);

  // Available Sub-Categories for current Main Category filter
  const filterSubCategories = useMemo(() => {
    if (mainCategoryFilter === 'all') return [];
    const match = categories.find(c => c.name === mainCategoryFilter);
    return match ? match.subCategories : [];
  }, [categories, mainCategoryFilter]);

  // Filtered expenses
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

  // Overall total
  const totalAmount = useMemo(() => {
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

    // If custom sub-category was typed, automatically add it to the category config!
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
      note: note.trim(),
      receiptNumber: receiptNumber.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setIsAddModalOpen(false);

    // Reset Form
    setTitle('');
    setAmount('');
    setNote('');
    setReceiptNumber('');
    setCustomSubCategoryInput('');
  };

  // Category Configuration Modal State (New Category Form & New Sub Category Forms)
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
    const cat = updated.find(c => c.id === catId);
    if (cat) saveExpenseCategoryToCloud(cat);

    setNewSubCatInput('');
    setAddingSubForCatId(null);
  };

  const handleDeleteSubCategory = (catId: string, subName: string) => {
    if (!window.confirm(`"${subName}" Sub-Category ကို ဖျက်ရန် သေချာပါသလား?`)) return;

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
    const cat = updated.find(c => c.id === catId);
    if (cat) saveExpenseCategoryToCloud(cat);
  };

  const handleDeleteMainCategory = (catId: string, catName: string) => {
    if (!window.confirm(`"${catName}" Category တစ်ခုလုံးကို ဖျက်ရန် သေချာပါသလား?`)) return;

    const updated = categories.filter(c => c.id !== catId);
    handleUpdateCategories(updated);
    deleteExpenseCategoryFromCloud(catId);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Wallet className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-rose-200">
                အသုံးစရိတ် စီမံခန့်ခွဲမှု စနစ် (Expense Manager)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pre-set Category Manager
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Category နှင့် Sub-Category များကို ကြိုတင် Set ပြုလုပ်၍ စနစ်တကျ စရိတ်စာရင်းများ သွင်းယူနိုင်ပါသည်
            </p>
          </div>
        </div>

        {/* Tab Navigation Buttons & Add Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'ledger'
                  ? 'bg-rose-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              စရိတ်စာရင်းများ
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-amber-300'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Category Setup ({categories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'text-stone-400 hover:text-purple-300'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>သုံးသပ်ချက်</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ အသုံးစရိတ် အသစ်</span>
          </button>
        </div>
      </div>

      {/* TAB 1: EXPENSES LEDGER VIEW */}
      {activeTab === 'ledger' && (
        <>
          {/* Control Bar: Search & Filter & Total Sum */}
          <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-3 shadow">
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto flex-1">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="ခေါင်းစဉ်၊ အမျိုးအစား၊ ပြေစာအမှတ်ဖြင့် ရှာရန်..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Main Category Filter Dropdown */}
              <select
                value={mainCategoryFilter}
                onChange={(e) => {
                  setMainCategoryFilter(e.target.value);
                  setSubCategoryFilter('all');
                }}
                className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-stone-900 border border-stone-700 text-stone-200 focus:border-rose-500 cursor-pointer"
              >
                <option value="all">Main Category (အားလုံး)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Sub Category Filter Dropdown */}
              {filterSubCategories.length > 0 && (
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-stone-900 border border-stone-700 text-amber-300 focus:border-amber-500 cursor-pointer"
                >
                  <option value="all">Sub-Category (အားလုံး)</option>
                  {filterSubCategories.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Total Expense Display Box */}
            <div className="flex items-center gap-3 bg-stone-900 px-4 py-2 rounded-xl border border-stone-800 self-end lg:self-auto shrink-0">
              <span className="text-xs text-stone-400 font-medium">စုစုပေါင်း အသုံးစရိတ်:</span>
              <span className="text-base sm:text-lg font-bold font-mono text-rose-400">
                {formatMMK(totalAmount)}
              </span>
            </div>

          </div>

          {/* Expenses List / Table */}
          <div className="bg-stone-850 rounded-2xl border border-stone-800 shadow-xl overflow-hidden">
            {filteredExpenses.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <Wallet className="w-12 h-12 mx-auto text-stone-600 stroke-[1.5]" />
                <p className="text-sm font-medium text-stone-300">အသုံးစရိတ် မှတ်တမ်း မရှိသေးပါ။</p>
                <p className="text-xs text-stone-500">
                  "+ အသုံးစရိတ် အသစ်" ခလုတ်ကို နှိပ်၍ အသုံးစရိတ် စာရင်းသွင်းနိုင်ပါသည်။
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-stone-300">
                  <thead className="bg-stone-900 border-b border-stone-800 text-amber-200 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ရက်စွဲ</th>
                      <th className="px-4 py-3">စရိတ်ခေါင်းစဉ်</th>
                      <th className="px-4 py-3">Category / Sub-Category</th>
                      <th className="px-4 py-3">ပြေစာနံပါတ် / မှတ်ချက်</th>
                      <th className="px-4 py-3 text-right">ကျသင့်ငွေ</th>
                      <th className="px-4 py-3 text-center">လုပ်ဆောင်ချက်</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-stone-800/40 transition">
                        <td className="px-4 py-3 text-stone-400 font-mono text-xs whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-stone-500" />
                            <span>{formatDateDDMMYYYY(exp.date)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-stone-100">
                          {exp.title}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {exp.category}
                            </span>
                            {exp.subCategory && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {exp.subCategory}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-400 text-xs">
                          {exp.receiptNumber && (
                            <span className="font-mono text-stone-300 mr-2">#{exp.receiptNumber}</span>
                          )}
                          <span>{exp.note || '-'}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-rose-300 text-sm whitespace-nowrap">
                          {formatMMK(exp.amount)}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (window.confirm(`"${exp.title}" အသုံးစရိတ် စာရင်းကို ဖျက်ရန် သေချာပါသလား?`)) {
                                onDeleteExpense(exp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                            title="ဖျက်မည်"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: PRE-SET CATEGORY & SUB-CATEGORY SETUP MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Add Main Category Form */}
          <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <h3 className="font-bold text-stone-100 text-base flex items-center gap-2 border-b border-stone-800 pb-3">
              <FolderPlus className="w-5 h-5 text-amber-400" />
              <span>Main Category (အဓိက စရိတ်အမျိုးအစား အသစ်ထည့်ရန်)</span>
            </h3>

            <form onSubmit={handleAddMainCategory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-semibold block">Category အမည်:</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="ဥပမာ- နည်းပညာနှင့် ဖုန်းဘေလ်စရိတ်"
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-medium focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="space-y-1 flex-1">
                  <label className="text-xs text-stone-400 font-semibold block">Badge အရောင်:</label>
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-xl bg-stone-900 border border-stone-700 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition active:scale-95 cursor-pointer shrink-0 mt-5"
                >
                  + Category ထည့်မည်
                </button>
              </div>
            </form>
          </div>

          {/* Configured Categories List with Sub-Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
                
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      style={{ backgroundColor: cat.color || '#f59e0b' }}
                      className="w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-sm"
                    />
                    <h4 className="font-bold text-stone-100 text-base">
                      {cat.name}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMainCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition cursor-pointer"
                    title="Category ဖျက်မည်"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub-Categories List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-300 font-semibold">
                      Sub-Categories (အမျိုးအစားခွဲများ):
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingSubForCatId(cat.id);
                        setNewSubCatInput('');
                      }}
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      + Sub-Category ထည့်မည်
                    </button>
                  </div>

                  {addingSubForCatId === cat.id && (
                    <div className="p-2.5 bg-stone-900 rounded-xl border border-amber-500/50 space-y-2">
                      <input
                        type="text"
                        autoFocus
                        value={newSubCatInput}
                        onChange={(e) => setNewSubCatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubCategory(cat.id);
                          }
                        }}
                        placeholder="Sub-category အမည် ရိုက်ထည့်ပါ..."
                        style={{ fontSize: '16px' }}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAddingSubForCatId(null)}
                          className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-semibold"
                        >
                          မလုပ်တော့ပါ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddSubCategory(cat.id)}
                          className="px-3 py-1 bg-amber-500 text-stone-950 rounded-lg text-xs font-bold"
                        >
                          သိမ်းမည်
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    {cat.subCategories.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200"
                      >
                        <span className="font-semibold">{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubCategory(cat.id, sub)}
                          className="text-stone-500 hover:text-rose-400 transition cursor-pointer p-1"
                          title="Sub-category ဖျက်မည်"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY ANALYTICS VIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-stone-850 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <h3 className="font-bold text-stone-100 text-base flex items-center gap-2 border-b border-stone-800 pb-3">
              <PieChart className="w-5 h-5 text-purple-400" />
              <span>အသုံးစရိတ် အမျိုးအစားအလိုက် ခွဲခြမ်းစိတ်ဖြာချက် (Category Analytics)</span>
            </h3>

            {categoryAnalytics.length === 0 ? (
              <p className="text-center text-stone-500 text-xs py-8">အသုံးစရိတ် မှတ်တမ်း မရှိသေးပါ။</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {categoryAnalytics.map((item) => (
                  <div key={item.catName} className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-rose-300 text-sm">{item.catName}</span>
                      <span className="font-mono font-bold text-rose-400 text-sm">{formatMMK(item.total)}</span>
                    </div>

                    <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className="h-full bg-rose-500 rounded-full"
                      />
                    </div>

                    <div className="text-[11px] text-stone-400 flex justify-between">
                      <span>မှတ်တမ်း {item.count} ခု</span>
                      <span>စုစုပေါင်း၏ {item.percentage}%</span>
                    </div>

                    {/* Sub-categories breakdown */}
                    {item.subBreakdown.length > 0 && (
                      <div className="pt-2 border-t border-stone-800/80 space-y-1.5 text-xs">
                        <span className="text-[11px] text-stone-400 font-semibold block">Sub-Category ခွဲခြမ်းစိတ်ဖြာချက်:</span>
                        {item.subBreakdown.map((sub) => (
                          <div key={sub.subName} className="flex justify-between items-center text-[11px]">
                            <span className="text-stone-300">• {sub.subName}</span>
                            <span className="font-mono text-amber-300 font-semibold">
                              {formatMMK(sub.subTotal)} ({sub.subPercentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW EXPENSE ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-stone-750 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Wallet className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="font-bold text-stone-100 text-base">
                  အသုံးစရိတ် စာရင်းအသစ် ထည့်မည်
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-5 sm:p-6 space-y-4">
              
              {/* Item 1: Expense Title */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-stone-300">
                  စရိတ် ခေါင်းစဉ်/အမည် <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ဥပမာ- ဘုရားပန်းနှင့် ဖယောင်းတိုင် ဝယ်ယူစရိတ်"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 font-medium focus:outline-none focus:border-rose-500 shadow-inner"
                />
              </div>

              {/* Item 2: Main Category Dropdown */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-rose-300">
                    Main Category <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setActiveTab('categories');
                    }}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5" /> Setup ပြုလုပ်ရန်
                  </button>
                </div>
                <select
                  value={selectedMainCategory}
                  onChange={(e) => setSelectedMainCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-rose-500/50 text-rose-200 font-semibold focus:outline-none cursor-pointer shadow-inner"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Item 3: Sub-Category Dropdown */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-amber-300">
                  Sub-Category (အမျိုးအစားခွဲ)
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-amber-500/50 text-amber-200 font-semibold focus:outline-none cursor-pointer shadow-inner"
                >
                  {availableSubCategories.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                  <option value="">+ စိတ်ကြိုက် ရိုက်ထည့်မည်...</option>
                </select>
              </div>

              {/* Optional Custom Sub-Category text input */}
              {(!selectedSubCategory || selectedSubCategory === '') && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-400">
                    စိတ်ကြိုက် Sub-Category အမည်ရိုက်ထည့်ပါ:
                  </label>
                  <input
                    type="text"
                    placeholder="ဥပမာ- ရပ်ကွက် သန့်ရှင်းရေးစရိတ်"
                    value={customSubCategoryInput}
                    onChange={(e) => setCustomSubCategoryInput(e.target.value)}
                    style={{ fontSize: '16px' }}
                    className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Item 4: Amount */}
              <div className="space-y-1">
                <label className="block text-sm font-bold text-stone-300">
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
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-rose-300 font-mono font-bold focus:outline-none focus:border-rose-500 shadow-inner"
                />
              </div>

              {/* Item 5: Date Calendar Picker */}
              <DatePickerInput
                label="ရက်စွဲ"
                required
                value={date}
                onChange={(newVal) => setDate(newVal)}
              />

              {/* Item 6: Receipt Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-400">
                  ပြေစာအမှတ် (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. REC-102"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-200 focus:outline-none"
                />
              </div>

              {/* Item 7: Note */}
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
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs transition cursor-pointer"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>စရိတ်စာရင်း သိမ်းမည်</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
