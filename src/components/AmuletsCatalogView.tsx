import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Tag, 
  Sparkles, 
  DollarSign, 
  X, 
  Save, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { AmuletCatalogItem, DayOfWeekBurmese } from '../types';
import { BURMESE_DAYS, formatMMK } from '../utils/astrology';

interface AmuletsCatalogViewProps {
  catalog: AmuletCatalogItem[];
  onAddCatalogItem: (item: AmuletCatalogItem) => void;
  onDeleteCatalogItem: (id: string) => void;
  onToggleStock: (id: string) => void;
}

export const AmuletsCatalogView: React.FC<AmuletsCatalogViewProps> = ({
  catalog,
  onAddCatalogItem,
  onDeleteCatalogItem,
  onToggleStock,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('အင်း/အစီအရင်');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [suggestedDay, setSuggestedDay] = useState<DayOfWeekBurmese | 'အားလုံး'>('အားလုံး');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || Number(price) <= 0) {
      alert('ကျေးဇူးပြု၍ အဆောင်အမည်နှင့် ဈေးနှုန်း ထည့်သွင်းပေးပါ။');
      return;
    }

    const newItem: AmuletCatalogItem = {
      id: `amulet-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description: description.trim(),
      suggestedDay,
      inStock: true,
    };

    onAddCatalogItem(newItem);
    setIsAddModalOpen(false);

    setName('');
    setPrice('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-purple-200">
              အဆောင်ပစ္စည်း & ယတြာပစ္စည်း ကတ်တလောက် (POS Inventory)
            </h2>
            <p className="text-xs text-stone-400">
              နဝရတ်လက်စွပ်၊ အင်းပြား၊ ရုပ်ပွားတော်၊ ပရိတ်ကြိုးနှင့် ကန်တော့ပွဲ စရိတ်စကများ စီမံခြင်း
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>အဆောင်ပစ္စည်း အသစ်ထည့်ရန်</span>
        </button>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {catalog.map((item) => (
          <div
            key={item.id}
            className="bg-stone-850 rounded-2xl border border-stone-800 p-5 shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition group space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] bg-stone-900 text-stone-400 border border-stone-800">
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleStock(item.id)}
                  title={item.inStock ? 'ပစ္စည်းလက်ကျန်ရှိ (နှိပ်၍ မရှိကြောင်းပြောင်းနိုင်သည်)' : 'ပစ္စည်းပြတ်နေ'}
                  className="cursor-pointer"
                >
                  {item.inStock ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle className="w-3 h-3" /> ရှိသည်
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                      <XCircle className="w-3 h-3" /> ပြတ်နေ
                    </span>
                  )}
                </button>
              </div>

              <h3 className="font-bold text-base text-stone-100 group-hover:text-purple-300 transition mt-2">
                {item.name}
              </h3>

              {item.description && (
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-stone-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">သင့်တော်သည့်နေ့နံ:</span>
                <span className="text-amber-300 font-medium">{item.suggestedDay || 'အားလုံး'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base font-bold font-mono text-purple-300">
                  {formatMMK(item.price)}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`"${item.name}" အဆောင်ပစ္စည်းကို ကတ်တလောက်မှ ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                      onDeleteCatalogItem(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 text-stone-400 hover:text-rose-300 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-stone-900 border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-purple-200">အဆောင်ပစ္စည်း အသစ်ထည့်သွင်းရန်</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">ပစ္စည်းအမည် <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  placeholder="ဥပမာ - မဟာလာဘံ အင်းပြား"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 focus:border-purple-500 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">အမျိုးအစား</label>
                <input
                  type="text"
                  placeholder="ကျောက်မျက်/အင်း/ကန်တော့ပွဲ"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 focus:border-purple-500 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">သတ်မှတ်ဈေးနှုန်း (ကျပ်) <span className="text-rose-400">*</span></label>
                <input
                  type="number"
                  placeholder="25000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-purple-300 font-mono font-bold focus:border-purple-500 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">သင့်တော်သည့် နေ့နံ</label>
                <select
                  value={suggestedDay}
                  onChange={(e) => setSuggestedDay(e.target.value as any)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-200 focus:border-purple-500 cursor-pointer shadow-inner"
                >
                  <option value="အားလုံး">အားလုံးနှင့် သင့်တော်သည်</option>
                  {BURMESE_DAYS.map(d => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-stone-300">အသေးစိတ် ဖော်ပြချက်</label>
                <textarea
                  rows={2}
                  placeholder="အစွမ်းသတ္တိ၊ အသုံးပြုပုံ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full px-3.5 py-3 rounded-xl bg-stone-850 border border-stone-700 text-stone-200 focus:border-purple-500 shadow-inner"
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
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ကတ်တလောက် သိမ်းဆည်းမည်</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
