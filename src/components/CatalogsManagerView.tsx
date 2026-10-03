import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Flame, 
  Plus, 
  Trash2, 
  Tag, 
  Sparkles, 
  DollarSign, 
  X, 
  Save, 
  CheckCircle, 
  XCircle,
  Edit3,
  Layers,
  Search
} from 'lucide-react';
import { AmuletCatalogItem, YatraCatalogItem } from '../types';
import { formatMMK } from '../utils/astrology';

interface CatalogsManagerViewProps {
  yatraCatalog: YatraCatalogItem[];
  amuletCatalog: AmuletCatalogItem[];
  onAddYatraItem: (item: YatraCatalogItem) => void;
  onDeleteYatraItem: (id: string) => void;
  onAddAmuletItem: (item: AmuletCatalogItem) => void;
  onDeleteAmuletItem: (id: string) => void;
  onToggleAmuletStock?: (id: string) => void;
  initialSubTab?: 'yatra' | 'amulets';
  forcedSubTab?: 'yatra' | 'amulets';
}

export const CatalogsManagerView: React.FC<CatalogsManagerViewProps> = ({
  yatraCatalog,
  amuletCatalog,
  onAddYatraItem,
  onDeleteYatraItem,
  onAddAmuletItem,
  onDeleteAmuletItem,
  onToggleAmuletStock,
  initialSubTab,
  forcedSubTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'yatra' | 'amulets'>(forcedSubTab || initialSubTab || 'yatra');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (forcedSubTab) {
      setActiveSubTab(forcedSubTab);
    }
  }, [forcedSubTab]);

  // Yatra Modal State
  const [isAddYatraModalOpen, setIsAddYatraModalOpen] = useState(false);
  const [yatraName, setYatraName] = useState('');
  const [yatraFee, setYatraFee] = useState<number | ''>(30000);
  const [yatraCategory, setYatraCategory] = useState('ယတြာအစီအရင်');
  const [yatraDescription, setYatraDescription] = useState('');

  // Amulet Modal State
  const [isAddAmuletModalOpen, setIsAddAmuletModalOpen] = useState(false);
  const [amuletName, setAmuletName] = useState('');
  const [amuletPrice, setAmuletPrice] = useState<number | ''>(15000);
  const [amuletCategory, setAmuletCategory] = useState('အဆောင်ပစ္စည်း');
  const [amuletDescription, setAmuletDescription] = useState('');

  // Handle Add Yatra
  const handleSaveYatra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yatraName.trim()) {
      alert('ယတြာအမည် ထည့်သွင်းပေးပါ');
      return;
    }
    const newItem: YatraCatalogItem = {
      id: `yatra-cat-${Date.now()}`,
      name: yatraName.trim(),
      defaultFee: Number(yatraFee) || 0,
      category: yatraCategory.trim() || 'ယတြာအစီအရင်',
      description: yatraDescription.trim(),
      inStock: true,
    };
    onAddYatraItem(newItem);
    setIsAddYatraModalOpen(false);
    setYatraName('');
    setYatraFee(30000);
    setYatraCategory('ယတြာအစီအရင်');
    setYatraDescription('');
  };

  // Handle Add Amulet
  const handleSaveAmulet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amuletName.trim()) {
      alert('အဆောင်ပစ္စည်းအမည် ထည့်သွင်းပေးပါ');
      return;
    }
    const newItem: AmuletCatalogItem = {
      id: `amulet-cat-${Date.now()}`,
      name: amuletName.trim(),
      category: amuletCategory.trim() || 'အဆောင်ပစ္စည်း',
      price: Number(amuletPrice) || 0,
      description: amuletDescription.trim(),
      inStock: true,
    };
    onAddAmuletItem(newItem);
    setIsAddAmuletModalOpen(false);
    setAmuletName('');
    setAmuletPrice(15000);
    setAmuletCategory('အဆောင်ပစ္စည်း');
    setAmuletDescription('');
  };

  const filteredYatra = yatraCatalog.filter(y => 
    y.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (y.category && y.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAmulets = amuletCatalog.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-stone-850 p-6 rounded-2xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-200">
              ယတြာ & အဆောင် ကတ်တလောက်များ (Catalogs Manager)
            </h2>
            <p className="text-xs text-stone-400">
              စိတ်ကြိုက် ယတြာနှင့် အဆောင်ပစ္စည်းများကို စာရင်းသွင်း၍ Entry Page (မေးသူစာရင်းသွင်းမျက်နှာပြင်) တွင် တိုက်ရိုက်ချိတ်ဆက် အသုံးပြုနိုင်ပါသည်
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'yatra' ? (
            <button
              onClick={() => setIsAddYatraModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ ယတြာ အသစ်ထည့်မည်</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddAmuletModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ အဆောင် အသစ်ထည့်မည်</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Yatra Catalog vs Amulet Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800 self-start">
          <button
            onClick={() => setActiveSubTab('yatra')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeSubTab === 'yatra'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>ယတြာ Catalog ({yatraCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('amulets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeSubTab === 'amulets'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>အဆောင် Catalog ({amuletCatalog.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="အမည် သို့မဟုတ် အမျိုးအစားဖြင့် ရှာရန်..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-900 border border-stone-700 text-stone-200 placeholder-stone-500 focus:border-amber-400"
          />
        </div>
      </div>

      {/* TAB 1: YATRA CATALOG GRID */}
      {activeSubTab === 'yatra' && (
        <div className="space-y-4">
          {filteredYatra.length === 0 ? (
            <div className="text-center py-12 bg-stone-850 rounded-2xl border border-stone-800 p-6 space-y-3">
              <Flame className="w-10 h-10 text-amber-500/40 mx-auto" />
              <p className="text-stone-400 text-sm">ယတြာ ကတ်တလောက်တွင် မှတ်တမ်း မရှိသေးပါ။</p>
              <button
                onClick={() => setIsAddYatraModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs inline-flex items-center gap-1.5 hover:bg-amber-400 transition"
              >
                <Plus className="w-4 h-4" /> ယတြာ အသစ်ထည့်မည်
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredYatra.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-850 rounded-2xl border border-stone-800 p-4 shadow-lg flex flex-col justify-between hover:border-amber-500/50 transition group space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/80 font-medium">
                        {item.category || 'ယတြာအစီအရင်'}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${item.name}" ကို ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                            onDeleteYatraItem(item.id);
                          }
                        }}
                        className="text-stone-500 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="ဖျက်မည်"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-stone-100 text-sm sm:text-base mt-2 group-hover:text-amber-300">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">ကုန်ကျငွေ / အလှူငွေ:</span>
                    <strong className="text-sm font-mono font-bold text-amber-400">
                      {formatMMK(item.defaultFee)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AMULETS CATALOG GRID */}
      {activeSubTab === 'amulets' && (
        <div className="space-y-4">
          {filteredAmulets.length === 0 ? (
            <div className="text-center py-12 bg-stone-850 rounded-2xl border border-stone-800 p-6 space-y-3">
              <ShoppingBag className="w-10 h-10 text-purple-500/40 mx-auto" />
              <p className="text-stone-400 text-sm">အဆောင်ပစ္စည်း ကတ်တလောက်တွင် မှတ်တမ်း မရှိသေးပါ။</p>
              <button
                onClick={() => setIsAddAmuletModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs inline-flex items-center gap-1.5 hover:bg-purple-500 transition"
              >
                <Plus className="w-4 h-4" /> အဆောင် အသစ်ထည့်မည်
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAmulets.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-850 rounded-2xl border border-stone-800 p-4 shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition group space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/80 text-purple-300 border border-purple-800/80 font-medium">
                        {item.category || 'အဆောင်ပစ္စည်း'}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${item.name}" ကို ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
                            onDeleteAmuletItem(item.id);
                          }
                        }}
                        className="text-stone-500 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="ဖျက်မည်"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-stone-100 text-sm sm:text-base mt-2 group-hover:text-purple-300">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">ဈေးနှုန်း:</span>
                    <strong className="text-sm font-mono font-bold text-amber-400">
                      {formatMMK(item.price)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Yatra Item */}
      {isAddYatraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-stone-850 p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>ယတြာ အသစ် ထည့်သွင်းခြင်း</span>
              </div>
              <button
                onClick={() => setIsAddYatraModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveYatra} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  ယတြာ အမည် *
                </label>
                <input
                  type="text"
                  placeholder="ဥပမာ- ၉ ရက်နဝင်းယတြာ၊ စီးပွားလာဘ်ရွှင်ယတြာ"
                  value={yatraName}
                  onChange={(e) => setYatraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  ယတြာ ကုန်ကျငွေ / သတ်မှတ်စရိတ် (ကျပ်) *
                </label>
                <input
                  type="number"
                  placeholder="30000"
                  value={yatraFee}
                  onChange={(e) => setYatraFee(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold text-right focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  အမျိုးအစား (Category)
                </label>
                <input
                  type="text"
                  placeholder="ဥပမာ- နဝင်းယတြာ / လာဘ်ရွှင် / အန္တရာယ်ကင်း"
                  value={yatraCategory}
                  onChange={(e) => setYatraCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  ဆောင်ရွက်ရန် ညွှန်ကြားချက် / မှတ်ချက်
                </label>
                <textarea
                  rows={3}
                  placeholder="ယတြာ ပြုလုပ်ပုံ အကျဉ်း..."
                  value={yatraDescription}
                  onChange={(e) => setYatraDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddYatraModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow"
                >
                  ကတ်တလောက်တွင် သိမ်းမည်
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Amulet Item */}
      {isAddAmuletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-purple-500/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-stone-850 p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <span>အဆောင်ပစ္စည်း အသစ် ထည့်သွင်းခြင်း</span>
              </div>
              <button
                onClick={() => setIsAddAmuletModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAmulet} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  အဆောင်ပစ္စည်း အမည် *
                </label>
                <input
                  type="text"
                  placeholder="ဥပမာ- နဝရတ်လက်စွပ်၊ သပြေညွန့်၊ မင်္ဂလာပရိတ်ကြိုး"
                  value={amuletName}
                  onChange={(e) => setAmuletName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  ဈေးနှုန်း (ကျပ်) *
                </label>
                <input
                  type="number"
                  placeholder="15000"
                  value={amuletPrice}
                  onChange={(e) => setAmuletPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold text-right focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  အမျိုးအစား (Category)
                </label>
                <input
                  type="text"
                  placeholder="ဥပမာ- လက်ဝတ်ရတနာ / အင်းအစီအရင် / ပရိတ်ပစ္စည်း"
                  value={amuletCategory}
                  onChange={(e) => setAmuletCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  အသေးစိတ် ဖော်ပြချက် (မှတ်ချက်)
                </label>
                <textarea
                  rows={3}
                  placeholder="ပစ္စည်း အကြောင်းအရာ..."
                  value={amuletDescription}
                  onChange={(e) => setAmuletDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-purple-400 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddAmuletModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-semibold"
                >
                  မလုပ်တော့ပါ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow"
                >
                  ကတ်တလောက်တွင် သိမ်းမည်
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
