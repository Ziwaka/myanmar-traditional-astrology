import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  DollarSign, 
  FileText, 
  PieChart, 
  X, 
  Save 
} from 'lucide-react';
import { ExpenseCategory, ExpenseRecord } from '../types';
import { formatMMK, EXPENSE_CATEGORIES } from '../utils/astrology';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense form state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('yatra_materials');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(todayStr);
  const [note, setNote] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.note && e.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.receiptNumber && e.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [expenses, searchTerm, categoryFilter]);

  // Overall totals
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('ကျေးဇူးပြု၍ စရိတ်ခေါင်းစဉ်နှင့် ငွေပမာဏ မှန်ကန်စွာ ထည့်သွင်းပေးပါ။');
      return;
    }

    const newExpense: ExpenseRecord = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      category,
      amount: Number(amount),
      date: date || todayStr,
      note: note.trim(),
      receiptNumber: receiptNumber.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onAddExpense(newExpense);
    setIsAddModalOpen(false);

    // Reset fields
    setTitle('');
    setAmount('');
    setNote('');
    setReceiptNumber('');
  };

  const getCategoryLabel = (cat: string) => {
    return EXPENSE_CATEGORIES.find(c => c.key === cat)?.label || cat;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-rose-200">
              ဗေဒင်နှင့် ယတြာလုပ်ငန်း အသုံးစရိတ် မှတ်တမ်း (Expenses)
            </h2>
            <p className="text-xs text-stone-400">
              ယတြာပစ္စည်းဝယ်ယူမှု၊ ပန်းဆီမီး၊ ကန်တော့ပွဲစရိတ်၊ ရုံးသုံးနှင့် အထွေထွေ အသုံးစရိတ်များ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>အသုံးစရိတ် အသစ်ထည့်ရန်</span>
        </button>
      </div>

      {/* Quick Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {EXPENSE_CATEGORIES.map((cat) => {
          const catSum = expenses
            .filter(e => e.category === cat.key)
            .reduce((s, e) => s + e.amount, 0);

          return (
            <div key={cat.key} className="bg-stone-850 p-3 rounded-xl border border-stone-800 text-xs">
              <span className="text-stone-400 truncate block font-medium" title={cat.label}>
                {cat.label}
              </span>
              <strong className="text-sm font-mono font-bold text-rose-300 mt-1 block">
                {formatMMK(catSum)}
              </strong>
            </div>
          );
        })}
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="ခေါင်းစဉ်၊ ပြေစာအမှတ်၊ မှတ်ချက်ဖြင့် ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded-lg px-3 py-2 focus:border-rose-500 cursor-pointer"
          >
            <option value="all">အသုံးစရိတ် အားလုံး</option>
            {EXPENSE_CATEGORIES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>

          <span className="text-xs text-stone-400">
            စုစုပေါင်း ကုန်ကျငွေ: <strong className="text-rose-400 font-mono text-sm">{formatMMK(totalAmount)}</strong>
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-stone-850 rounded-xl border border-stone-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-900/90 text-stone-400 uppercase tracking-wider text-xs border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">ရက်စွဲ</th>
                <th className="py-3 px-4">ခေါင်းစဉ် & မှတ်ချက်</th>
                <th className="py-3 px-4">အမျိုးအစား</th>
                <th className="py-3 px-4">ပြေစာအမှတ်</th>
                <th className="py-3 px-4 text-right">ငွေပမာဏ</th>
                <th className="py-3 px-4 text-center">ဖျက်ရန်</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-stone-500">
                    အသုံးစရိတ် မှတ်တမ်း မရှိသေးပါ။
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-800/50 transition">
                    <td className="py-3 px-4 font-mono text-stone-300 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-100">{exp.title}</div>
                      {exp.note && <div className="text-xs text-stone-400">{exp.note}</div>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {getCategoryLabel(exp.category)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-400">
                      {exp.receiptNumber || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-300 whitespace-nowrap">
                      {formatMMK(exp.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(`"${exp.title}" စရိတ်စာရင်းကို ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-rose-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-base text-rose-200">အသုံးစရိတ် အသစ်မှတ်တမ်းတင်ရန်</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-300 mb-1">စရိတ်ခေါင်းစဉ် *</label>
                <input
                  type="text"
                  placeholder="ဥပမာ - နဝင်းယတြာ အမွှေးတိုင် ၅ ထုပ် ဝယ်ယူမှု"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-stone-100 focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">အသုံးစရိတ် အမျိုးအစား</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-stone-100 focus:border-rose-500 cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">ကုန်ကျငွေ (ကျပ်) *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-rose-300 font-mono font-bold focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">ရက်စွဲ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-stone-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">ပြေစာအမှတ် (Voucher No)</label>
                  <input
                    type="text"
                    placeholder="VOU-001"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-stone-200 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">အသေးစိတ် မှတ်ချက်</label>
                <textarea
                  rows={2}
                  placeholder="ပစ္စည်းဝယ်ယူသည့် ဆိုင်၊ အသေးစိတ် မှတ်စု..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-850 border border-stone-700 text-stone-200 focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-850">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>စရိတ်စာရင်း သွင်းမည်</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
